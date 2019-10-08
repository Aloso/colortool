import { NotNull } from '../util/myTypes'
import { LinearSlider } from './linearSlider'
import { TinyNumberInput } from './tinyNumberInput'
import { EventEmitter } from '../util/eventEmitter'

export class SliderWithInput<S extends NotNull> {
    private valInput: number | null = null
    private valChange: number | null = null

    private readonly number: TinyNumberInput

    public readonly elem = document.createElement('div')

    private readonly label = document.createElement('div')
    public readonly input = new EventEmitter<number>()
    public readonly change = new EventEmitter<number>()

    constructor(public readonly slider: LinearSlider<S>, label: string) {
        this.number = new TinyNumberInput(slider.value, slider.min, slider.max)

        this.initLabel(label)
        this.initElement()
    }

    public set value(v: number) {
        this.slider.value = v
    }

    public set canvasState(s: S) {
        this.slider.canvas.state = s
    }

    private initLabel(l: string) {
        this.label.className = 'label'
        this.label.textContent = l
    }

    private initElement() {
        const inputListener = (v: number) => {
            if (v !== this.valInput) {
                this.valInput = v
                this.slider.value = v
                this.number.value = v
                this.input.emit(v)
            }
        }

        const changeListener = (v: number) => {
            if (v !== this.valChange) {
                this.valChange = v
                this.slider.value = v
                this.number.value = v
                this.change.emit(v)
            }
        }

        this.slider.input.on(inputListener)
        this.number.input.on(inputListener)
        this.slider.change.on(changeListener)
        this.number.change.on(changeListener)

        this.elem.className = `slider-outer ${this.slider.isVertical ? 'v' : 'h'}-slider-outer`
        this.elem.append(this.label, this.slider.elem, this.number.elem)
    }

}
