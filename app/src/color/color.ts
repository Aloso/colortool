import { HslColor } from './hslColor'
import { RgbColor } from './rgbColor'

export interface Color<Self extends Color<Self>> {
    readonly a: number
    setA(a: number): Self

    rgb: RgbColor
    hsl: HslColor
    hex: string
    hexWithAlpha: string
    toString(): string
}
