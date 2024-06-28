export function hasAncestor(elem: HTMLElement, ancestor: HTMLElement): boolean {
    let current: HTMLElement | null = elem

    do {
        if (current === ancestor) return true
        current = current.parentElement
    } while (current != null && current !== document.documentElement)

    return false
}

export function byId<T extends HTMLElement>(id: string, type: new () => T): T {
    const elem = document.getElementById(id)
    if (elem instanceof type) {
        return elem
    } else if (elem == null) {
        throw new Error(`${type.name} with id='${id}' doesn't exist`)
    } else {
        throw new Error(`Element with id='${id}' is an ${elem.constructor.name} instead of a ${type.name}`)
    }
}
