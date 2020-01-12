import { MenuItem, MenuItemOrDiv } from './menuItem'
import { ItemContainer} from './types/itemContainer'
import { Divider } from './divider'
import { isMenuClicked } from './menu'
import { hasAncestor } from './util'
import { MenuComponent } from './types/menuComponent'
import { Direction } from './types/direction'
import { Box } from './types/box'

export class Toolbar implements ItemContainer {
    public readonly elem = document.createElement('div')
    private readonly items: MenuComponent[]
    public selected: MenuItem | null = null
    public parent: MenuComponent | null = null

    private isInitialized = false

    private previousActive: Element | null = null

    public readonly canHide = false

    private hideCb = (e: { target: EventTarget | null }) => {
        this.hideMenu(e)
    }

    constructor(items: MenuItemOrDiv[]) {
        this.items = items.map(it => it === 'divider' ? new Divider(this) : new MenuItem(this, it))
    }

    private initElement() {
        if (!this.isInitialized) {
            this.isInitialized = true

            this.elem.classList.add('toolbar')
            this.elem.append.apply(this.elem, this.items.map(it => it.elem))

            this.items.forEach(it => {
                if (it instanceof MenuItem) {
                    this.initItemForExpansion(it)
                }
            })
        }
    }

    public show(parent: MenuComponent | null, element?: HTMLElement) {
        this.parent = parent
        this.initElement()

        this.items.forEach(item => item.show())
        element?.append(this.elem)
    }

    public hide() {
        if (this.canHide) {
            this.elem.remove()
            this.items.forEach(item => item.hide())
        } else if (this.selected) {
            this.hideMenu({ target: null, force: true })
        }
    }

    public hideAll() {
        this.hideMenu({ target: null, force: true })
        this.selected = null
    }

    public getBox(): Box {
        return Box.fromElem(this.elem)
    }

    public getPreferredDirection(): Direction {
        return Direction.Down
    }

    public mouseEnterChild(child: MenuComponent) {
        if (this.selected != null && child instanceof MenuItem) {
            this.selected.hideChildren()
            this.selected = child
            this.selected.elem.focus()

            if (child.action == null && child.child) {
                this.selected.showChildren()
            }
        }
    }

    public forceEnterChild(child: MenuItem) {
        if (this.selected != null) {
            this.selected.hideChildren()
        }
        this.selected = child

        this.selected.showChildren()

        window.addEventListener('mousedown', this.hideCb)
        window.addEventListener('touchstart', this.hideCb)
        window.addEventListener('click', this.hideCb)
        window.addEventListener('blur', this.hideCb)
    }

    public mouseLeaveChild(child: MenuComponent) {
    }

    public pressEscape() {
        const leaf = this.leaf()
        leaf instanceof MenuItem
            ? leaf.parent.hide()
            : leaf.hide()
    }

    public pressArrow(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
        if (this.selected == null) return
        let ix
        let item
        switch (key) {
            case 'ArrowUp':
                if (this.selected.child) {
                    const child = this.selected.child
                    if (!child.visible) {
                        this.selected.showChildren()
                    }
                    child.selectChild(child.children[child.children.length - 1])
                }
                break
            case 'ArrowDown':
                if (this.selected.child) {
                    const child = this.selected.child
                    if (!child.visible) {
                        this.selected.showChildren()
                    }
                    child.selectChild(child.children[0])
                }
                break
            case 'ArrowLeft':
                ix = this.items.findIndex(it => it === this.selected)
                if (ix >= 0) {
                    ix = (ix + this.items.length - 1) % this.items.length
                    item = this.items[ix]
                    if (item instanceof MenuItem) {
                        this.forceEnterChild(item)
                    }
                }
                break
            case 'ArrowRight':
                ix = this.items.findIndex(it => it === this.selected)
                if (ix >= 0) {
                    ix = (ix + 1) % this.items.length
                    item = this.items[ix]
                    if (item instanceof MenuItem) {
                        this.forceEnterChild(item)
                    }
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

    private initItemForExpansion(item: MenuItem) {
        item.elem.addEventListener('mousedown', () => {
            if (this.selected == null) this.previousActive = document.activeElement
        })
        item.elem.addEventListener('click', e => {
            if (e.button === 0) {
                if (this.selected != null) {
                    this.selected.hideChildren()
                    this.selected = null

                    if (this.previousActive instanceof HTMLElement) this.previousActive.focus()
                } else if (item.child) {
                    this.forceEnterChild(item)
                }
            }
        })
    }

    private hideMenu(ev: { target: EventTarget | null, force?: true }) {
        if (isMenuClicked() && !ev.force) return

        if (this.selected != null) {
            // prevents closing the menu right after opening it
            if (ev.target instanceof HTMLElement && hasAncestor(ev.target, this.selected.elem)) return

            this.selected.hideChildren()
            this.selected = null

            if (this.previousActive instanceof HTMLElement) this.previousActive.focus()
        }

        window.removeEventListener('mousedown', this.hideCb)
        window.removeEventListener('click', this.hideCb)
        window.removeEventListener('touchstart', this.hideCb)
        window.removeEventListener('blur', this.hideCb)
    }
}
