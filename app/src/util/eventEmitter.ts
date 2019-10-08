import { NotNull } from './myTypes'

/**
 * Broadcasts events (functions, possibly with a value).
 *
 * This is similar to a `Stream` in dart or an `Observable` in rxjs.
 */
export class EventEmitter<T extends NotNull> {
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
        let ix = this.listeners.indexOf(listener)
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

    public get count(): number {
        return this.listeners.length
    }
}
