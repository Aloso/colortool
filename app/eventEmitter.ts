
export class EventEmitter<T extends {} | void> {
    private listeners: { [type: string]: ((event: T) => void)[] } = {};

    public on(type: string, listener: (event: T) => void) {
        if (this.listeners[type] == null) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener)
    }

    public off(type: string, listener: (event: T) => void): boolean {
        if (this.listeners[type] != null) {
            let arr = this.listeners[type];
            let ix = arr.indexOf(listener);
            if (ix !== -1) {
                arr.splice(ix, 1);
                return true;
            }
        }
        return false;
    }

    public emit(type: string, event: T) {
        if (this.listeners[type] != null) {
            for (const listener of this.listeners[type]) {
                listener(event);
            }
        }
    }
}