import { MenuItem } from '../menuItem'
import { MenuComponent } from './menuComponent'
import { Direction } from './direction'
import { Box } from './box'

export interface ItemContainer {
    readonly elem: HTMLElement
    parent: MenuComponent | null
    selected: MenuItem | null
    canHide: boolean

    show(parent: MenuComponent | null, element?: HTMLElement): void
    hide(): void

    hideAll(): void

    getBox(): Box
    getPreferredDirection(): Direction

    pressEscape(): void

    mouseEnterChild(child: MenuComponent): void
    mouseLeaveChild(child: MenuComponent): void

    leaf(): MenuComponent | ItemContainer
    leafMenuItem(): MenuItem | null

    pressArrow(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'): void
}
