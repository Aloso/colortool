import { NotNull } from '../util/myTypes'
import { EventEmitter } from '../util/eventRouting'
import { Background } from './background'

export type RenderFunction<S extends NotNull> = (canvas: Canvas<S>, state: S) => Promise<void>

enum CanvasState {
    Idle,
    Rendering,
    // This means that the canvas is rendering, but must be rendered again once finished
    Dirty,
}

export class Canvas<S extends NotNull> implements Background<S> {
    public readonly elem = document.createElement('canvas') as HTMLCanvasElement
    public readonly ctx = this.elem.getContext('2d') as CanvasRenderingContext2D

    private _state: S

    public readonly resize = new EventEmitter<void>()
    public readonly rendered = new EventEmitter<void>()

    private canvasState = CanvasState.Idle

    constructor(private _width: number, private _height: number, public renderer: RenderFunction<S>, state: S) {
        this._state = state

        this.updateSize()
        this.redraw()
    }

    public get width(): number {
        return this._width
    }

    public get height(): number {
        return this._height
    }

    public setSize(w: number, h: number) {
        if (w === this._width && h === this._height) return
        this._width = w
        this._height = h

        this.updateSize()
        this.redraw(true)
    }

    public updateSize() {
        this.resize.emit()

        const dpr = window.devicePixelRatio
        const w = this._width
        const h = this._height

        this.elem.width = Math.round(w / dpr)
        this.elem.height = Math.round(h / dpr)
    }

    public set state(s: S) {
        this._state = s
        this.redraw(true)
    }

    private redraw(force = false) {
        if (this.canvasState === CanvasState.Idle) {
            this.canvasState = CanvasState.Rendering

            this.renderer(this, this.state).then(() => {
                const prev = this.canvasState
                this.canvasState = CanvasState.Idle
                this.rendered.emit()

                if (prev === CanvasState.Dirty) {
                    this.redraw()
                }
            })
        } else if (force) {
            this.canvasState = CanvasState.Dirty
        }
    }
}
