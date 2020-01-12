import { NotNull } from '../util/myTypes'
import { EventEmitter, Input } from '../util/eventRouting'
import { nextUid } from '../util/uid'
import { Background } from '../background/background'

export interface NumericSlider<S extends NotNull> {
    value: number
    elem: HTMLElement
    background: Background<S>
    input: Input<number>
    change: Input<number>
    isVertical: boolean
    min: number
    max: number
}

export class SliderWithInput<S extends NotNull> {
    public readonly elem = document.createElement('div')
    private readonly label = document.createElement('label')
    private readonly number = document.createElement('input')

    public readonly input = new EventEmitter<number>()
    public readonly change = new EventEmitter<number>()

    constructor(public readonly slider: NumericSlider<S>, label: string) {
        this.initLabel(label)
        this.initElement()
        this.initNumber(label)
        this.elem.append(this.label, this.slider.elem, this.number)
    }

    public set value(v: number) {
        this.slider.value = v
    }

    public set bgState(s: S) {
        this.slider.background.state = s
    }

    private initLabel(l: string) {
        this.label.className = 'label'
        this.label.textContent = l
    }

    private initElement() {
        this.slider.input.on(v => {
            this.number.value = '' + (v | 0)
            this.input.emit(v)
        })
        this.slider.change.on(v => {
            this.number.value = '' + (v | 0)
            this.change.emit(v)
        })

        this.elem.className = `slider-outer ${this.slider.isVertical ? 'v' : 'h'}-slider-outer`
        this.elem.append(this.label, this.slider.elem)
    }

    private initNumber(label: string) {
        this.number.setAttribute('type', 'number')
        this.number.className = 'tiny-input'
        this.number.value = '' + (this.slider.value | 0)

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
