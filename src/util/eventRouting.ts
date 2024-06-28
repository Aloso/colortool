import { NotNull } from './myTypes'

export interface Input<T> {
    on(listener: (event: T) => void): void
    off(listener: (event: T) => void): boolean
}

export interface Output<T> {
    emit(event: T): void
}

/**
 * Broadcasts events (functions, possibly with a value).
 *
 * This is similar to a `Stream` in dart or an `Observable` in rxjs.
 */
export class EventEmitter<T extends NotNull> implements Input<T>, Output<T> {
    private listeners: ((event: T) => void)[] = []

    /**
     * Subscribe to events
     */
    public on(listener: (event: T) => void) {
        this.listeners.push(listener)
    }

    /**
     * Unsubscribe from events
     */
    public off(listener: (event: T) => void): boolean {
        const ix = this.listeners.indexOf(listener)
        if (ix !== -1) {
            this.listeners.splice(ix, 1)
            return true
        }
        return false
    }

    /**
     * Broadcast an event to all listeners
     */
    public emit(event: T) {
        for (const listener of this.listeners) {
            listener(event)
        }
    }
}
