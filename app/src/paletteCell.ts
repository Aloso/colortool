import { Color } from './color/color'
import { EventEmitter } from './util/eventEmitter'

export class PaletteCell {
    private _color: Color

    public readonly elem = document.createElement('button')
    private readonly inner = document.createElement('div')

    public readonly colorChanged = new EventEmitter<Color>()

    constructor(color: Color) {
        this._color = color

        this.initElement()
    }

    public get color(): Color {
        return this._color
    }

    public set color(c: Color) {
        if (this._color !== c) {
            this._color = c
            this.updateColor()
            this.colorChanged.emit('colorChanged', c)
        }
    }

    private initElement() {
        this.elem.className = 'palette-field'
        this.elem.appendChild(this.inner)
    }

    private updateColor() {
        this.inner.style.backgroundColor = this._color.toString()
    }
}