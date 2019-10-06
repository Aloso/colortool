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

const lumValues = ['#fff', '#f00', '#000']

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

    const sat0 = hslToRgb(hue, 0, lum)
    const sat1 = hslToRgb(hue, 100, lum)
    satValues[0] = `rgb(${sat0[0]}, ${sat0[1]}, ${sat0[2]})`
    satValues[1] = `rgb(${sat1[0]}, ${sat1[1]}, ${sat1[2]})`

    const lum1 = hslToRgb(hue, sat, 50)
    lumValues[1] = `rgb(${lum1[0]}, ${lum1[1]}, ${lum1[2]})`

    lumCanvas.redraw()
    satCanvas.redraw()
})

satSlider.events.on('change', v => {
    sat = v

    const lum1 = hslToRgb(hue, sat, 50)
    lumValues[1] = `rgb(${lum1[0]}, ${lum1[1]}, ${lum1[2]})`
    lumCanvas.redraw()
})

lumSlider.events.on('change', v => {
    lum = v

    const sat0 = hslToRgb(hue, 0, lum)
    const sat1 = hslToRgb(hue, 100, lum)
    satValues[0] = `rgb(${sat0[0]}, ${sat0[1]}, ${sat0[2]})`
    satValues[1] = `rgb(${sat1[0]}, ${sat1[1]}, ${sat1[2]})`

    satCanvas.redraw()
})
