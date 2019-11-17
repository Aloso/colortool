import { MenuItemOptions } from './menuItem'

export interface ItemContainer {
    readonly elem: HTMLElement
    parent: MenuComponent | null

    show(parent: MenuComponent | null, options?: { x: number, y: number }, element?: HTMLElement): void
    hide(): void

    hideAll(): void

    pressEscape(): void
}

export interface MenuComponent {
    readonly elem: HTMLElement
    parent: ItemContainer

    show(): void
    hide(): void

    hideAll(): void
}

export function isMenuComponent(c: MenuComponent | MenuItemOptions): c is MenuComponent {
    return 'elem' in c
}
