import { HslColor } from './hslColor'
import { RgbColor } from './rgbColor'

export interface Color {
    readonly a: number

    rgb: RgbColor
    hsl: HslColor
    hex: string
    hexWithAlpha: string

    setA(a: number): Color

    toString(): string
}
