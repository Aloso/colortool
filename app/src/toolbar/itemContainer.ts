import { MenuItem } from './menuItem'

export interface ItemContainer {
    readonly elem: HTMLElement
    parent: MenuComponent | null
    selected: MenuItem | null
    canHide: boolean

    show(parent: MenuComponent | null, options?: { x: number, y: number }, element?: HTMLElement): void
    hide(): void

    hideAll(): void

    pressEscape(): void

    enterChild(child: MenuComponent): void
    leaveChild(child: MenuComponent): void

    leaf(): MenuComponent | ItemContainer
    leafMenuItem(): MenuItem | null
}

export interface MenuComponent {
    readonly elem: HTMLElement
    parent: ItemContainer

    show(): void
    hide(): void

    hideAll(): void

    leaf(): MenuComponent | ItemContainer
}
