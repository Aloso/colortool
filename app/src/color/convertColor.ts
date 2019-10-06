/**
 * luminance is 1/2.
 *
 * @param h - hue, a number between [0, 6)
 * @param s - saturation, a number between [0, 1)
 */
export function hsToRgb(h: number, s: number): [number, number, number] {
    const X = s * (1 - Math.abs(h % 2 - 1))
    let r = 0
    let g = 0
    let b = 0

    if (h >= 0 && h < 1) {
        r = s
        g = X
    } else if (h >= 1 && h < 2) {
        r = X
        g = s
    } else if (h >= 2 && h < 3) {
        g = s
        b = X
    } else if (h >= 3 && h < 4) {
        g = X
        b = s
    } else if (h >= 4 && h < 5) {
        r = X
        b = s
    } else {
        r = s
        b = X
    }

    const m = (1 - s) / 2
    r = Math.floor((r + m) * 255)
    g = Math.floor((g + m) * 255)
    b = Math.floor((b + m) * 255)
    return [r, g, b]
}
