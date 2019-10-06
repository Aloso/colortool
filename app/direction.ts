export enum Direction {
    Right,
    Left,
    Down,
    Up,
}

export function keyToDirection(key: string): Direction | null {
    switch (key) {
        case 'ArrowRight': return Direction.Right
        case 'ArrowLeft':  return Direction.Left
        case 'ArrowDown':  return Direction.Down
        case 'ArrowUp':    return Direction.Up
        default: return null
    }
}

// mapping[sliderDir][pressed] => factor
const mapping = [
    // Right
    [1, -1, -1, 1],
    // Left
    [-1, 1, 1, -1],
    // Down
    [-1, 1, 1, -1],
    // Up
    [1, -1, -1, 1],
]

/**
 * Returns 1 or -1
 */
export function getSignForSliderKeypress(pressed: Direction, sliderDir: Direction): number {
    return mapping[sliderDir][pressed]
}
