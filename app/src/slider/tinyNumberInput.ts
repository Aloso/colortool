import { EventEmitter } from '../util/eventEmitter'

export class TinyNumberInput {
    private val = 0
    private displayVal = '0'
    private readonly minAbs: number

    public readonly min: number
    public readonly max: number

    public readonly elem = document.createElement('input') as HTMLInputElement
    public readonly change = new EventEmitter<number>()
    public readonly input = new EventEmitter<number>()

    constructor(value: number, min: number, max: number) {
        this.min = min | 0
        this.max = max | 0
        this.minAbs = Math.abs(this.min)

        this.setValue(value)
        this.displayVal = '' + this.val
        this.initElement()
    }

    public get value(): number {
        return this.val
    }

    public set value(v: number) {
        if (this.setValue(v)) {
            this.displayVal = '' + v
            this.elem.value = this.displayVal
            this.change.emit(v)
        }
    }

    /**
     * Returns whether the value changed
     *
     * This is called in the constructor, before the input is initialized!
     */
    private setValue(v: number): boolean {
        v = Math.min(this.max, Math.max(this.min, v)) | 0
        if (v !== this.val) {
            this.val = v
            return true
        }
        return false
    }

    private initElement() {
        this.elem.setAttribute('type', 'text')
        this.elem.className = 'tiny-input'
        this.elem.value = this.displayVal

        this.elem.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return

            const key = e.key.toLowerCase()
            if (key.length === 1 && isNaN(key as any)) {
                e.preventDefault()
            }
        })

        this.elem.addEventListener('input', (e: Event) => {
            const v = this.elem.value.trim()
            if (v.startsWith('-') && this.min >= 0) {
                this.elem.value = this.displayVal
            }
            const num = v === '-' ? 0 : +v

            if (!isNaN(num)) {
                const changed = this.setValue(num)
                if (changed) {
                    this.change.emit(this.val)
                    this.input.emit(this.val)
                }
                this.displayVal = (Math.abs(num) < this.minAbs || v === '') ? v : '' + this.val
                this.elem.value = this.displayVal
            } else {
                this.elem.value = this.displayVal
            }
        })

        this.elem.addEventListener('blur', () => {
            if (this.elem.value === '') {
                this.displayVal = '' + this.val
                this.elem.value = this.displayVal
            }
        })

        this.elem.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                this.value += 1
                this.input.emit(this.val)
            } else if (e.key === 'ArrowDown') {
                this.value -= 1
                this.input.emit(this.val)
            }
        })
    }
}
