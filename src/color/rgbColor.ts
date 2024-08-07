import { HslColor } from './hslColor'
import { Color } from './color'

export class RgbColor implements Color {
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
        public readonly a = 100,
    ) {}

    public static fromHex(s: string): RgbColor | null {
        s = s.trim()
        if (s.length >= 4 && s[0] === '#') {
            if (/^#[0-9a-fA-F]*$/.test(s)) {
                const hex = s.substr(1)
                if (hex.length === 6) {
                    const r = Number.parseInt(hex.substr(0, 2), 16)
                    const g = Number.parseInt(hex.substr(2, 2), 16)
                    const b = Number.parseInt(hex.substr(4, 2), 16)
                    return new RgbColor(r, g, b)
                } else if (hex.length === 8) {
                    const r = Number.parseInt(hex.substr(0, 2), 16)
                    const g = Number.parseInt(hex.substr(2, 2), 16)
                    const b = Number.parseInt(hex.substr(4, 2), 16)
                    const a = Number.parseInt(hex.substr(6, 2), 16)
                    return new RgbColor(r, g, b, a / 2.55)
                }
            }
        }
        return null
    }

    public setR(r: number): RgbColor {
        const rValid = Math.max(0, Math.min(255, r)) | 0
        return new RgbColor(rValid, this.g, this.b, this.a)
    }

    public setG(g: number): RgbColor {
        const gValid = Math.max(0, Math.min(255, g)) | 0
        return new RgbColor(this.r, gValid, this.b, this.a)
    }

    public setB(b: number): RgbColor {
        const bValid = Math.max(0, Math.min(255, b)) | 0
        return new RgbColor(this.r, this.g, bValid, this.a)
    }

    public setA(a: number): RgbColor {
        const aValid = Math.max(0, Math.min(100, a)) | 0
        return new RgbColor(this.r, this.g, this.b, aValid)
    }

    public get rgb(): RgbColor {
        return this
    }

    public get hsl(): HslColor {
        const r = this.r / 255
        const g = this.g / 255
        const b = this.b / 255
        const M = Math.max(r, g, b)
        const m = Math.min(r, g, b)
        const d = M - m

        let h: number
        if (d === 0) {
            h = 0
        } else if (M === r) {
            h = ((g - b) / d) % 6
            if (h < 0) h += 6
        } else if (M === g) {
            h = (b - r) / d + 2
            if (h < 0) h += 6
        } else {
            h = (r - g) / d + 4
            if (h < 0) h += 6
        }

        const l = (M + m) / 2
        const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))

        return new HslColor((h * 60) | 0, (s * 100) | 0, (l * 100) | 0, this.a)
    }

    public get hex(): string {
        const hexStr = ((this.r << 16) + (this.g << 8) + this.b).toString(16)
        return '#000000'.substr(0, 7 - hexStr.length) + hexStr
    }

    public get hexWithAlpha(): string {
        const a = (this.a * 2.55999999) | 0
        const r = this.r * 16777216 // 2^24
        const hexStr = (r + (this.g << 16) + (this.b << 8) + a).toString(16)
        return '#00000000'.substr(0, 9 - hexStr.length) + hexStr
    }

    public get rgbString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    public get rgbaString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 100})`
    }

    public toString(): string {
        return this.a === 100 ? this.rgbString : this.rgbaString
    }

    public invert(): RgbColor {
        return new RgbColor(255 - this.r, 255 - this.g, 255 - this.b, this.a)
    }
}
