import { NotNull } from '../util/myTypes'
import { LinearSlider } from './linearSlider'

class SliderWithText<S extends NotNull> {
    public readonly elem = document.createElement('div')
    private readonly labelElem = document.createElement('div')

    private _label = ''



    constructor(public readonly slider: LinearSlider<S>, label: string) {
        this.label = label
        this.initElement()
    }

    public get label(): string {
        return this._label
    }

    public set label(l: string) {
        this._label = l
        this.labelElem.textContent = l
    }

    private initElement() {
        this.elem.appendChild(this.labelElem)
    }

}
