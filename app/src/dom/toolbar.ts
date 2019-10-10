import { isMenuItem, MenuItem, MenuItemOptions } from './menuItem'

export class Toolbar {
    private _items: MenuItem[]

    constructor(
        items: (MenuItem | MenuItemOptions)[],
        public readonly elem = document.createElement('div'),
    ) {
        this._items = items.map(it => {
            if (isMenuItem(it)) return it
            else return new MenuItem(it)
        })
        this.initElement(items)
    }

    private initElement(items: (MenuItem | MenuItemOptions)[]) {
        this.elem.classList.add('toolbar')

        const children = this._items.map(it => it.elem)
        this.elem.append.apply(this.elem, children)
    }
}
