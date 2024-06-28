import { MenuItem, MenuItemOrDiv } from './menuItem'
import { ItemContainer } from './types/itemContainer'
import { Divider } from './divider'
import { Toolbar } from './toolbar'
import { MenuComponent } from './types/menuComponent'
import { Direction, directionMin, inverse, pivot } from './types/direction'
import { Box } from './types/box'

let clickedMenu: Menu | null = null

export function isMenuClicked(): boolean {
    return clickedMenu != null
}

window.addEventListener('mouseup', () => setTimeout(() => (clickedMenu = null)))
window.addEventListener('blur', () => setTimeout(() => (clickedMenu = null)))

export class Menu implements ItemContainer {
    public readonly elem = document.createElement('div')
    public parent: MenuComponent | null = null

    public visible = false
    public selected: MenuItem | null = null

    public readonly children: MenuComponent[]

    private isInitialized = false

    public readonly canHide = true

    public isHovered = false

    public hoveredMenuItem: MenuItem | null = null

    constructor(items: MenuItemOrDiv[]) {
        this.children = items.map(c => (c === 'divider' ? new Divider(this) : new MenuItem(this, c)))
    }

    public getBox(): Box {
        return Box.fromElem(this.elem)
    }

    private initElement() {
        if (!this.isInitialized) {
            this.isInitialized = true

            this.elem.className = 'menu'
            this.elem.append(...this.children.map(it => it.elem))

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

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            this.elem.addEventListener('mousedown', () => (clickedMenu = this))
        }
    }

    public show(parent: MenuComponent | null, element?: HTMLElement) {
        if (parent == null || element == null) throw new Error('argument is missing')
        this.parent = parent
        this.initElement()
        this.visible = true

        this.children.forEach(item => item.show())
        element.appendChild(this.elem)

        this.setPosition(this.parent)
    }

    private setPosition(parent: MenuComponent) {
        const size = this.getBox()
        let parentBox = parent.getBox()
        const docBox = Box.fromDocument()

        const dir = parent.parent.getPreferredDirection()
        const dirInv = inverse(dir)

        const required = Math.abs(size[dir] - size[dirInv])
        const space = Math.abs(docBox[dir] - parentBox[dir])
        const altSpace = Math.abs(docBox[dirInv] - parentBox[dirInv])

        const direction = required > space && altSpace > space ? dirInv : dir
        if (direction === Direction.Right || direction === Direction.Left) {
            parentBox = parentBox.addPadding(0, 5)
        }

        const pDir = pivot(dir)
        const pDirInv = inverse(pDir)
        const pDirMin = directionMin(pDir)
        const pDirMax = inverse(pDirMin)

        const pRequired = Math.abs(size[pDir] - size[pDirInv])
        const pSpace = docBox[pDirMax] - parentBox[pDirMin]

        const pStart = pRequired <= pSpace ? parentBox[pDirMin] : Math.max(0, docBox[pDirMax] - pRequired)

        let x: number
        let y: number
        switch (direction) {
            case Direction.Left:
                x = Math.max(0, parentBox.left - required)
                y = pStart
                break
            case Direction.Up:
                x = pStart
                y = Math.max(0, parentBox.top - required)
                break
            case Direction.Right:
                x = parentBox.right
                y = pStart
                break
            case Direction.Down:
                x = pStart
                y = parentBox.bottom
                break
        }

        this.elem.style.left = x + 'px'
        this.elem.style.top = y + 'px'
    }

    public hide() {
        if (this.canHide) {
            this.children.forEach(item => item.hide())
            this.elem.remove()
            this.selected = null
            this.visible = false

            this.elem.style.left = '0px'
            this.elem.style.top = '0px'

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

    public getPreferredDirection(): Direction {
        return Direction.Right
    }

    public mouseEnterChild(child: MenuComponent) {
        if (child instanceof MenuItem) {
            if (this.selected != null) {
                this.selected.hide()
            }
            this.selected = child
            child.showChildren()
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

    public mouseLeaveChild(child: MenuComponent) {
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
            case 'ArrowRight': {
                if (this.selected == null) this.selectChild(this.children[0])
                if (this.selected == null) return
                this.mouseEnterChild(this.selected)
                const child = this.selected.child
                if (child != null) {
                    child.selectChild(child.children[0])
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
    }

    public leaf(): MenuComponent | ItemContainer {
        if (this.selected != null) return this.selected.leaf()
        return this
    }

    public leafMenuItem(): MenuItem | null {
        return this.selected?.leafMenuItem() ?? null
    }
}
