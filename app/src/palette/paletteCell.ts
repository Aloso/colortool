import { Color } from '../color/color'
import { EventEmitter } from '../util/eventEmitter'
import { RgbColor } from '../color/rgbColor'

export class PaletteCell {
    private _color: RgbColor

    public readonly elem = document.createElement('button')
    private readonly inner = document.createElement('div')

    public readonly colorChanged = new EventEmitter<RgbColor>()

    constructor(color: Color<any>) {
        this._color = color.rgb

        this.initElement()
        this.updateColor()
    }

    public get color(): Color<any> {
        return this._color
    }

    public set color(c: Color<any>) {
        if (this._color !== c) {
            this._color = c.rgb
            this.updateColor()
            this.colorChanged.emit(this._color)
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
