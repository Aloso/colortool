import { NotNull } from '../util/myTypes'
import { Canvas } from '../canvas/canvas'
import { CircleInnerDir, CircleOuterDir } from '../util/direction'
import { EventEmitter } from '../util/eventEmitter'
import { Limit } from '../util/limit'

export interface CircularInnerOptions {
    min: number
    max: number
    initial?: number
    rounding?: (n: number) => number
    direction?: CircleInnerDir
}

export interface CircularOuterOptions {
    min: number
    max: number
    initial?: number
    rounding?: (n: number) => number
    startAngle?: number
    direction?: CircleOuterDir
}

export interface CircularValues {
    outer: number
    inner: number
}

const identity = (n: number) => n

export class CircularSlider<S extends NotNull> {
    private readonly oVal: Limit
    private readonly iVal: Limit

    private readonly oRounding: (n: number) => number
    private readonly iRounding: (n: number) => number

    private readonly oDirection: CircleOuterDir
    private readonly iDirection: CircleInnerDir

    private readonly startAngle: number

    public readonly change = new EventEmitter<CircularValues>()
    public readonly input = new EventEmitter<CircularValues>()

    public readonly elem = document.createElement('div')
    private readonly handle = document.createElement('button')

    constructor(private canvas: Canvas<S>, inner: CircularInnerOptions, outer: CircularOuterOptions) {
        if (inner.initial == null) inner.initial = inner.min
        if (outer.initial == null) outer.initial = outer.min

        this.iRounding = inner.rounding || identity
        this.oRounding = outer.rounding || identity

        this.iVal = Limit.fromErr(inner.initial, inner.min, inner.max)
        this.oVal = Limit.fromErr(outer.initial, outer.min, outer.max)

        this.iDirection = inner.direction || CircleInnerDir.Outwards
        this.oDirection = outer.direction || CircleOuterDir.Clockwise

        this.startAngle = outer.startAngle == null ? 0 : outer.startAngle

        this.initElement()
        this.makeValueVisible()
    }

    public get value(): CircularValues {
        return {
            outer: this.oVal.get(),
            inner: this.iVal.get(),
        }
    }

    public set value(v: CircularValues) {
        const iChanged = this.iVal.set(this.iRounding(v.inner))
        const oChanged = this.oVal.set(this.oRounding(v.outer))
        if (iChanged || oChanged) {
            this.change.emit(v)
            this.makeValueVisible()
        }
    }

    public set valueRelative(v: CircularValues) {
        const iChanged = this.iVal.setRelative(v.inner, this.iRounding)
        const oChanged = this.oVal.setRelative(v.outer, this.oRounding)

        if (iChanged || oChanged) {
            this.makeValueVisible()
        }
    }

    private initElement() {
        this.elem.className = 'slider c-slider'
        this.elem.appendChild(this.canvas.elem)

        const inner = document.createElement('div')
        inner.className = 'slider-inner c-slider-inner'
        this.elem.appendChild(inner)

        this.handle.className = 'slider-handle c-slider-handle'
        this.handle.setAttribute('tabindex', '-1')
        inner.appendChild(this.handle)

        let isPressed = false

        this.elem.addEventListener('mousedown', e => {
            if (e.button === 0) {
                this.valueRelative = getRelativeValues(inner, e, this.startAngle, this.iDirection, this.oDirection)
                this.input.emit({
                    inner: this.iVal.get(),
                    outer: this.oVal.get(),
                })

                isPressed = true
                setTimeout(() => this.handle.focus())

                // prevent text selection while dragging
                e.preventDefault()
            }
        })

        this.elem.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                this.valueRelative = getRelativeValues(inner, e.touches[0], this.startAngle, this.iDirection, this.oDirection)
                this.input.emit({
                    inner: this.iVal.get(),
                    outer: this.oVal.get(),
                })

                isPressed = true
                setTimeout(() => this.handle.focus())

                // prevent scrolling while dragging
                e.preventDefault()
            }
        })

        window.addEventListener('mousemove', e => {
            if (isPressed) {
                this.valueRelative = getRelativeValues(inner, e, this.startAngle, this.iDirection, this.oDirection)
                this.input.emit({
                    inner: this.iVal.get(),
                    outer: this.oVal.get(),
                })
            }
        })
        window.addEventListener('touchmove', e => {
            if (isPressed && e.touches.length === 1) {
                this.valueRelative = getRelativeValues(inner, e.touches[0], this.startAngle, this.iDirection, this.oDirection)
                this.input.emit({
                    inner: this.iVal.get(),
                    outer: this.oVal.get(),
                })

                // prevent scrolling while dragging
                e.preventDefault()
            } else {
                isPressed = false
            }
        })
        window.addEventListener('mouseup', () => isPressed = false)
        window.addEventListener('blur', () => isPressed = false)
    }

    private makeValueVisible() {
        const r = this.iVal.getRelative() / 2
        const angle = this.oVal.getRelative() * Math.PI * 2

        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r

        this.handle.style.left = `${50 + x * 100}%`
        this.handle.style.top = `${50 + y * 100}%`
    }
}

function getRelativeValues(
    elem: HTMLElement,
    e: { clientX: number, clientY: number },
    startAngle: number,
    id: CircleInnerDir,
    od: CircleOuterDir,
): CircularValues {
    const box = elem.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    const r = box.width / 2
    const dx = box.left + r - x
    const dy = box.top + r - y
    const distCenter = Math.sqrt(dx * dx + dy * dy) / r

    const theta = (Math.atan2(dy, dx) / Math.PI + 1) / 2
    const angle = od === CircleOuterDir.Anticlockwise ? 1 - theta : theta

    const inner = id === CircleInnerDir.Inwards ? 1 - distCenter : distCenter
    const outer = (angle + startAngle) % 1

    return { inner, outer }
}
