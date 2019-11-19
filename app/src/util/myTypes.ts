/**
 * A type that can be anything except `null`. It can be `void` or `undefined`.
 */
export type NotNull = {} | void

export function array<T>(lower: number, upper: number, f: (index: number) => T): T[] {
    const arr: T[] = new Array(upper - lower + 1)
    for (let i = lower; i <= upper; i++) arr[i] = f(i)
    return arr
}
