import { Canvas } from './canvas'
import { roundHueGradient } from './roundHue'
import { LinearSlider } from './linearSlider'
import { linearGradient } from './linearGradientCanvas'
import { CircularSlider } from './circularSlider'
import { hslToRgb } from './color'

let hue = 0
let sat = 100
let lum = 50

const hues = [
    '#f00',
    '#ff0',
    '#0f0',
    '#0ff',
    '#00f',
    '#f0f',
    '#f00',
]

const circularCanvas = new Canvas(300, 300, roundHueGradient(15))
const circularSlider = new CircularSlider(circularCanvas, {})
document.body.appendChild(circularSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const hueCanvas = new Canvas(300, 30, linearGradient(hues))
const hueSlider = new LinearSlider(hueCanvas, {
    min: 0,
    max: 359.9,
    initial: 0,
    rounding: (n: number) => n | 0,
    step: 4,
    smallStep: 1,
})
document.body.appendChild(hueSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const satValues = ['#777', '#f00']

const satCanvas = new Canvas(300, 30, linearGradient(satValues))
const satSlider = new LinearSlider(satCanvas, {
    min: 0,
    max: 100,
    initial: 100,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(satSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const lumValues = ['#000', '#f00', '#fff']

const lumCanvas = new Canvas(300, 30, linearGradient(lumValues))
const lumSlider = new LinearSlider(lumCanvas, {
    min: 0,
    max: 100,
    initial: 50,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(lumSlider.elem)

hueSlider.events.on('change', v => {
    hue = v

    satValues[0] = rgbString(hslToRgb(hue, 0, lum))
    satValues[1] = rgbString(hslToRgb(hue, 100, lum))
    satCanvas.redraw()

    lumValues[1] = rgbString(hslToRgb(hue, sat, 50))
    lumCanvas.redraw()
})

satSlider.events.on('change', v => {
    sat = v

    hues[0] = rgbString(hslToRgb(  0, sat, lum))
    hues[1] = rgbString(hslToRgb( 60, sat, lum))
    hues[2] = rgbString(hslToRgb(120, sat, lum))
    hues[3] = rgbString(hslToRgb(180, sat, lum))
    hues[4] = rgbString(hslToRgb(240, sat, lum))
    hues[5] = rgbString(hslToRgb(300, sat, lum))
    hues[6] = hues[0]
    hueCanvas.redraw()

    lumValues[1] = rgbString(hslToRgb(hue, sat, 50))
    lumCanvas.redraw()
})

lumSlider.events.on('change', v => {
    lum = v

    hues[0] = rgbString(hslToRgb(  0, sat, lum))
    hues[1] = rgbString(hslToRgb( 60, sat, lum))
    hues[2] = rgbString(hslToRgb(120, sat, lum))
    hues[3] = rgbString(hslToRgb(180, sat, lum))
    hues[4] = rgbString(hslToRgb(240, sat, lum))
    hues[5] = rgbString(hslToRgb(300, sat, lum))
    hues[6] = hues[0]
    hueCanvas.redraw()

    satValues[0] = rgbString(hslToRgb(hue, 0, lum))
    satValues[1] = rgbString(hslToRgb(hue, 100, lum))
    satCanvas.redraw()
})

function rgbString(rgb: [number, number, number]): string {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
