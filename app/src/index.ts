import { Canvas } from './canvas/canvas'
import { roundHueGradient } from './canvas/roundHue'
import { LinearSlider, SliderOptions } from './slider/linearSlider'
import { linearGradient } from './canvas/linearGradientCanvas'
import { CircularSlider } from './slider/circularSlider'
import { RgbColor } from './color/rgbColor'
import { Direction } from './util/direction'

const slider359Options: SliderOptions = {
    min: 0,
    max: 359,
    initial: 0,
    rounding: (n: number) => n | 0,
    step: 4,
    smallStep: 1,
    direction: Direction.Up,
}

const slider255Options: SliderOptions = {
    ...slider359Options,
    max: 255,
    step: 2,
}

const slider100Options: SliderOptions = {
    ...slider359Options,
    max: 100,
    step: 1,
}

function upSliderCanvas(): Canvas<string[]> {
    return new Canvas(30, 350, linearGradient(Direction.Up), ['transparent', 'transparent'])
}

const circularCanvas = new Canvas(350, 350, roundHueGradient(15), undefined)
const circularSlider = new CircularSlider(circularCanvas, {})
document.body.appendChild(circularSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const hueSlider = new LinearSlider(upSliderCanvas(), slider359Options)
document.body.appendChild(hueSlider.elem)
document.body.appendChild(document.createTextNode(' '))


const satSlider = new LinearSlider(upSliderCanvas(), slider100Options)
document.body.appendChild(satSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const lumSlider = new LinearSlider(upSliderCanvas(), slider100Options)
document.body.appendChild(lumSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const redSlider = new LinearSlider(upSliderCanvas(), slider255Options)
document.body.appendChild(redSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const greenSlider = new LinearSlider(upSliderCanvas(), slider255Options)
document.body.appendChild(greenSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const blueSlider = new LinearSlider(upSliderCanvas(), slider255Options)
document.body.appendChild(blueSlider.elem)
document.body.appendChild(document.createTextNode(' '))

const alphaSlider = new LinearSlider(upSliderCanvas(), slider100Options)
document.body.appendChild(alphaSlider.elem)
document.body.appendChild(document.createTextNode(' '))




let rgb = new RgbColor(255, 0, 0)
let hsl = rgb.hsl

hueSlider.events.on('input', v => {
    hsl = hsl.setHue(v)
    rgb = hsl.rgb
    updateSliders()
})

satSlider.events.on('input', v => {
    hsl = hsl.setSat(v)
    rgb = hsl.rgb
    updateSliders()
})

lumSlider.events.on('input', v => {
    hsl = hsl.setLum(v)
    rgb = hsl.rgb
    updateSliders()
})

redSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setR(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

greenSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setG(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

blueSlider.events.on('input', v => {
    const old = hsl
    rgb = rgb.setB(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

alphaSlider.events.on('input', v => {
    rgb = rgb.setA(v)
    hsl = hsl.setA(v)
})

const hueIndices = [0, 1, 2, 3, 4, 5, 6]

function updateSliders() {
    hueSlider.canvas.state = hueIndices.map(i => hsl.setHue(i * 60).hex)
    satSlider.canvas.state = [hsl.setSat(0).hex, hsl.setSat(100).hex]
    lumSlider.canvas.state = ['#000', hsl.setLum(50).hex, '#fff']
    redSlider.canvas.state = [rgb.setR(0).hex, rgb.setR(255).hex]
    greenSlider.canvas.state = [rgb.setG(0).hex, rgb.setG(255).hex]
    blueSlider.canvas.state = [rgb.setB(0).hex, rgb.setB(255).hex]
    alphaSlider.canvas.state = [rgb.setA(0).rgbaString, rgb.setA(100).rgbaString]

    hueSlider.value = hsl.hue
    satSlider.value = hsl.sat
    lumSlider.value = hsl.lum
    redSlider.value = rgb.r
    greenSlider.value = rgb.g
    blueSlider.value = rgb.b
    alphaSlider.value = rgb.a
}

updateSliders()
