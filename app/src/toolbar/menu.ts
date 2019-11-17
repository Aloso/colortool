import { MenuItem, MenuItemOrDiv } from './menuItem'
import { Corner, cornerMappings, Size } from '../util/dimensions'
import { ItemContainer, MenuComponent } from './itemContainer'
import { Divider } from './divider'
import { Toolbar } from './toolbar'

let clickedMenu: Menu | null = null

export function isMenuClicked(): boolean {
    return clickedMenu != null
}

window.addEventListener('mouseup', () => setTimeout(() => clickedMenu = null))
window.addEventListener('blur', () => setTimeout(() => clickedMenu = null))

export class Menu implements ItemContainer {
    public readonly elem = document.createElement('div')
    public parent: MenuComponent | null = null

    public visible = false
    public selected: MenuItem | null = null

    public readonly children: MenuComponent[]

    private isInitialized = false

    public readonly canHide = true

    isHovered = false
    private _size: Size | null = null

    public hoveredMenuItem: MenuItem | null = null

    private x = 0
    private y = 0

    constructor(items: MenuItemOrDiv[], private corner = Corner.TopLeft) {
        this.children = items.map(c => c === 'divider' ? new Divider(this) : new MenuItem(this, c))
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
            this.elem.append.apply(this.elem, this.children.map(it => it.elem))

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
        this.visible = true

        this.setPosition(options.x, options.y, this.corner, {
            width: window.innerWidth,
            height: window.innerHeight,
        })

        this.children.forEach(item => item.show())
        element.appendChild(this.elem)
    }

    public hide() {
        if (this.canHide) {
            this.children.forEach(item => item.hide())
            this.elem.remove()
            this.selected = null
            this.visible = false

            if (this.parent) this.parent.elem.focus()
        }
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
            if (this.selected != null) {
                this.selected.hide()
            }
            this.selected = child
            const bbox = child.elem.getBoundingClientRect()
            child.showChildren({ x: bbox.right, y: bbox.top - 5 })
        }
    }

    public selectChild(child: MenuComponent) {
        if (child instanceof MenuItem) {
            if (this.selected != null) {
                this.selected.hide()
            }
            this.selected = child
            this.selected.elem.classList.add('hovered')
            this.selected.elem.focus()
        }
    }

    public leaveChild(child: MenuComponent) {
        if (child instanceof MenuItem) {
            if (child === this.selected) this.selected = null
            child.hideChildren()
        }
    }

    public pressEscape() {
        const leaf = this.leaf()
        if (leaf instanceof MenuItem) {
            leaf.parent.hide()
        } else {
            leaf.hide()
        }
    }

    public pressArrow(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
        if (!this.visible) return
        let ix
        switch (key) {
            case 'ArrowUp':
                ix = this.children.findIndex(ch => ch === this.selected)
                if (ix === -1) ix = this.children.length
                ix = (ix + this.children.length - 1) % this.children.length
                this.selectChild(this.children[ix])
                break
            case 'ArrowDown':
                ix = this.children.findIndex(ch => ch === this.selected)
                ix = (ix + 1) % this.children.length
                this.selectChild(this.children[ix])
                break
            case 'ArrowLeft':
                if (this.parent != null) {
                    if (this.parent.parent instanceof Toolbar) {
                        this.parent.parent.pressArrow('ArrowLeft')
                    } else {
                        this.hide()
                    }
                }
                break
            case 'ArrowRight':
                if (this.selected == null) this.selectChild(this.children[0])
                if (this.selected == null) return
                this.enterChild(this.selected)
                const child = this.selected.child
                if (child != null) {
                    child.selectChild(child.children[0])
                } else {
                    let root: ItemContainer | MenuComponent | null = this
                    do {
                        root = root.parent
                        if (root instanceof Toolbar) {
                            root.pressArrow('ArrowRight')
                            break
                        }
                    } while (root != null)
                }
                break

        }
    }

    public leaf(): MenuComponent | ItemContainer {
        if (this.selected != null) return this.selected.leaf()
        return this
    }

    public leafMenuItem(): MenuItem | null {
        return this.selected?.leafMenuItem() ?? null
    }
}
