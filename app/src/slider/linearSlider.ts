import { EventEmitter } from '../util/eventEmitter'
import { Canvas } from '../canvas/canvas'
import { Direction, getSignForSliderKeypress, keyToDirection } from '../util/direction'

export interface SliderOptions {
    min: number,
    max: number,
    initial?: number,
    rounding?: (n: number) => number,
    smallStep?: number,
    step?: number,
    direction?: Direction,
}

export class LinearSlider<S extends {} | void> {
    private _min: number
    private _max: number
    private _value: number

    private readonly rounding: (n: number) => number
    private readonly step: number
    private readonly smallStep: number
    private readonly direction: Direction
    private readonly isVertical: boolean

    public readonly events = new EventEmitter<number>()

    public readonly elem = document.createElement('div')
    private readonly handle = document.createElement('button')

    constructor(public readonly canvas: Canvas<S>, options: SliderOptions) {
        if (options.min > options.max) {
            throw new Error(`min (${options.min}) is bigger than max (${options.max})`)
        }

        this._min = options.min
        this._max = options.max
        if (options.initial == null) options.initial = options.min

        if (options.initial < options.min || options.initial > options.max) {
            throw new Error(`Initial value (${options.initial}) out of bounds (${options.min}, ${options.max})`)
        }

        this.rounding = options.rounding || ((n: number) => n)
        this.step = options.step || 1
        this.smallStep = options.smallStep || this.step

        this.direction = options.direction || Direction.Right
        this.isVertical = this.direction === Direction.Up || this.direction === Direction.Down

        this._value = options.initial

        this.initElement()
        this.makeValueVisible()
    }

    public get min(): number {
        return this._min
    }

    public get max(): number {
        return this._max
    }

    public set min(min: number) {
        if (min > this._max) min = this._max
        if (this._value < min) this.value = min
        this._min = min
    }

    public set max(max: number) {
        if (max < this._min) max = this._min
        if (this._value > max) this.value = max
        this._max = max
    }

    public get value(): number {
        return this._value
    }

    public set value(v: number) {
        v = Math.max(this._min, Math.min(this._max, v))
        v = this.rounding(v)
        if (v !== this._value) {
            this._value = v
            this.events.emit('change', v)
            this.makeValueVisible()
        }
    }

    public get valueRelative(): number {
        return (this._value - this._min) / (this._max - this._min)
    }

    public set valueRelative(v: number) {
        v = Math.max(0, Math.min(1, v))
        this.value = this._min + v * (this._max - this._min)
    }

    private initElement() {
        const dir = this.isVertical ? 'v' : 'h'

        this.elem.className = `slider ${dir}-slider`
        this.elem.appendChild(this.canvas.elem)

        const inner = document.createElement('div')
        inner.className = `slider-inner ${dir}-slider-inner`
        this.elem.appendChild(inner)

        this.handle.className = `slider-handle ${dir}-slider-handle`
        inner.appendChild(this.handle)

        let isPressed = false

        this.elem.addEventListener('mousedown', e => {
            if (e.button === 0) {
                this.valueRelative = getRelativeValue(inner, e, this.direction)
                isPressed = true
                setTimeout(() => this.handle.focus())
            }
        })

        let isKeydown = false
        this.handle.addEventListener('keydown', e => {
            const pressed = keyToDirection(e.key)
            if (pressed != null) {
                const val = isKeydown ? this.step : this.smallStep
                const sign = getSignForSliderKeypress(pressed, this.direction)
                this.value += sign * val

                e.preventDefault()
            }
            isKeydown = true
        })
        this.handle.addEventListener('keyup', () => {
            isKeydown = false
        })

        window.addEventListener('mousemove', e => {
            if (isPressed) {
                this.valueRelative = getRelativeValue(inner, e, this.direction)
            }
        })
        window.addEventListener('mouseup', () => isPressed = false)
        window.addEventListener('blur', () => isPressed = false)
    }

    private makeValueVisible() {
        switch (this.direction) {
            case Direction.Right:
                this.handle.style.left = `${this.valueRelative * 100}%`
                break
            case Direction.Left:
                this.handle.style.left = `${100 - this.valueRelative * 100}%`
                break
            case Direction.Up:
                this.handle.style.top = `${100 - this.valueRelative * 100}%`
                break
            default: // Down
                this.handle.style.top = `${this.valueRelative * 100}%`

        }
    }
}

function getRelativeValue(elem: HTMLElement, e: MouseEvent, direction: Direction): number {
    const box = elem.getBoundingClientRect()
    switch (direction) {
        case Direction.Right:
            return (e.clientX - box.left) / box.width
        case Direction.Left:
            return 1 - (e.clientX - box.left) / box.width
        case Direction.Up:
            return 1 - (e.clientY - box.top) / box.height
        default: // Down
            return (e.clientY - box.top) / box.height
    }
}
