import { PaletteCell } from './paletteCell'
import { EventEmitter } from '../util/eventEmitter'

/**
 * A rectangular palette that fills in rows from top left to bottom right, e.g.
 *
 *            # # # # # # # # # #
 *            # # # # # # # # # #
 *            # # # # # # # # # #
 *            # # # # # #
 *
 * This means that the last row might not be full.
 */
export class Palette {
    public readonly elem = document.createElement('div')

    private _x = 0
    private _y = 0

    public readonly moveFocus = new EventEmitter<PaletteCell>()
    public readonly select = new EventEmitter<PaletteCell>()

    constructor(public readonly rows: PaletteCell[][]) {
        this.initElement()
        this.setFocus(this._x, this._y)
    }

    public get x(): number {
        return this._x
    }

    public set x(x: number) {
        const oldX = this._x
        const oldY = this._y
        if (this.setX(x)) {
            this.removeFocus(oldX, oldY)
            this.setFocus(this._x, this._y)
            this.moveFocus.emit(this.focusedCell as PaletteCell)
        }
    }

    private setX(x: number): boolean {
        const max = this.rows[this._y].length - 1
        x = Math.max(0, Math.min(x, max))
        if (x !== this._x) {
            this._x = x
            return true
        }
        return false
    }

    public get y(): number {
        return this._y
    }

    public set y(y: number) {
        const oldX = this._x
        const oldY = this._y
        if (this.setY(y)) {
            this.removeFocus(oldX, oldY)
            this.setFocus(this._x, this._y)
            this.moveFocus.emit(this.focusedCell as PaletteCell)
        }
    }

    private setY(y: number): boolean {
        const max = this.rows.length - 1
        y = Math.max(0, Math.min(y, max))
        if (y !== this._y) {
            this._y = y
            this.setX(this._x) // x might need to be updated
            return true
        }
        return false
    }

    public get focusedCell(): PaletteCell | null {
        return this.rows[this._y][this._x]
    }

    public initElement() {
        this.elem.className = 'palette'
        this.elem.setAttribute('tabindex', '0')

        const elements: HTMLElement[] = []
        this.rows.forEach((row: PaletteCell[]) => {
            row.forEach(cell => elements.push(cell.elem))
            elements.push(flexLineBreak())
        })
        this.elem.append.apply(this.elem, elements)

        this.elem.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.x--
                    e.preventDefault()
                    break
                case 'ArrowRight':
                    this.x++
                    e.preventDefault()
                    break
                case 'ArrowUp':
                    this.y--
                    e.preventDefault()
                    break
                case 'ArrowDown':
                    this.y++
                    e.preventDefault()
                    break
                case 'Space':
                case 'Enter':
                    const cell = this.focusedCell
                    if (cell != null) cell.elem.click()
                    break
            }
        })

        for (let y = 0; y < this.rows.length; y++) {
            const row = this.rows[y]
            for (let x = 0; x < row.length; x++) {
                const cell = row[x]
                cell.elem.addEventListener('click', () => {
                    if (x !== this._x || y !== this._y) {
                        this.removeFocus(this._x, this._y)
                        this._x = x
                        this._y = y
                        this.setFocus(x, y)

                        const focused = this.focusedCell as PaletteCell
                        this.moveFocus.emit(focused)
                        this.select.emit(focused)
                    } else {
                        const focused = this.focusedCell as PaletteCell
                        this.select.emit(focused)
                    }
                })
            }
        }
    }

    private removeFocus(x: number, y: number) {
        this.rows[y][x].elem.classList.remove('focused')
    }

    private setFocus(x: number, y: number) {
        this.rows[y][x].elem.classList.add('focused')
    }
}

function flexLineBreak() {
    const elem = document.createElement('div')
    elem.style.width = '100%'
    elem.style.height = '0'
    return elem
}
