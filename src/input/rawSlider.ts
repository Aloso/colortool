import { error, NotNull } from '../util/myTypes'
import { Limit } from '../util/limit'
import { Direction } from '../util/dimensions'
import { EventEmitter } from '../util/eventRouting'
import { SliderOptions } from './linearSlider'
import { NumericSlider } from './sliderWithInput'
import { Background } from '../background/background'

export class RawSlider<S extends NotNull> implements NumericSlider<S> {
    private readonly val: Limit

    public readonly step: number
    public readonly smallStep: number
    public readonly direction: Direction
    public readonly isVertical: boolean

    public readonly change = new EventEmitter<number>()
    public readonly input = new EventEmitter<number>()

    public readonly elem = document.createElement('div')

    public constructor(public readonly background: Background<S>, options: SliderOptions) {
        if (options.initial == null) options.initial = options.min
        this.val = Limit.fromErr(options.initial, options.min, options.max)

        this.step = options.step || 1
        this.smallStep = options.smallStep || this.step

        this.direction = options.direction || Direction.Right
        this.isVertical = this.direction === Direction.Up || this.direction === Direction.Down

        this.initElement()
    }

    public initElement() {
        const el = document.createElement('input')
        el.setAttribute('type', 'range')
        el.setAttribute('min', '' + this.val.min)
        el.setAttribute('max', '' + this.val.max)
        el.setAttribute('tabindex', '-1')
        el.classList.add('fancy-range')
        el.value = String(this.val.get())

        this.elem.style.flexGrow = '1'
        this.elem.append(el)
        this.background.node = el

        el.addEventListener('input', () => {
            this.val.set(el.valueAsNumber)
            this.input.emit(this.val.get())
        })

        el.addEventListener('change', () => {
            this.val.set(el.valueAsNumber)
            this.change.emit(this.val.get())
        })

        // TODO support other directions as well
        // TODO don't hard-code width
        this.elem.style.width = '30px'
        setTimeout(() => {
            el.style.width = this.elem.clientHeight + 'px'
        })

        window.addEventListener('resize', () => {
            el.style.width = this.elem.clientHeight + 'px'
        })
    }

    public get value(): number {
        return this.val.get()
    }

    public set value(v: number) {
        if (this.val.set(v)) {
            const val = this.val.get()
            const el = this.elem.firstElementChild ?? error(`Element doesn't have element child`)
            ;(el as HTMLInputElement).value = '' + val
            this.change.emit(val)
        }
    }

    public get valueRelative(): number {
        return this.val.getRelative()
    }

    public set valueRelative(v: number) {
        if (this.val.setRelative(v)) {
            const val = this.val.get()
            const el = this.elem.firstElementChild ?? error(`Element doesn't have element child`)
            ;(el as HTMLInputElement).value = '' + val
            this.change.emit(val)
        }
    }

    public get min(): number {
        return this.val.min
    }

    public get max(): number {
        return this.val.max
    }
}
