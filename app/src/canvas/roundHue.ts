import { Canvas, RenderFunction } from './canvas'
import { hsToRgb } from '../color/convertColor'

function drawImageLazily(data: Uint8ClampedArray, size: number, padding: number) {
    let radius = size / 2 - padding
    let mid = size / 2
    let y = 0

    for (let row = 0; row < size; row++) setTimeout(() => {
        const rowOffset = y * size

        for (let x = 0; x < size; x++) {
            const offset = (rowOffset + x) << 2
            const rX = mid - x
            const rY = mid - y

            const dx = rX / radius
            const dy = rY / radius
            const fromCenter = Math.sqrt(dx * dx + dy * dy)

            const hue = Math.atan2(rY, rX) / Math.PI * 3 + 3

            const rgb = hsToRgb(hue, fromCenter)

            data[offset    ] = rgb[0]
            data[offset + 1] = rgb[1]
            data[offset + 2] = rgb[2]
            data[offset + 3] = 255
        }
        y++
    })
}

/**
 * Draws a round hue gradient on a canvas.
 */
export function roundHueGradient(padding: number): RenderFunction {
    return (canvas: Canvas) => {
        const w = canvas.elem.width
        const h = canvas.elem.height
        if (w !== h) throw new Error(`Canvas isn't square: ${w}x${h}`)

        let img = canvas.ctx.getImageData(0, 0, w, w)
        drawImageLazily(img.data, w, padding)

        return new Promise(resolve => setTimeout(() => {
            canvas.ctx.putImageData(img, 0, 0)
            resolve()
        }))
    }
}
