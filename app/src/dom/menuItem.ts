// TODO include mousetrap

import { EventEmitter } from '../util/eventEmitter'

export interface MenuItemOptions {
    readonly label: string
    readonly children?: (MenuItem | MenuItemOptions)[] | null
    readonly action?: () => void
    readonly shortcut?: string
    readonly disabled?: boolean
}

export function isMenuItem(item: MenuItem | MenuItemOptions): item is MenuItem {
    return 'elem' in item
}

export class MenuItem {
    public readonly elem = document.createElement('button')

    public readonly label: string
    public readonly children: MenuItem[] | null
    public readonly action: (() => void) | null
    public readonly shortcut: string | null
    public readonly disabled: boolean

    public readonly show = new EventEmitter<void>()
    public readonly hide = new EventEmitter<void>()

    private _openOnHover = false

    constructor(options: MenuItemOptions) {
        this.label = options.label
        this.action = options.action || null
        this.shortcut = options.shortcut == null ? null : options.shortcut
        this.disabled = options.disabled === true
        this.children = options.children == null
            ? null
            : options.children.map(c => isMenuItem(c) ? c : new MenuItem(c))

        this.initElement()
    }

    private initElement() {
        this.elem.className = `tb-item tb-${this.children == null ? 'button' : 'list'}`
        this.elem.innerHTML = this.label
        if (this.shortcut != null) this.elem.title = this.shortcut
        if (this.disabled) this.elem.disabled = true

        if (this.action != null) this.elem.addEventListener('click', this.action)

        if (this.children != null) {
            this.initChildren(this.children)
        }
    }

    private initChildren(children: MenuItem[]) {
        for (const child of children) {
            child.elem.addEventListener('click', e => {
                if (e.button === 0) {
                    if (this.action != null) this.action()
                    this.showChild(child)
                }
            })

            child.elem.addEventListener('mouseenter', e => {
                if (e.button === 0) {
                    this.showChild(child)
                }
            })

            child.elem.addEventListener('mouseleave', e => {
                if (e.button === 0) {
                    if (this.action != null) this.action()
                    if (this.children != null) this.showChild(child)
                }
            })
        }
    }

    private showChild(child: MenuItem) {

    }

    public get openOnHover(): boolean {
        return this._openOnHover
    }

    public set openOnHover(openOnHover: boolean) {
        this._openOnHover = openOnHover
    }
}
