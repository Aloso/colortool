import { MenuItem, MenuItemOrDiv } from './menuItem'
import { ItemContainer, MenuComponent } from './itemContainer'
import { Divider } from './divider'
import { isMenuClicked } from './menu'
import { hasAncestor } from './util'

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

    public show(parent: MenuComponent | null, options: undefined, element?: HTMLElement) {
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

    public enterChild(child: MenuComponent) {
        if (this.selected != null && child instanceof MenuItem) {
            this.selected.hideChildren()
            this.selected = child
            this.selected.elem.focus()

            if (child.action == null && child.child) {
                const bbox = this.selected.elem.getBoundingClientRect()
                this.selected.showChildren({ x: bbox.left, y: bbox.bottom })
            }
        }
    }

    public selectChild(child: MenuComponent) {
        if (this.selected != null && child instanceof MenuItem) {
            this.selected.hideChildren()
            this.selected = child
            this.selected.elem.focus()
            this.selected.elem.classList.add('hovered')
            console.log(this.selected)
        }
    }

    public leaveChild(child: MenuComponent) {
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
        switch (key) {
            case 'ArrowUp':
                if (this.selected.child) {
                    const child = this.selected.child
                    if (!child.visible) {
                        const bbox = this.selected.elem.getBoundingClientRect()
                        this.selected.showChildren({ x: bbox.left, y: bbox.bottom })
                    }
                    child.enterChild(child.children[child.children.length - 1])
                }
                break
            case 'ArrowDown':
                if (this.selected.child) {
                    const child = this.selected.child
                    if (!child.visible) {
                        const bbox = this.selected.elem.getBoundingClientRect()
                        this.selected.showChildren({ x: bbox.left, y: bbox.bottom })
                    }
                    child.enterChild(child.children[0])
                }
                break
            case 'ArrowLeft':
                ix = this.items.findIndex(it => it === this.selected)
                if (ix >= 0) {
                    ix = (ix + this.items.length - 1) % this.items.length
                    this.selectChild(this.items[ix])
                }
                break
            case 'ArrowRight':
                ix = this.items.findIndex(it => it === this.selected)
                if (ix >= 0) {
                    ix = (ix + 1) % this.items.length
                    this.selectChild(this.items[ix])
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
                    this.selected = item

                    const bbox = this.selected.elem.getBoundingClientRect()
                    this.selected.showChildren({ x: bbox.left, y: bbox.bottom })

                    document.body.addEventListener('mousedown', this.hideCb)
                    document.body.addEventListener('touchstart', this.hideCb)
                    document.body.addEventListener('click', this.hideCb)
                    document.body.addEventListener('blur', this.hideCb)
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

        document.body.removeEventListener('mousedown', this.hideCb)
        document.body.removeEventListener('click', this.hideCb)
        document.body.removeEventListener('touchstart', this.hideCb)
        document.body.removeEventListener('blur', this.hideCb)
    }
}
