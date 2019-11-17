import { MenuItem, MenuItemOptions } from './menuItem'
import { ItemClickExpander } from './itemClickExpander'
import { ItemContainer, MenuComponent } from './itemContainer'
import { Divider } from './divider'

export class Toolbar implements ItemContainer {
    public readonly elem = document.createElement('div')
    private readonly items: MenuComponent[]
    public parent: MenuComponent | null = null

    private isInitialized = false

    private readonly expander: ItemClickExpander

    constructor(items: (MenuItemOptions | 'divider')[]) {
        this.items = items.map(it => it === 'divider' ? new Divider(this) : new MenuItem(this, it))
        this.expander = new ItemClickExpander(this.items)
    }

    private initElement() {
        if (!this.isInitialized) {
            this.isInitialized = true

            this.elem.classList.add('toolbar')
            this.elem.append.apply(this.elem, this.items.map(it => it.elem))
        }
    }

    public show(parent: MenuComponent | null, options: undefined, element?: HTMLElement) {
        this.parent = parent
        this.initElement()

        this.items.forEach(item => item.show())
        element?.append(this.elem)
    }

    public hide() {
        this.elem.remove()
        this.items.forEach(item => item.hide())
    }

    public hideAll() {
        this.expander.closeAll()
    }

    pressEscape() {
        this.hideAll()
    }
}
