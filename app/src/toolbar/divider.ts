import { ItemContainer} from './types/itemContainer'
import { MenuComponent } from './types/menuComponent'

export class Divider implements MenuComponent {
    public elem = document.createElement('hr')

    constructor(public readonly parent: ItemContainer) {}

    hide() {}

    hideAll() {
        this.parent.hideAll()
    }

    show() {}

    leaf(): MenuComponent | ItemContainer {
        return this
    }
}
