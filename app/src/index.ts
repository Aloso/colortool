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

function upSliderCanvas(name: string): Canvas<string[]> {
    return new Canvas(30, 350, linearGradient(Direction.Up), ['transparent', 'transparent'], name)
}

const circularCanvas = new Canvas(350, 350, roundHueGradient(15), undefined, 'hueCircle')
const circularSlider = new CircularSlider(circularCanvas, {
    min: 0,
    max: 100,
    rounding: (n: number) => n | 0,
}, {
    min: 0,
    max: 360,
    rounding: (n: number) => n | 0,
    startAngle: 0,
})

const $content = document.getElementById('content') as HTMLElement
$content.appendChild(circularSlider.elem)
$content.appendChild(document.createTextNode(' '))

const hueSlider = new LinearSlider(upSliderCanvas('hue'), slider359Options)
$content.appendChild(hueSlider.elem)
$content.appendChild(document.createTextNode(' '))


const satSlider = new LinearSlider(upSliderCanvas('sat'), slider100Options)
$content.appendChild(satSlider.elem)
$content.appendChild(document.createTextNode(' '))

const lumSlider = new LinearSlider(upSliderCanvas('lum'), slider100Options)
$content.appendChild(lumSlider.elem)
$content.appendChild(document.createTextNode(' '))

const redSlider = new LinearSlider(upSliderCanvas('red'), slider255Options)
$content.appendChild(redSlider.elem)
$content.appendChild(document.createTextNode(' '))

const greenSlider = new LinearSlider(upSliderCanvas('green'), slider255Options)
$content.appendChild(greenSlider.elem)
$content.appendChild(document.createTextNode(' '))

const blueSlider = new LinearSlider(upSliderCanvas('blue'), slider255Options)
$content.appendChild(blueSlider.elem)
$content.appendChild(document.createTextNode(' '))

const alphaSlider = new LinearSlider(upSliderCanvas('alpha'), slider100Options)
$content.appendChild(alphaSlider.elem)
$content.appendChild(document.createTextNode(' '))




let rgb = new RgbColor(255, 0, 0)
let hsl = rgb.hsl

circularSlider.input.on(({ inner, outer }) => {
    hsl = hsl.setHue(outer).setSat(inner)
    rgb = hsl.rgb
    updateSliders()
})

hueSlider.input.on(v => {
    hsl = hsl.setHue(v)
    rgb = hsl.rgb
    updateSliders()
})

satSlider.input.on(v => {
    hsl = hsl.setSat(v)
    rgb = hsl.rgb
    updateSliders()
})

lumSlider.input.on(v => {
    hsl = hsl.setLum(v)
    rgb = hsl.rgb
    updateSliders()
})

redSlider.input.on(v => {
    const old = hsl
    rgb = rgb.setR(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

greenSlider.input.on(v => {
    const old = hsl
    rgb = rgb.setG(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

blueSlider.input.on(v => {
    const old = hsl
    rgb = rgb.setB(v)
    hsl = rgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(old.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(old.sat)

    updateSliders()
})

alphaSlider.input.on(v => {
    rgb = rgb.setA(v)
    hsl = hsl.setA(v)
})

const hueIndices = [0, 1, 2, 3, 4, 5, 6]

function updateSliders() {
    const n1 = performance.now()

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
    circularSlider.value = { inner: hsl.sat, outer: hsl.hue }

    const n4 = performance.now()
    if (n4 - n1 > 8) console.log(`${(n4 - n1).toFixed(0)} ms !!!`)
}

updateSliders()
