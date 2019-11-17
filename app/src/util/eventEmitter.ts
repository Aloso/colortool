import { NotNull } from './myTypes'

/**
 * Broadcasts events (functions, possibly with a value).
 *
 * This is similar to a `Stream` in dart or an `Observable` in rxjs.
 */
export class EventEmitter<T extends NotNull> {
    private listeners: (((event: T) => void) & { once?: true })[] = []

    /**
     * Subscribe to events
     */
    public on(listener: (event: T) => void) {
        this.listeners.push(listener)
    }

    public once(listener: ((event: T) => void) & { once?: true }) {
        listener.once = true
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
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i]
            listener(event)
            if (listener.once) {
                this.listeners.splice(i, 1)
                i--
            }
        }
    }
}
