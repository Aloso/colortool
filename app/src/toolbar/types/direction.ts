export enum Direction {
    Left = 0,
    Up = 1,
    Right = 2,
    Down = 3,
}

/**
 * Up   <-> Down
 * Left <-> Right
 */
export function inverse(direction: Direction): Direction {
    return (direction + 2) % 4
}

/**
 * Left  <-> Up
 * Right <-> Down
 */
export function pivot(direction: Direction): Direction {
    if (direction < 2) return 1 - direction
    else return 5 - direction
}

/**
 * Left --> Left
 * Right -> Left
 * Up   --> Up
 * Down --> Up
 */
export function directionMin(direction: Direction): Direction {
    return direction % 2
}
