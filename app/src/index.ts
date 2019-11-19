import { Canvas } from './canvas/canvas'
import { roundHueGradient } from './canvas/roundHue'
import { linearGradient } from './canvas/linearGradientCanvas'
import { LinearSlider, SliderOptions } from './input/linearSlider'
import { CircularSlider } from './input/circularSlider'
import { SliderWithInput } from './input/sliderWithInput'
import { StringInput } from './input/stringInput'
import { Color } from './color/color'
import { RgbColor } from './color/rgbColor'
import { HslColor } from './color/hslColor'
import { Direction } from './util/dimensions'
import { PaletteCell } from './palette/paletteCell'
import { Palette } from './palette/palette'
import { Toolbar } from './toolbar/toolbar'
import { byId } from './toolbar/util'
import { array } from './util/myTypes'

const space = (width: number = 5) => {
    const el = document.createElement('div')
    el.setAttribute('style', `display: inline-block; width: ${width}px; height: 0`)
    return el
}

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

const isSmallScreen: boolean = Math.min(window.innerWidth, window.innerHeight) < 400
const sliderSize = isSmallScreen ? 200 : 299
const circleSize = isSmallScreen ? 226 : 339
const padding = isSmallScreen ? 10 : 15

function upSliderCanvas(): Canvas<string[]> {
    return new Canvas(30, sliderSize, linearGradient(Direction.Up), ['transparent', 'transparent'])
}

function upSliderInput(label: string, options: SliderOptions, transparent = false): SliderWithInput<string[]> {
    const slider = new LinearSlider(upSliderCanvas(), options)
    if (transparent) slider.elem.classList.add('transparent')
    return new SliderWithInput(slider, label)
}

function textHexInput(label: string, value: Color<any>): StringInput {
    return new StringInput(label, value.rgb.hex)
}

const circularCanvas = new Canvas(circleSize, circleSize, roundHueGradient(padding), undefined)
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


let rgb = new RgbColor(255, 0, 0)
let hsl = rgb.hsl


const hueInput = upSliderInput('H', slider359Options)
const satInput = upSliderInput('S', slider100Options)
const lumInput = upSliderInput('L', slider100Options)
const redInput = upSliderInput('R', slider255Options)
const greenInput = upSliderInput('G', slider255Options)
const blueInput = upSliderInput('B', slider255Options)
const alphaInput = upSliderInput('A', slider100Options, true)
const hexInput = textHexInput('Hex: ', rgb)

const contentCircle = byId('cp-circle-inner', HTMLElement)
const contentSlider = byId('cp-slider', HTMLElement)
const contentPalette = byId('cp-palette', HTMLElement)
const contentTexts = byId('cp-texts', HTMLElement)

contentCircle.append(circularSlider.elem)
contentSlider.append(
    hueInput.elem, space(),
    satInput.elem, space(),
    lumInput.elem, space(15),
    redInput.elem, space(),
    greenInput.elem, space(),
    blueInput.elem, space(15),
    alphaInput.elem,
)
contentTexts.append(
    hexInput.label,
    hexInput.elem,
)


const livePalette = new PaletteCell(rgb, true)
livePalette.elem.className += ' big round'
contentCircle.prepend(livePalette.elem)

const $palette = document.createElement('div')
$palette.setAttribute('style', 'display: inline-block; vertical-align: top')
const paletteHues = [0, 22, 38, 60, 83, 120, 150, 180, 197, 219, 240, 260, 280, 300, 330]

const makeCell = (hue: number, sat: number, lum: number) =>
    new PaletteCell(new HslColor(hue, sat, 100 - lum))

const makePalette = (sat: number) => [20, 35, 50, 65, 80]
    .map(lum => paletteHues.map(hue => makeCell(hue, sat, lum)))

const paletteRows: PaletteCell[][] = [
    array(0, 14, l => makeCell(0, 0, l / 14 * 100)),
    ...makePalette(100),
    ...makePalette(55),
]

const palette = new Palette(paletteRows, contentPalette)
palette.select.on(cell => {
    hsl = cell.color.hsl
    rgb = cell.color.rgb
    updateSliders()
    updateLivePalette()
})

circularSlider.input.on(({ inner, outer }) => {
    hsl = hsl.setHue(outer).setSat(inner)
    rgb = hsl.rgb
    updateSliders()
    updateLivePalette()
})

hueInput.input.on(v => {
    hsl = hsl.setHue(v)
    rgb = hsl.rgb
    updateSliders()
    updateLivePalette()
})

satInput.input.on(v => {
    hsl = hsl.setSat(v)
    rgb = hsl.rgb
    updateSliders()
    updateLivePalette()
})

lumInput.input.on(v => {
    hsl = hsl.setLum(v)
    rgb = hsl.rgb
    updateSliders()
    updateLivePalette()
})

redInput.input.on(v => {
    setColorsFromRgb(rgb.setR(v))
    updateSliders()
    updateLivePalette()
})

greenInput.input.on(v => {
    setColorsFromRgb(rgb.setG(v))
    updateSliders()
    updateLivePalette()
})

blueInput.input.on(v => {
    setColorsFromRgb(rgb.setB(v))
    updateSliders()
    updateLivePalette()
})

alphaInput.input.on(v => {
    rgb = rgb.setA(v)
    hsl = hsl.setA(v)
    updateLivePalette()
    hexInput.value = showHexInAlpha ? rgb.hexWithAlpha : rgb.hex
})

const hueIndices = [0, 1, 2, 3, 4, 5, 6]

function updateSliders() {
    hueInput.canvasState = hueIndices.map(i => hsl.setHue(i * 60).hex)
    satInput.canvasState = [hsl.setSat(0).hex, hsl.setSat(100).hex]
    lumInput.canvasState = ['#000', hsl.setLum(50).hex, '#fff']

    redInput.canvasState = [rgb.setR(0).hex, rgb.setR(255).hex]
    greenInput.canvasState = [rgb.setG(0).hex, rgb.setG(255).hex]
    blueInput.canvasState = [rgb.setB(0).hex, rgb.setB(255).hex]

    alphaInput.canvasState = [rgb.setA(0).rgbaString, rgb.setA(100).rgbaString]

    hueInput.value = hsl.hue
    satInput.value = hsl.sat
    lumInput.value = hsl.lum

    redInput.value = rgb.r
    greenInput.value = rgb.g
    blueInput.value = rgb.b

    alphaInput.value = rgb.a
    circularSlider.value = { inner: hsl.sat, outer: hsl.hue }

    hexInput.value = showHexInAlpha ? rgb.hexWithAlpha : rgb.hex
}

function setColorsFromRgb(newRgb: RgbColor) {
    const oldHsl = hsl
    rgb = newRgb
    hsl = newRgb.hsl
    if (hsl.sat === 0) hsl = hsl.setHue(oldHsl.hue)
    if (hsl.lum === 0 || hsl.lum === 100) hsl = hsl.setSat(oldHsl.sat)
}

function updateLivePalette() {
    livePalette.color = rgb
}

function invert() {
    rgb = rgb.invert()
    hsl = rgb.hsl
    updateSliders()
    updateLivePalette()
}

hexInput.elem.className = 'small-input'
hexInput.elem.style.fontFamily = '"Roboto Mono", Consolas, "Noto Mono", Hack, "Droid Sans Mono"'
hexInput.input.on(s => {
    console.log(s)
    const color = RgbColor.fromHex(s)
    console.log(color)
    if (color != null) {
        rgb = color
        hsl = rgb.hsl
        updateSliders()
        updateLivePalette()
    }
})

let showHexInAlpha = false

function toggleShowHexInAlpha() {
    showHexInAlpha = !showHexInAlpha
    hexInput.value = showHexInAlpha ? rgb.hexWithAlpha : rgb.hex
}


updateSliders()

const toolbar = new Toolbar([
    {
        label: '<u>E</u>dit',
        shortcut: 'alt+e',
        children: [
            {
                label: '<u>I</u>nvert',
                shortcut: 'alt+i',
                globalShortcut: 'i',
                action(e?: Event) {
                    invert()
                    e?.preventDefault()
                },
            },
            {
                label: 'Show hex with <u>a</u>lpha',
                shortcut: 'alt+a',
                globalShortcut: 'a',
                action(e?: Event) {
                    toggleShowHexInAlpha()
                    e?.preventDefault()
                },
            },
        ],
    },
])
toolbar.show(null, byId('toolbar', HTMLElement))
