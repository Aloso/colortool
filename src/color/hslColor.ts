import { Color } from './color'
import { RgbColor } from './rgbColor'

export class HslColor implements Color {
    constructor(
        public readonly hue: number,
        public readonly sat: number,
        public readonly lum: number,
        public readonly a = 100,
    ) {}

    public setHue(hue: number): HslColor {
        const hueValid = Math.max(0, Math.min(360, hue % 360))
        return new HslColor(hueValid, this.sat, this.lum, this.a)
    }

    public setSat(sat: number): HslColor {
        const satValid = Math.max(0, Math.min(100, sat))
        return new HslColor(this.hue, satValid, this.lum, this.a)
    }

    public setLum(lum: number): HslColor {
        const lumValid = Math.max(0, Math.min(100, lum))
        return new HslColor(this.hue, this.sat, lumValid, this.a)
    }

    public setA(a: number): HslColor {
        const aValid = Math.max(0, Math.min(100, a))
        return new HslColor(this.hue, this.sat, this.lum, aValid)
    }

    public get hsl(): HslColor {
        return this
    }

    public get rgb(): RgbColor {
        const h = this.hue / 60
        const s = this.sat / 100
        const l = this.lum / 100
        const C = (1 - Math.abs(2 * l - 1)) * s
        const X = C * (1 - Math.abs((h % 2) - 1))
        let r = 0
        let g = 0
        let b = 0
        if (h >= 0 && h < 1) {
            r = C
            g = X
        } else if (h >= 1 && h < 2) {
            r = X
            g = C
        } else if (h >= 2 && h < 3) {
            g = C
            b = X
        } else if (h >= 3 && h < 4) {
            g = X
            b = C
        } else if (h >= 4 && h < 5) {
            r = X
            b = C
        } else {
            r = C
            b = X
        }
        const m = l - C / 2
        return new RgbColor(((r + m) * 255) | 0, ((g + m) * 255) | 0, ((b + m) * 255) | 0, this.a)
    }

    public get hslString(): string {
        return `hsl(${this.hue}, ${this.sat}, ${this.lum})`
    }

    public get hslaString(): string {
        return `hsla(${this.hue}, ${this.sat}, ${this.lum}, ${this.a})`
    }

    public toString(): string {
        return this.a === 100 ? this.hslString : this.hslaString
    }

    public get hex(): string {
        return this.rgb.hex
    }

    public get hexWithAlpha(): string {
        return this.rgb.hexWithAlpha
    }
}
