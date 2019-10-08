/**
 * A number that is guaranteed to lie between `Min` and `Max`.
 *
 * If `Min` and `Max` are known up-front, this is type-safe:
 *
 * ```
 * function faulty(a: Limit<0, 5>, b: Limit<0, 7>) {
 *     b = a // type mismatch!
 * }
 * ```
 */
export class Limit<Min extends number = number, Max extends number = number> {
    private _val: number

    private constructor(val: number, public readonly min: Min, public readonly max: Max) {
        this._val = val
    }

    /**
     * Create a limited number. Make sure that it's within the bounds before calling this.
     */
    public static unchecked<A extends number, B extends number>(val: number, min: A, max: B): Limit<A, B> {
        return new Limit(val, min, max)
    }

    /**
     * Create a limited number. Adjusts the number if necessary
     */
    public static from<A extends number, B extends number>(val: number, min: A, max: B): Limit<A, B> {
        val = Math.max(min, Math.min(max, val))
        return new Limit(val, min, max)
    }

    /**
     * Create a limited number. Throws an error if it's not in the bounds
     */
    public static fromErr<A extends number, B extends number>(val: number, min: A, max: B): Limit<A, B> {
        if (val < min || val > max) {
            throw new Error(`Value (${val}) out of bounds (${min}, ${max})`)
        }
        return new Limit(val, min, max)
    }

    public get(): number {
        return this._val
    }

    /**
     * Update the number. Adjusts the number if necessary
     *
     * Returns whether the value was changed
     */
    public set(val: number): boolean {
        const abs = Math.max(this.min, Math.min(this.max, val))
        if (abs !== this._val) {
            this._val = abs
            return true
        }
        return false
    }

    /**
     * Update the number. Make sure that it's within the bounds before calling this
     */
    public setUnchecked(val: number) {
        this._val = val
    }

    /**
     * Update the number. Throws an error if the value is not in the bounds
     */
    public setErr(val: number) {
        if (val < this.min || val > this.max) {
            throw new Error(`Value (${val}) out of bounds (${this.min}, ${this.max})`)
        }
        this._val = val
    }

    /**
     * Returns a new `Limit` with the same bounds. Adjusts the number if necessary
     */
    public copy(val = this._val): Limit<Min, Max> {
        val = Math.max(this.min, Math.min(this.max, val))
        return new Limit(val, this.min, this.max)
    }

    /**
     * Returns a new `Limit` with the same bounds. Throws an Error if the number is not in the bounds
     */
    public copyErr(val: number) {
        if (val < this.min || val > this.max) {
            throw new Error(`Value (${val}) out of bounds (${this.min}, ${this.max})`)
        }
        return new Limit(val, this.min, this.max)
    }

    /**
     * Returns a new `Limit` with the same bounds. Make sure that it's within the bounds before calling this
     */
    public copyUnchecked(val = this._val): Limit<Min, Max> {
        return new Limit(val, this.min, this.max)
    }


    /**
     * Returns the value relative to the bounds (0 = min, 1 = max)
     *
     * Returns `NaN` if min === max
     */
    public getRelative(): number {
        return (this._val - this.min) / (this.max - this.min)
    }

    /**
     * Update the number relative to the bounds (0 = min, 1 = max).
     * Rounds and adjusts the number if necessary
     *
     * Returns whether the value was changed
     */
    public setRelative(val: number, round = (n: number) => n): boolean {
        val = Math.max(0, Math.min(1, val))
        const abs = round(this.min + val * (this.max - this.min))
        if (abs !== this._val) {
            this._val = abs
            return true
        }
        return false
    }
}
