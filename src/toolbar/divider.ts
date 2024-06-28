import { ItemContainer } from './types/itemContainer'
import { MenuComponent } from './types/menuComponent'
import { Box } from './types/box'

export class Divider implements MenuComponent {
    public elem = document.createElement('hr')

    constructor(public readonly parent: ItemContainer) {}

    public hide() {}

    public hideAll() {
        this.parent.hideAll()
    }

    public getBox(): Box {
        return Box.fromElem(this.elem)
    }

    public show() {}

    public leaf(): MenuComponent | ItemContainer {
        return this
    }
}
