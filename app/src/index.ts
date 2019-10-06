import { Canvas } from './canvas/canvas'
import { roundHueGradient } from './canvas/roundHue'
import { LinearSlider } from './slider/linearSlider'
import { linearGradient } from './canvas/linearGradientCanvas'
import { CircularSlider } from './slider/circularSlider'
import { hslToRgb, rgbToHsl } from './color/convertColor'

let hue = 0
let sat = 100
let lum = 50

const hueValues = [
    '#f00',
    '#ff0',
    '#0f0',
    '#0ff',
    '#00f',
    '#f0f',
    '#f00',
]
const satValues = ['#777', '#f00']
const lumValues = ['#000', '#f00', '#fff']
const redValues = ['#000', '#f00']
const greenValues = ['#f00', '#ff0']
const blueValues = ['#f00', '#f0f']


const circularCanvas = new Canvas(300, 300, roundHueGradient(15))
const circularSlider = new CircularSlider(circularCanvas, {})
document.body.appendChild(circularSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const hueCanvas = new Canvas(300, 30, linearGradient(hueValues))
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

const lumCanvas = new Canvas(300, 30, linearGradient(lumValues))
const lumSlider = new LinearSlider(lumCanvas, {
    min: 0,
    max: 100,
    initial: 50,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(lumSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const redCanvas = new Canvas(300, 30, linearGradient(redValues))
const redSlider = new LinearSlider(redCanvas, {
    min: 0,
    max: 255,
    initial: 255,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(redSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const greenCanvas = new Canvas(300, 30, linearGradient(greenValues))
const greenSlider = new LinearSlider(greenCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(greenSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const blueCanvas = new Canvas(300, 30, linearGradient(blueValues))
const blueSlider = new LinearSlider(blueCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(blueSlider.elem)



hueSlider.events.on('change', v => {
    hue = v
    updateSat()
    updateLum(true)

    updateRed()
    updateGreen()
    updateBlue()
})

satSlider.events.on('change', v => {
    sat = v
    updateHue()
    updateLum(true)

    updateRed()
    updateGreen()
    updateBlue()
})

lumSlider.events.on('change', v => {
    lum = v
    updateHue()
    updateSat()

    updateRed()
    updateGreen()
    updateBlue()
})

redSlider.events.on('change', v => {
    [hue, sat, lum] = rgbToHsl(v, greenSlider.value, blueSlider.value)
    //updateHue()
    //updateSat()
    //updateLum()

    updateGreen(true)
    updateBlue(true)
})

greenSlider.events.on('change', v => {
    [hue, sat, lum] = rgbToHsl(redSlider.value, v, blueSlider.value)
    //updateHue()
    //updateSat()
    //updateLum()

    updateRed(true)
    updateBlue(true)
})

blueSlider.events.on('change', v => {
    [hue, sat, lum] = rgbToHsl(redSlider.value, greenSlider.value, v)
    //updateHue()
    //updateSat()
    //updateLum()

    updateRed(true)
    updateGreen(true)
})


function rgbString(rgb: [number, number, number]): string {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function updateHue() {
    hueSlider.setLinearGradient(hueValues.map((_, i) => rgbString(hslToRgb(  i * 60, sat, lum))))
    hueSlider.value = hue
}

function updateSat() {
    satSlider.setLinearGradient([
        rgbString(hslToRgb(hue, 0, lum)),
        rgbString(hslToRgb(hue, 100, lum)),
    ])
    satSlider.value = sat
}

function updateLum(canvasOnly = false) {
    lumSlider.setLinearGradient(['#000', rgbString(hslToRgb(hue, sat, 50)), '#fff'])

    if (!canvasOnly) lumSlider.value = lum
}

function updateRed(canvasOnly = false) {
    const [r, g, b] = hslToRgb(hue, sat, lum)
    redSlider.setLinearGradient([
        rgbString([0, g, b]),
        rgbString([255, g, b]),
    ])

    if (!canvasOnly) redSlider.value = r
}

function updateGreen(canvasOnly = false) {
    const [r, g, b] = hslToRgb(hue, sat, lum)
    greenSlider.setLinearGradient([
        rgbString([r, 0, b]),
        rgbString([r, 255, b]),
    ])

    if (!canvasOnly) greenSlider.value = g
}

function updateBlue(canvasOnly = false) {
    const [r, g, b] = hslToRgb(hue, sat, lum)
    blueSlider.setLinearGradient([
        rgbString([r, g, 0]),
        rgbString([r, g, 255]),
    ])

    if (!canvasOnly) blueSlider.value = b
}
