import { HslColor } from './hslColor'
import { RgbColor } from './rgbColor'

export interface Color {
    readonly a: number
    setA(a: number): Color

    toRgb(): RgbColor
    toHsl(): HslColor

    toString(): string
}

