import { NotNull } from '../util/myTypes'
import { Canvas } from '../canvas/canvas'

export interface Slider2dOptions {
}

export class CircularSlider<S extends NotNull> {
    public readonly elem = document.createElement('div')
    private readonly handle = document.createElement('button')

    constructor(private canvas: Canvas<S>, options: Slider2dOptions) {
        this.initElement()
        this.makeValueVisible()
    }

    private initElement() {
        this.elem.className = 'slider c-slider'
        this.elem.appendChild(this.canvas.elem)

        const inner = document.createElement('div')
        inner.className = 'slider-inner c-slider-inner'
        this.elem.appendChild(inner)

        this.handle.className = 'slider-handle c-slider-handle'
        inner.appendChild(this.handle)
    }

    private makeValueVisible() {
        //TODO
        this.handle.style.left = `100%`
        this.handle.style.top = `50%`
    }
}
