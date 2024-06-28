// adapted from https://github.com/rafrex/detect-passive-events/blob/master/src/index.js
let passive = false

const options = Object.defineProperty({}, 'passive', {
    get() {
        passive = true
    },
})

const noop = () => {}
window.addEventListener('testPassiveEventSupport', noop, options)
window.removeEventListener('testPassiveEventSupport', noop, options)

export const supportsPassiveEvents = passive

export const supportsTouch = 'ontouchstart' in window
