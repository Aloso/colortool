import { HslColor } from './hslColor'
import { RgbColor } from './rgbColor'

export interface Color<Self extends Color<Self>> {
    readonly a: number

    rgb: RgbColor
    hsl: HslColor
    hex: string
    hexWithAlpha: string

    setA(a: number): Self
    toString(): string
}
