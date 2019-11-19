import { NotNull } from '../util/myTypes'
import { LinearSlider } from './linearSlider'
import { EventEmitter } from '../util/eventEmitter'
import { nextUid } from '../util/uid'

export class SliderWithInput<S extends NotNull> {
    public readonly elem = document.createElement('div')
    private readonly label = document.createElement('label')
    private readonly number = document.createElement('input')

    public readonly input = new EventEmitter<number>()
    public readonly change = new EventEmitter<number>()

    constructor(public readonly slider: LinearSlider<S>, label: string) {
        this.initLabel(label)
        this.initElement()
        this.initNumber(label)
        this.elem.append(this.label, this.slider.elem, this.number)
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
        this.slider.input.on(v => {
            this.number.value = '' + v
            this.input.emit(v)
        })
        this.slider.change.on(v => {
            this.number.value = '' + v
            this.change.emit(v)
        })

        this.elem.className = `slider-outer ${this.slider.isVertical ? 'v' : 'h'}-slider-outer`
        this.elem.append(this.label, this.slider.elem)
    }

    private initNumber(label: string) {
        this.number.setAttribute('type', 'number')
        this.number.className = 'tiny-input'
        this.number.value = '' + this.slider.value

        const id = `slider-${label}-${nextUid()}`
        this.number.id = id
        this.label.setAttribute('for', id)

        this.number.setAttribute('min', '' + this.slider.min)
        this.number.setAttribute('max', '' + this.slider.max)

        this.number.addEventListener('input', () => {
            const v = this.number.value.trim()
            const num = +v

            if (v !== '' && !isNaN(num)) {
                const before = this.slider.value
                this.slider.value = num
                if (this.slider.value !== before) {
                    this.input.emit(this.slider.value)
                }
            }
        })
    }

}
