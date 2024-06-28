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
export class Limit {
    private constructor(private val: number, public readonly min: number, public readonly max: number) {}

    /**
     * Create a limited number. Adjusts the number if necessary
     */
    public static from(val: number, min: number, max: number): Limit {
        val = Math.max(min, Math.min(max, val))
        return new Limit(val, min, max)
    }

    /**
     * Create a limited number. Throws an error if it's not in the bounds
     */
    public static fromErr(val: number, min: number, max: number): Limit {
        if (val < min || val > max) {
            throw new Error(`Value (${val}) out of bounds (${min}, ${max})`)
        }
        return new Limit(val, min, max)
    }

    public get(): number {
        return this.val
    }

    /**
     * Update the number. Adjusts the number if necessary
     *
     * Returns whether the value was changed
     */
    public set(val: number): boolean {
        const abs = Math.max(this.min, Math.min(this.max, val))
        if (abs !== this.val) {
            this.val = abs
            return true
        }
        return false
    }

    /**
     * Returns the value relative to the bounds (0 = min, 1 = max)
     *
     * Returns `NaN` if min === max
     */
    public getRelative(): number {
        return (this.val - this.min) / (this.max - this.min)
    }

    /**
     * Update the number relative to the bounds (0 = min, 1 = max).
     * Rounds and adjusts the number if necessary
     *
     * Returns whether the value was changed
     */
    public setRelative(val: number): boolean {
        val = Math.max(0, Math.min(1, val))
        const abs = this.min + val * (this.max - this.min)
        if (abs !== this.val) {
            this.val = abs
            return true
        }
        return false
    }
}
