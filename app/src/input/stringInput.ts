import { EventEmitter } from '../util/eventEmitter'

export class StringInput {
    public readonly elem = document.createElement('input')
    public readonly label = document.createElement('label')

    public readonly change = new EventEmitter<string>()
    public readonly input = new EventEmitter<string>()

    constructor(label: string, private val: string) {
        this.elem.value = val
        this.label.innerHTML = label
        this.initElement()
    }

    public get value(): string {
        return this.val
    }

    public set value(v: string) {
        if (this.val !== v) {
            this.elem.value = this.val = v
            this.change.emit(v)
        }
    }

    private initElement() {
        this.elem.setAttribute('type', 'text')

        this.elem.addEventListener('input', () => {
            this.value = this.elem.value
            this.input.emit(this.value)
        })
    }
}
