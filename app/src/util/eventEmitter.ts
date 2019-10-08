import { NotNull } from './myTypes'

export class EventEmitter<T extends NotNull> {
    private listeners: ((event: T) => void)[] = []

    public on(listener: (event: T) => void) {
        this.listeners.push(listener)
    }

    public off(listener: (event: T) => void): boolean {
        let ix = this.listeners.indexOf(listener)
        if (ix !== -1) {
            this.listeners.splice(ix, 1)
            return true
        }
        return false
    }

    public emit(event: T) {
        for (const listener of this.listeners) {
            listener(event)
        }
    }
}
