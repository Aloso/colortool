import { Canvas } from './canvas/canvas'
import { roundHueGradient } from './canvas/roundHue'
import { LinearSlider } from './slider/linearSlider'
import { linearGradient } from './canvas/linearGradientCanvas'
import { CircularSlider } from './slider/circularSlider'
import { RgbColor } from './color/rgbColor'

let rgb = new RgbColor(255, 0, 0)
let hsl = rgb.hsl

const dummyGrad = ['transparent', 'transparent']

const circularCanvas = new Canvas(300, 300, roundHueGradient(15), undefined)
const circularSlider = new CircularSlider(circularCanvas, {})
document.body.appendChild(circularSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const hueCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
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


const satCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const satSlider = new LinearSlider(satCanvas, {
    min: 0,
    max: 100,
    initial: 100,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(satSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const lumCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const lumSlider = new LinearSlider(lumCanvas, {
    min: 0,
    max: 100,
    initial: 50,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(lumSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const redCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const redSlider = new LinearSlider(redCanvas, {
    min: 0,
    max: 255,
    initial: 255,
    rounding: (n: number) => n | 0,
    step: 2,
    smallStep: 1,
})
document.body.appendChild(redSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const greenCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const greenSlider = new LinearSlider(greenCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: (n: number) => n | 0,
    step: 2,
    smallStep: 1,
})
document.body.appendChild(greenSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const blueCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const blueSlider = new LinearSlider(blueCanvas, {
    min: 0,
    max: 255,
    initial: 0,
    rounding: (n: number) => n | 0,
    step: 2,
    smallStep: 1,
})
document.body.appendChild(blueSlider.elem)

document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createElement('br'))

const alphaCanvas = new Canvas(300, 30, linearGradient(), dummyGrad)
const alphaSlider = new LinearSlider(alphaCanvas, {
    min: 0,
    max: 100,
    initial: 0,
    rounding: (n: number) => n | 0,
})
document.body.appendChild(alphaSlider.elem)



hueSlider.events.on('input', v => {
    hsl = hsl.setHue(v)
    rgb = hsl.rgb
    updateSat()
    updateLum()

    updateRed()
    updateGreen()
    updateBlue()

    updateAlpha()
})

satSlider.events.on('input', v => {
    hsl = hsl.setSat(v)
    rgb = hsl.rgb
    updateHue()
    updateLum()

    updateRed()
    updateGreen()
    updateBlue()

    updateAlpha()
})

lumSlider.events.on('input', v => {
    hsl = hsl.setLum(v)
    rgb = hsl.rgb
    updateHue()
    updateSat()

    updateRed()
    updateGreen()
    updateBlue()

    updateAlpha()
})

redSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setR(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateHue()
    updateSat()
    updateLum()

    updateGreen()
    updateBlue()

    updateAlpha()
})

greenSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setG(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateHue()
    updateSat()
    updateLum()

    updateRed()
    updateBlue()

    updateAlpha()
})

blueSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setB(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateHue()
    updateSat()
    updateLum()

    updateRed()
    updateGreen()

    updateAlpha()
})

alphaSlider.events.on('input', v => {
    rgb = rgb.setA(v)
    hsl = hsl.setA(v)
})

const hueIndices = [0, 1, 2, 3, 4, 5]

function updateHue() {
    hueSlider.canvas.state = hueIndices.map(i => hsl.setHue(i * 60).hex)
    hueSlider.value = hsl.hue
}

function updateSat() {
    satSlider.canvas.state = [hsl.setSat(0).hex, hsl.setSat(100).hex]
    satSlider.value = hsl.sat
}

function updateLum() {
    lumSlider.canvas.state = ['#000', hsl.setLum(50).hex, '#fff']
    lumSlider.value = hsl.lum
}

function updateRed() {
    redSlider.canvas.state = [rgb.setR(0).hex, rgb.setR(255).hex]
    redSlider.value = rgb.r
}

function updateGreen() {
    greenSlider.canvas.state = [rgb.setG(0).hex, rgb.setG(255).hex]
    greenSlider.value = rgb.g
}

function updateBlue() {
    blueSlider.canvas.state = [rgb.setB(0).hex, rgb.setB(255).hex]
    blueSlider.value = rgb.b
}

function updateAlpha() {
    alphaSlider.canvas.state = [rgb.setA(0).rgbaString, rgb.setA(100).rgbaString]
    alphaSlider.value = rgb.a
}

updateHue()
updateSat()
updateLum()

updateRed()
updateGreen()
updateBlue()
updateAlpha()
