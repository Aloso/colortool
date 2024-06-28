import { ItemContainer } from './itemContainer'
import { Box } from './box'

export interface MenuComponent {
    readonly elem: HTMLElement
    parent: ItemContainer

    show(): void

    hide(): void

    hideAll(): void

    getBox(): Box

    leaf(): MenuComponent | ItemContainer
}
