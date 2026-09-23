import { KEYBOARD_ROWS, findKey, FINGER_NAMES } from '../data/keyboard'
import type { Finger } from '../data/keyboard'
import { Hands } from './Hands'

interface Props {
  nextChar: string | null
  /** Set when the user pressed the wrong shift key: the side they SHOULD use */
  shiftWarn?: 'left' | 'right' | null
}

export function Keyboard({ nextChar, shiftWarn }: Props) {
  const target = nextChar ? findKey(nextChar) : undefined
  // The side the user wrongly pressed (opposite of the expected one)
  const wrongSide = shiftWarn ? (shiftWarn === 'left' ? 'right' : 'left') : null

  return (
    <div className="keyboard" aria-hidden="true">
      {KEYBOARD_ROWS.map((row, i) => (
        <div className="kb-row" key={i}>
          {i === 0 && <Key label="⌫" wide={1.4} />}
          {row.map((key) => {
            const active = target?.base === key.base
            return (
              <Key
                key={key.base}
                label={key.base === ' ' ? '' : key.base}
                shiftLabel={key.shift}
                finger={key.finger}
                active={active}
              />
            )
          })}
          {i === 1 && <Key label="⏎" wide={1.2} />}
          {i === 2 && <Key label="⏎" wide={1.1} />}
        </div>
      ))}
      <div className="kb-row">
        <Key
          label="shift"
          wide={1.6}
          active={target?.modifier === 'shift' && target.finger.startsWith('r')}
          error={wrongSide === 'left'}
          finger="l-pinky"
        />
        <Key label="" wide={3} />
        <Key label="space" wide={6} active={target?.base === ' '} finger="thumb" />
        <Key label="altgr" wide={1.4} active={target?.modifier === 'altgr'} finger="r-pinky" />
        <Key
          label="shift"
          wide={2}
          active={target?.modifier === 'shift' && !target.finger.startsWith('r')}
          error={wrongSide === 'right'}
          finger="r-pinky"
        />
      </div>
      <Hands target={target} wrongShiftSide={wrongSide} />
      <div className="kb-hint">
        {nextChar && target ? (
          <>
            <span className="kb-hint-char">{nextChar === ' ' ? 'space' : nextChar}</span>
            {' — '}
            {FINGER_NAMES[target.finger]}
            {target.modifier === 'shift' && ' + shift (opposite pinky)'}
            {target.modifier === 'altgr' && ' + altgr (right thumb)'}
          </>
        ) : (
          ' '
        )}
      </div>
    </div>
  )
}

function Key({
  label,
  shiftLabel,
  wide,
  active,
  error,
  finger,
}: {
  label: string
  shiftLabel?: string
  wide?: number
  active?: boolean
  error?: boolean
  finger?: Finger
}) {
  return (
    <div
      className={`kb-key${active ? ' active' : ''}${error ? ' error' : ''}${finger ? ` f-${finger}` : ''}`}
      style={wide ? { flexGrow: wide, flexBasis: `${wide * 2.5}rem` } : undefined}
    >
      {shiftLabel && <span className="kb-shift-label">{shiftLabel}</span>}
      <span className="kb-label">{label}</span>
    </div>
  )
}
