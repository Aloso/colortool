import { MenuItem } from '../menuItem'
import { MenuComponent } from './menuComponent'

export interface ItemContainer {
    readonly elem: HTMLElement
    parent: MenuComponent | null
    selected: MenuItem | null
    canHide: boolean

    show(parent: MenuComponent | null, options?: { x: number, y: number }, element?: HTMLElement): void
    hide(): void

    hideAll(): void

    pressEscape(): void

    mouseEnterChild(child: MenuComponent): void
    mouseLeaveChild(child: MenuComponent): void

    leaf(): MenuComponent | ItemContainer
    leafMenuItem(): MenuItem | null

    pressArrow(key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'): void
}

