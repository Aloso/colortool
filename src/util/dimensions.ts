export enum Direction {
    Right,
    Left,
    Down,
    Up,
}

export enum CircleOuterDir {
    Clockwise,
    Anticlockwise,
}

export enum CircleInnerDir {
    Outwards,
    Inwards,
}

export function keyToDirection(key: string): Direction | null {
    switch (key) {
        case 'ArrowRight':
            return Direction.Right
        case 'ArrowLeft':
            return Direction.Left
        case 'ArrowDown':
            return Direction.Down
        case 'ArrowUp':
            return Direction.Up
        default:
            return null
    }
}

// mapping[sliderDir][pressed] => factor
const mapping: (1 | -1)[][] = [
    // Right
    [1, -1, -1, 1],
    // Left
    [-1, 1, 1, -1],
    // Down
    [-1, 1, 1, -1],
    // Up
    [1, -1, -1, 1],
]

export function getSignForSliderKeypress(pressed: Direction, sliderDir: Direction): 1 | -1 {
    return mapping[sliderDir][pressed]
}
