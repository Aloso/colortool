import { Direction } from './direction'

export class Box {
    constructor(
        public readonly left: number,
        public readonly top: number,
        public readonly right: number,
        public readonly bottom: number,
    ) {}

    static fromElem(elem: Element): Box {
        const clientRect = elem.getBoundingClientRect()
        return new Box(clientRect.left, clientRect.top, clientRect.right, clientRect.bottom)
    }

    static fromDocument(): Box {
        return new Box(0, 0, window.innerWidth, window.innerHeight)
    }

    public addPadding(x: number, y: number): Box {
        return new Box(this.left - x, this.top - y, this.right + x, this.bottom + y)
    }


    public get [Direction.Down](): number {
        return this.bottom
    }
    public get [Direction.Up](): number {
        return this.top
    }
    public get [Direction.Left](): number {
        return this.left
    }
    public get [Direction.Right](): number {
        return this.right
    }
}
