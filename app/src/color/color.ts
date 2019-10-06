import { HslColor } from './hslColor'
import { RgbColor } from './rgbColor'

export interface Color<T extends Color<T>> {
    readonly a: number
    setA(a: number): T

    rgb: RgbColor
    hsl: HslColor
    hex: string
    hexWithAlpha: string
}

