import type { Finger, KeyLookup } from '../data/keyboard'

interface Props {
  target: KeyLookup | undefined
}

type Highlight = 'active' | 'modifier' | undefined

interface FingerShape {
  finger: Finger | 'l-thumb' | 'r-thumb'
  x: number
  y: number
  w: number
  h: number
  rotate?: number
}

// Left hand finger shapes (viewBox 0 0 150 120), right hand is mirrored.
const LEFT_FINGERS: FingerShape[] = [
  { finger: 'l-pinky', x: 6, y: 34, w: 17, h: 52 },
  { finger: 'l-ring', x: 27, y: 14, w: 18, h: 72 },
  { finger: 'l-middle', x: 49, y: 6, w: 18, h: 80 },
  { finger: 'l-index', x: 71, y: 16, w: 18, h: 70 },
  { finger: 'l-thumb', x: 108, y: 62, w: 17, h: 44, rotate: 30 },
]

function mirror(shape: FingerShape, finger: Finger | 'r-thumb'): FingerShape {
  return {
    finger,
    x: 150 - shape.x - shape.w,
    y: shape.y,
    w: shape.w,
    h: shape.h,
    rotate: shape.rotate ? -shape.rotate : undefined,
  }
}

const RIGHT_FINGERS: FingerShape[] = [
  mirror(LEFT_FINGERS[0], 'r-pinky'),
  mirror(LEFT_FINGERS[1], 'r-ring'),
  mirror(LEFT_FINGERS[2], 'r-middle'),
  mirror(LEFT_FINGERS[3], 'r-index'),
  mirror(LEFT_FINGERS[4], 'r-thumb'),
]

export function Hands({ target }: Props) {
  const highlights = new Map<string, Highlight>()

  if (target) {
    if (target.finger === 'thumb') {
      // Space: either thumb works — light up the right one by convention
      highlights.set('r-thumb', 'active')
    } else {
      highlights.set(target.finger, 'active')
    }
    if (target.modifier === 'shift') {
      // Shift is held with the pinky of the opposite hand
      const opposite = target.finger.startsWith('l') ? 'r-pinky' : 'l-pinky'
      highlights.set(opposite, highlights.has(opposite) ? 'active' : 'modifier')
    }
    if (target.modifier === 'altgr') {
      highlights.set('r-thumb', 'modifier')
    }
  }

  return (
    <div className="hands">
      <Hand shapes={LEFT_FINGERS} palmX={6} highlights={highlights} />
      <Hand shapes={RIGHT_FINGERS} palmX={53} highlights={highlights} />
    </div>
  )
}

function Hand({
  shapes,
  palmX,
  highlights,
}: {
  shapes: FingerShape[]
  palmX: number
  highlights: Map<string, Highlight>
}) {
  return (
    <svg viewBox="0 0 150 120" className="hand" aria-hidden="true">
      <rect className="hand-palm" x={palmX} y={68} width={91} height={50} rx={16} />
      {shapes.map((s) => {
        const hl = highlights.get(s.finger)
        return (
          <rect
            key={s.finger}
            className={`hand-finger${hl ? ` ${hl}` : ''}`}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={s.w / 2}
            transform={s.rotate ? `rotate(${s.rotate} ${s.x + s.w / 2} ${s.y})` : undefined}
          />
        )
      })}
    </svg>
  )
}
