import { Background } from './background'
import { EventEmitter } from '../util/eventRouting'
import { Direction } from '../util/dimensions'
import { transparencyBgDataUrl } from './transparency'

export class LinearGradientBackground implements Background<string[]> {

    private _width: number
    private _height: number

    private _state: string[]
    private _node: HTMLElement | null = null
    private _dir = Direction.Right

    public readonly resize = new EventEmitter<void>()

    constructor(width: number, height: number, dir: Direction, state: string[]) {
        this._width = width
        this._height = height

        this._state = state
        this._dir = dir
    }

    public get width(): number {
        return this._width
    }

    public get height(): number {
        return this._height
    }

    public setSize(width: number, height: number) {
        if (width !== this._width || height !== this._height) {
            this._width = width
            this._height = height
            this.redraw()
            this.resize.emit()
        }
    }

    public get state(): string[] {
        return this._state
    }

    public set state(state: string[]) {
        this._state = state
        this.redraw()
    }

    public get node(): HTMLElement | null {
        return this._node
    }

    public set node(node: HTMLElement | null) {
        this._node = node
        if (node != null) {
            this.setRotation(node)
            this.redraw()
        }
    }

    public get dir(): Direction {
        return this._dir
    }

    public set dir(dir: Direction) {
        this._dir = dir
        if (this.node != null) this.setRotation(this.node)
    }

    private setRotation(node: HTMLElement) {
        switch (this._dir) {
            case Direction.Right:
                node.style.transform = ''
                node.style.transformOrigin = ''
                break
            case Direction.Left:
                node.style.transform = 'rotate(180deg)'
                node.style.transformOrigin = 'center'
                break
            case Direction.Down:
                node.style.transform = 'rotate(90deg) translate(0, -100%)'
                node.style.transformOrigin = 'left top'
                break
            case Direction.Up:
                node.style.transform = 'rotate(-90deg) translate(-100%, 0)'
                node.style.transformOrigin = 'left top'
                break
        }
    }

    private redraw() {
        if (this.node != null) {
            const radius = Math.min(this.width, this.height) / 2

            const first = this._state[0]
            const cols = this._state.slice(1)

            const colors = cols.length > 0
                ? `${first} ${radius}px, ${cols.join(',')} calc(100% - ${radius}px)`
                : first

            this.node.style.background = `linear-gradient(90deg, ${colors}), url(${transparencyBgDataUrl})`
        }
    }
}


