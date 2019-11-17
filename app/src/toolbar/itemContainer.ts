export interface ItemContainer {
    readonly elem: HTMLElement
    parent: MenuComponent | null
    hoveredChild: MenuComponent | null

    show(parent: MenuComponent | null, options?: { x: number, y: number }, element?: HTMLElement): void
    hide(): void

    hideAll(): void

    pressEscape(): void

    enterChild(child: MenuComponent): void
    leaveChild(child: MenuComponent): void
}

export interface MenuComponent {
    readonly elem: HTMLElement
    parent: ItemContainer

    show(): void
    hide(): void

    hideAll(): void
}
