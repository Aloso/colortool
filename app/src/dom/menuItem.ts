import { bind, unbind } from 'mousetrap'

import { Menu } from './menu'
import { byId } from './helper'
import { ItemContainer, MenuComponent } from './itemContainer'

export interface MenuItemOptions {
    readonly label: string
    readonly children?: (MenuComponent | MenuItemOptions | 'divider')[] | null
    readonly action?: () => void
    readonly shortcut?: string
    readonly displayShortcut?: string
    readonly disabled?: boolean
}

export class MenuItem implements MenuComponent {
    public readonly elem = document.createElement('button')

    public readonly label: string
    public readonly action: (() => void) | null
    public readonly shortcut: string | null
    public readonly displayShortcut: string | null
    public readonly disabled: boolean

    public readonly child: Menu | null = null

    private isInitialized = false

    constructor(public parent: ItemContainer, options: MenuItemOptions) {
        this.label = options.label
        this.action = options.action ?? null
        this.shortcut = options.shortcut ?? null
        this.displayShortcut = options.displayShortcut ?? null
        this.disabled = options.disabled === true

        if (options.children != null && options.children.length) {
            this.child = new Menu(options.children ?? [])
        }
    }

    private initElement() {
        if (!this.isInitialized) {
            this.isInitialized = true

            this.elem.className = `tb-item tb-${this.child ? 'button' : 'list'}`
            if (this.disabled) this.elem.disabled = true

            const elem = document.createElement('span')
            elem.className = 'tb-item-text'
            elem.innerHTML = this.label
            this.elem.append(elem)

            if (this.displayShortcut != null) {
                const shortcutElem = document.createElement('span')
                shortcutElem.className = 'tb-short'
                shortcutElem.innerHTML = this.displayShortcut
                this.elem.append(shortcutElem)
            }

            if (this.child) {
                const arrowElem = document.createElement('span')
                arrowElem.className = 'tb-arrow-right'
                arrowElem.innerHTML = '⯈'
                this.elem.append(arrowElem)
            }

            this.elem.addEventListener('click', e => {
                if (this.action != null) {
                    if (e.button === 0) this.action()
                    this.hideAll()
                }
            })

            this.elem.addEventListener('keydown', e => {
                if (e.key === 'Escape') this.parent?.pressEscape()
            })
        }
    }

    public show() {
        this.initElement()

        if (this.shortcut != null) {
            bind(this.shortcut, e => {
                if (this.action != null) {
                    this.action()
                    e.preventDefault()
                } else if (this.child) {
                    this.mouseenter()
                    e.preventDefault()
                }
            })
        }
    }

    public hide() {
        if (this.shortcut != null) unbind(this.shortcut)
    }

    public mouseenter() {
        if (this.child) {
            const bbox = this.elem.getBoundingClientRect()
            this.showChildren({ x: bbox.right, y: bbox.top })
        }
    }

    public mouseleave() {
        this.hideChildren()
    }

    public showChildren(options: { x: number, y: number }) {
        this.elem.classList.add('hovered')

        if (this.child) {
            this.child.show(this, options, byId('menus', HTMLElement))
        }
    }

    public hideChildren() {
        this.elem.classList.remove('hovered')
        if (this.child != null) this.child.hide()
    }

    public hideAll() {
        if (this.parent) this.parent.hideAll()
    }
}
