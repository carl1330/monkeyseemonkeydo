// Swedish (sv-SE) ISO keyboard layout, with finger assignments for the
// on-screen keyboard hints.

export interface KeyDef {
  /** Base (unshifted) legend, also used as the key id */
  base: string
  shift?: string
  altgr?: string
  finger: Finger
  /** Width in layout units (1 = normal key) */
  width?: number
}

export type Finger =
  | 'l-pinky' | 'l-ring' | 'l-middle' | 'l-index'
  | 'r-index' | 'r-middle' | 'r-ring' | 'r-pinky'
  | 'thumb'

export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { base: '§', shift: '½', finger: 'l-pinky' },
    { base: '1', shift: '!', finger: 'l-pinky' },
    { base: '2', shift: '"', altgr: '@', finger: 'l-ring' },
    { base: '3', shift: '#', altgr: '£', finger: 'l-middle' },
    { base: '4', shift: '¤', altgr: '$', finger: 'l-index' },
    { base: '5', shift: '%', altgr: '€', finger: 'l-index' },
    { base: '6', shift: '&', finger: 'r-index' },
    { base: '7', shift: '/', altgr: '{', finger: 'r-index' },
    { base: '8', shift: '(', altgr: '[', finger: 'r-middle' },
    { base: '9', shift: ')', altgr: ']', finger: 'r-ring' },
    { base: '0', shift: '=', altgr: '}', finger: 'r-pinky' },
    { base: '+', shift: '?', altgr: '\\', finger: 'r-pinky' },
    { base: '´', shift: '`', finger: 'r-pinky' },
  ],
  [
    { base: 'q', finger: 'l-pinky' },
    { base: 'w', finger: 'l-ring' },
    { base: 'e', altgr: '€', finger: 'l-middle' },
    { base: 'r', finger: 'l-index' },
    { base: 't', finger: 'l-index' },
    { base: 'y', finger: 'r-index' },
    { base: 'u', finger: 'r-index' },
    { base: 'i', finger: 'r-middle' },
    { base: 'o', finger: 'r-ring' },
    { base: 'p', finger: 'r-pinky' },
    { base: 'å', finger: 'r-pinky' },
    { base: '¨', shift: '^', altgr: '~', finger: 'r-pinky' },
  ],
  [
    { base: 'a', finger: 'l-pinky' },
    { base: 's', finger: 'l-ring' },
    { base: 'd', finger: 'l-middle' },
    { base: 'f', finger: 'l-index' },
    { base: 'g', finger: 'l-index' },
    { base: 'h', finger: 'r-index' },
    { base: 'j', finger: 'r-index' },
    { base: 'k', finger: 'r-middle' },
    { base: 'l', finger: 'r-ring' },
    { base: 'ö', finger: 'r-pinky' },
    { base: 'ä', finger: 'r-pinky' },
    { base: "'", shift: '*', finger: 'r-pinky' },
  ],
  [
    { base: '<', shift: '>', altgr: '|', finger: 'l-pinky' },
    { base: 'z', finger: 'l-pinky' },
    { base: 'x', finger: 'l-ring' },
    { base: 'c', finger: 'l-middle' },
    { base: 'v', finger: 'l-index' },
    { base: 'b', finger: 'l-index' },
    { base: 'n', finger: 'r-index' },
    { base: 'm', finger: 'r-index' },
    { base: ',', shift: ';', finger: 'r-middle' },
    { base: '.', shift: ':', finger: 'r-ring' },
    { base: '-', shift: '_', finger: 'r-pinky' },
  ],
]

export interface KeyLookup {
  base: string
  modifier: 'none' | 'shift' | 'altgr'
  finger: Finger
}

const lookup = new Map<string, KeyLookup>()
for (const row of KEYBOARD_ROWS) {
  for (const key of row) {
    if (!lookup.has(key.base)) {
      lookup.set(key.base, { base: key.base, modifier: 'none', finger: key.finger })
    }
    // Uppercase letters need shift
    const upper = key.base.toUpperCase()
    if (upper !== key.base && !lookup.has(upper)) {
      lookup.set(upper, { base: key.base, modifier: 'shift', finger: key.finger })
    }
    if (key.shift && !lookup.has(key.shift)) {
      lookup.set(key.shift, { base: key.base, modifier: 'shift', finger: key.finger })
    }
    if (key.altgr && !lookup.has(key.altgr)) {
      lookup.set(key.altgr, { base: key.base, modifier: 'altgr', finger: key.finger })
    }
  }
}
lookup.set(' ', { base: ' ', modifier: 'none', finger: 'thumb' })

export function findKey(char: string): KeyLookup | undefined {
  return lookup.get(char)
}

export const FINGER_NAMES: Record<Finger, string> = {
  'l-pinky': 'left pinky',
  'l-ring': 'left ring',
  'l-middle': 'left middle',
  'l-index': 'left index',
  'r-index': 'right index',
  'r-middle': 'right middle',
  'r-ring': 'right ring',
  'r-pinky': 'right pinky',
  thumb: 'thumb',
}
