import { ItemContainer } from './itemContainer'

export interface MenuComponent {
    readonly elem: HTMLElement
    parent: ItemContainer

    show(): void

    hide(): void

    hideAll(): void

    leaf(): MenuComponent | ItemContainer
}
