import { MenuItem, MenuItemOrDiv } from './menuItem'
import { Corner, cornerMappings, Size } from '../util/dimensions'
import { ItemContainer, MenuComponent } from './itemContainer'
import { Divider } from './divider'

let clickedMenu: Menu | null = null

export function isMenuClicked(): boolean {
    return clickedMenu != null
}

window.addEventListener('mouseup', () => setTimeout(() => clickedMenu = null))
window.addEventListener('blur', () => setTimeout(() => clickedMenu = null))

export class Menu implements ItemContainer {
    public readonly elem = document.createElement('div')
    public parent: MenuComponent | null = null

    public hoveredChild: MenuComponent | null = null

    public readonly items: MenuComponent[]

    private isInitialized = false

    isHovered = false
    private _size: Size | null = null

    public hoveredMenuItem: MenuItem | null = null

    private x = 0
    private y = 0

    constructor(items: MenuItemOrDiv[], private corner = Corner.TopLeft) {
        this.items = items.map(c => c === 'divider' ? new Divider(this) : new MenuItem(this, c))
    }

    public get size(): Size {
        if (this._size != null) return this._size
        this._size = this.elem.getBoundingClientRect()
        return this._size
    }

    /**
     * Sets the position of the menu. It ensures that the menu is inside of the `winSize` dimensions.
     * @param x - x coordinate of the corner
     * @param y - y coordinate of the corner
     * @param corner - specifies which corner is positioned
     * @param winSize - size of the window, or of the area within which the menu should appear
     */
    public setPosition(x: number, y: number, corner: Corner, winSize: Size) {
        this.corner = corner

        const { width, height } = this.size
        // TODO maybe also modify left/top corner of `winSize`

        switch (this.corner) {
            case Corner.TopLeft:
                x = Math.min(x + width, winSize.width) - width
                y = Math.min(y + height, winSize.height) - height
                break
            case Corner.TopRight:
                x = Math.max(x - width, 0) + width
                y = Math.min(y + height, winSize.height) - height
                break
            case Corner.BottomLeft:
                x = Math.min(x + width, winSize.width) - width
                y = Math.max(y - height, 0) + height
                break
            case Corner.BottomRight:
                x = Math.max(x - width, 0) + width
                y = Math.max(y - height, 0) + height
                break
        }

        const props = cornerMappings[this.corner]
        this.elem.style[props[1]] = x + 'px'
        this.elem.style[props[0]] = y + 'px'

        this.x = x
        this.y = y
    }

    private initElement() {
        if (!this.isInitialized) {
            this.isInitialized = true

            this.elem.className = 'menu'
            this.elem.append.apply(this.elem, this.items.map(it => it.elem))

            const props = cornerMappings[this.corner]
            this.elem.style[props[1]] = this.x + 'px'
            this.elem.style[props[0]] = this.y + 'px'

            this.elem.addEventListener('mouseenter', () => {
                this.isHovered = true
            })
            this.elem.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    const isChildHovered = this.hoveredMenuItem?.child?.isHovered ?? false
                    if (!isChildHovered) {
                        this.isHovered = false
                    }
                })
            })

            this.elem.addEventListener('mousedown', () => clickedMenu = this)
        }
    }

    public show(parent: MenuComponent | null, options?: { x: number, y: number }, element?: HTMLElement) {
        if (options == null || element == null) throw new Error('argument is missing')
        this.parent = parent
        this.initElement()

        this.setPosition(options.x, options.y, this.corner, {
            width: window.innerWidth,
            height: window.innerHeight,
        })

        this.items.forEach(item => item.show())
        element.appendChild(this.elem)
    }

    public hide() {
        this.items.forEach(item => item.hide())
        this.elem.remove()
    }

    public hideAll() {
        if (this.parent) {
            this.parent.hideAll()
        } else {
            // only if this is the root
            this.hide()
        }
    }

    public enterChild(child: MenuComponent) {
        if (child instanceof MenuItem) {
            if (this.hoveredChild != null) {
                this.hoveredChild.hide()
            }
            this.hoveredChild = child
            const bbox = child.elem.getBoundingClientRect()
            child.showChildren({ x: bbox.right, y: bbox.top - 5 })
        }
    }

    public leaveChild(child: MenuComponent) {
        if (child instanceof MenuItem) {
            if (child === this.hoveredChild) this.hoveredChild = null
            child.hideChildren()
        }
    }

    public pressEscape() {
        this.hide()
    }
}