/**
 * A type that can be anything except `null`. It can be `void` or `undefined`.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type NotNull = NonNullable<unknown> | void

export function array<T>(lower: number, upper: number, f: (index: number) => T): T[] {
    const arr: T[] = Array.from({ length: upper - lower + 1 })
    for (let i = lower; i <= upper; i++) arr[i] = f(i)
    return arr
}

export function error(msg: string) {
    throw new Error(msg)
}
