import { NotNull } from '../util/myTypes'
import { EventEmitter } from '../util/eventRouting'
import { Direction, getSignForSliderKeypress, keyToDirection } from '../util/dimensions'
import { Limit } from '../util/limit'
import { supportsPassiveEvents } from '../util/browserSupport'
import { NumericSlider } from './sliderWithInput'
import { Canvas } from '../background/canvas'

export interface SliderOptions {
    min: number
    max: number
    initial?: number
    smallStep?: number
    step?: number
    direction?: Direction
}

export class LinearSlider<S extends NotNull> implements NumericSlider<S> {
    private readonly val: Limit

    public readonly step: number
    public readonly smallStep: number
    public readonly direction: Direction
    public readonly isVertical: boolean

    public readonly change = new EventEmitter<number>()
    public readonly input = new EventEmitter<number>()

    public readonly elem = document.createElement('div')
    private readonly handle = document.createElement('button')

    constructor(public readonly background: Canvas<S>, options: SliderOptions) {
        if (options.initial == null) options.initial = options.min
        this.val = Limit.fromErr(options.initial, options.min, options.max)

        this.step = options.step || 1
        this.smallStep = options.smallStep || this.step

        this.direction = options.direction || Direction.Right
        this.isVertical = this.direction === Direction.Up || this.direction === Direction.Down

        this.initElement()
        this.makeValueVisible()
    }

    public get value(): number {
        return this.val.get()
    }

    public set value(v: number) {
        if (this.val.set(v)) {
            this.change.emit(this.val.get())
            this.makeValueVisible()
        }
    }

    public get valueRelative(): number {
        return this.val.getRelative()
    }

    public set valueRelative(v: number) {
        if (this.val.setRelative(v)) {
            this.change.emit(this.val.get())
            this.makeValueVisible()
        }
    }

    public get min(): number {
        return this.val.min
    }

    public get max(): number {
        return this.val.max
    }

    private initElement() {
        const dir = this.isVertical ? 'v' : 'h'

        this.elem.className = `slider ${dir}-slider`
        this.elem.appendChild(this.background.elem)

        const inner = document.createElement('div')
        inner.className = `slider-inner ${dir}-slider-inner`
        this.elem.appendChild(inner)

        this.handle.className = `slider-handle ${dir}-slider-handle`
        this.handle.setAttribute('tabindex', '-1')
        inner.appendChild(this.handle)

        let isPressed = false

        this.elem.addEventListener('mousedown', e => {
            if (e.button === 0) {
                this.valueRelative = getRelativeValue(inner, e, this.direction)
                this.input.emit(this.val.get())
                isPressed = true
                setTimeout(() => this.handle.focus())

                // prevent text selection while dragging
                e.preventDefault()
            }
        })

        this.elem.addEventListener(
            'touchstart',
            e => {
                if (e.touches.length === 1) {
                    this.valueRelative = getRelativeValue(inner, e.touches[0], this.direction)
                    this.input.emit(this.val.get())
                    isPressed = true
                    setTimeout(() => this.handle.focus())

                    // prevent scrolling while dragging
                    e.preventDefault()
                }
            },
            supportsPassiveEvents ? { passive: false } : false,
        )

        let isKeydown = false
        this.handle.addEventListener('keydown', e => {
            const pressed = keyToDirection(e.key)
            if (pressed != null) {
                const val = isKeydown ? this.step : this.smallStep
                const sign = getSignForSliderKeypress(pressed, this.direction)

                this.value += sign * val
                this.input.emit(this.val.get())

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
                this.input.emit(this.val.get())
            }
        })
        window.addEventListener(
            'touchmove',
            e => {
                if (isPressed && e.touches.length === 1) {
                    this.valueRelative = getRelativeValue(inner, e.touches[0], this.direction)
                    this.input.emit(this.val.get())

                    // prevent scrolling while dragging
                    e.preventDefault()
                } else {
                    isPressed = false
                }
            },
            supportsPassiveEvents ? { passive: false } : false,
        )
        window.addEventListener('mouseup', () => (isPressed = false))
        window.addEventListener('touchend', () => (isPressed = false))
        window.addEventListener('touchcancel', () => (isPressed = false))
        window.addEventListener('blur', () => (isPressed = false))
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

function getRelativeValue(elem: HTMLElement, e: { clientX: number; clientY: number }, direction: Direction): number {
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
