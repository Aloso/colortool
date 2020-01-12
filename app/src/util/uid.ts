let uid = (Math.random() * 1000) | 0

export function nextUid() {
    return ++uid
}
