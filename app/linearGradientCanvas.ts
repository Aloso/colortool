import { RenderFunction } from './canvas'
import { Direction } from './direction'

export function linearGradient(colorStops: string[], direction: Direction = Direction.Right): RenderFunction {
    return canvas => new Promise<void>(resolve => {
        const w = canvas.elem.width
        const h = canvas.elem.height

        canvas.ctx.rect(0, 0, w, h)

        let grad: CanvasGradient

        switch (direction) {
            case Direction.Right:
                grad = canvas.ctx.createLinearGradient(h / 2, 0, w - h / 2, 0)
                break
            case Direction.Left:
                grad = canvas.ctx.createLinearGradient(w - h / 2, 0, h / 2, 0)
                break
            case Direction.Up:
                grad = canvas.ctx.createLinearGradient(0, h - w / 2, 0, w / 2)
                break
            default: // Down
                grad = canvas.ctx.createLinearGradient(0, w / 2, 0, h - w / 2)
                break
        }

        const len = colorStops.length - 1
        for (let i = 0; i < colorStops.length; ++i) {
            grad.addColorStop(i / len, colorStops[i])
        }
        canvas.ctx.fillStyle = grad

        canvas.ctx.fill()
        resolve()
    })
}
