import { MenuItem } from './menuItem'
import { MenuComponent } from './itemContainer'
import { isMenuClicked } from './menu'
import { hasAncestor } from './util'

export class ItemClickExpander {
    private openItem: MenuItem | null = null
    private previousActive: Element | null = null

    private hideCb = (e: { target: EventTarget | null }) => {
        this.hideMenu(e)
    }

    constructor(items: MenuComponent[]) {
        items.forEach(it => {
            if (it instanceof MenuItem) this.initItem(it)
        })
    }

    private initItem(item: MenuItem) {
        item.elem.addEventListener('mousedown', () => {
            if (this.openItem === null) this.previousActive = document.activeElement
        })
        item.elem.addEventListener('click', e => {
            if (e.button === 0) {
                if (this.openItem != null) {
                    this.openItem.hideChildren()
                    this.openItem = null

                    if (this.previousActive instanceof HTMLElement) this.previousActive.focus()
                } else if (item.child) {
                    this.openItem = item

                    const bbox = this.openItem.elem.getBoundingClientRect()
                    this.openItem.showChildren({ x: bbox.left, y: bbox.bottom })

                    document.body.addEventListener('mousedown', this.hideCb)
                    document.body.addEventListener('touchstart', this.hideCb)
                    document.body.addEventListener('click', this.hideCb)
                    document.body.addEventListener('blur', this.hideCb)
                }
            }
        })

        item.elem.addEventListener('mouseenter', () => {
            if (this.openItem != null) {
                this.openItem.hideChildren()
                this.openItem = item
                this.openItem.elem.focus()

                if (item.action == null && item.child) {
                    const bbox = this.openItem.elem.getBoundingClientRect()
                    this.openItem.showChildren({ x: bbox.left, y: bbox.bottom })
                }
            }
        })
    }

    private hideMenu(ev: { target: EventTarget | null, force?: true }) {
        if (isMenuClicked() && !ev.force) return

        if (this.openItem != null) {
            // prevents closing the menu right after opening it
            if (ev.target instanceof HTMLElement && hasAncestor(ev.target, this.openItem.elem)) return

            this.openItem.hideChildren()
            this.openItem = null

            if (this.previousActive instanceof HTMLElement) this.previousActive.focus()
        }

        document.body.removeEventListener('mousedown', this.hideCb)
        document.body.removeEventListener('click', this.hideCb)
        document.body.removeEventListener('touchstart', this.hideCb)
        document.body.removeEventListener('blur', this.hideCb)
    }

    public closeAll() {
        this.hideMenu({ target: null, force: true })
    }
}
