import { EventEmitter } from './eventEmitter'

export type RenderFunction = (canvas: Canvas) => Promise<void>

export class Canvas {
    public readonly elem = document.createElement('canvas') as HTMLCanvasElement
    public readonly ctx = this.elem.getContext('2d') as CanvasRenderingContext2D

    /**
     * Events:
     * - `resize`: Emitted when the canvas' physical size changes
     * - `rendered`: Emitted after the canvas was rendered completely
     */
    public readonly events = new EventEmitter<void>()

    constructor(private _width: number, private _height: number, public renderer: RenderFunction) {
        this.updateSize()
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
    }

    public updateSize() {
        this.events.emit('resize')

        const dpr = window.devicePixelRatio
        this.elem.width = Math.round(this._width / dpr)
        this.elem.height = Math.round(this._height / dpr)
        this.elem.style.width = `${this._width}px`
        this.elem.style.height = `${this._height}px`

        this.redraw()
    }

    redraw() {
        this.renderer(this).then(() => this.events.emit('rendered'))
    }
}
