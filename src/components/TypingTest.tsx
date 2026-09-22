import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Lesson } from '../data/lessons'
import { generateDrill } from '../data/lessons'
import { Keyboard } from './Keyboard'

interface Props {
  lesson: Lesson
  onFinish: (result: TestResult) => void
  onBack: () => void
}

export interface TestResult {
  lessonId: number
  wpm: number
  accuracy: number
  seconds: number
  errors: number
  /** Cleared with no mistakes in under 60 seconds */
  passed: boolean
}

type CharState = 'pending' | 'correct' | 'incorrect'

interface TestState {
  chars: string[]
  states: CharState[]
  pos: number
  startedAt: number | null
  errors: number
  finished: boolean
}

function newTest(lesson: Lesson): TestState {
  const chars = [...generateDrill(lesson).join(' ')]
  return {
    chars,
    states: chars.map(() => 'pending' as CharState),
    pos: 0,
    startedAt: null,
    errors: 0,
    finished: false,
  }
}

export function TypingTest({ lesson, onFinish, onBack }: Props) {
  const [test, setTest] = useState<TestState>(() => newTest(lesson))
  const [now, setNow] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [capsOn, setCapsOn] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  const restart = useCallback(() => {
    setTest(newTest(lesson))
    setResult(null)
    containerRef.current?.focus()
  }, [lesson])

  // Focus the test area on mount so typing works immediately
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  // Live timer for the WPM readout
  useEffect(() => {
    if (test.startedAt === null || test.finished) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [test.startedAt, test.finished])

  useEffect(() => {
    caretRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [test.pos])

  // On the results screen: tab or ctrl+r starts the next drill
  useEffect(() => {
    if (!result) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault()
        restart()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [result, restart])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (result) return
    if (e.key === 'Tab' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
      e.preventDefault()
      restart()
      return
    }
    if (e.getModifierState('CapsLock')) {
      setCapsOn(true)
      return
    }
    setCapsOn(false)
    if (e.key === 'Backspace') {
      // Backspace is disabled: a wrong key never advances, so there is nothing to undo
      e.preventDefault()
      return
    }
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey) return
    e.preventDefault()

    setTest((t) => {
      if (t.finished) return t
      const startedAt = t.startedAt ?? Date.now()
      const states = [...t.states]
      const correct = e.key === t.chars[t.pos]

      if (!correct) {
        // Stay on the same character until the right key is pressed
        states[t.pos] = 'incorrect'
        return { ...t, states, startedAt, errors: t.errors + 1 }
      }

      // A char missed earlier stays marked incorrect for the accuracy tally
      if (states[t.pos] === 'pending') states[t.pos] = 'correct'
      const pos = t.pos + 1
      const finished = pos >= t.chars.length
      const errors = t.errors

      if (finished) {
        const seconds = (Date.now() - startedAt) / 1000
        const correctChars = states.filter((s) => s === 'correct').length
        const wpm = Math.round(correctChars / 5 / (seconds / 60))
        const res: TestResult = {
          lessonId: lesson.id,
          wpm,
          // correct keypresses / total keypresses
          accuracy: Math.round((t.chars.length / (t.chars.length + errors)) * 1000) / 10,
          seconds: Math.round(seconds),
          errors,
          passed: errors === 0 && seconds < 60,
        }
        setResult(res)
        onFinish(res)
      }
      return { ...t, states, pos, startedAt, errors, finished }
    })
  }

  const liveStats = useMemo(() => {
    if (test.startedAt === null) return { wpm: 0, acc: 100 }
    const seconds = Math.max((now - test.startedAt) / 1000, 1)
    const correctChars = test.states.filter((s) => s === 'correct').length
    const presses = test.pos + test.errors
    return {
      wpm: Math.round(correctChars / 5 / (seconds / 60)),
      acc: presses === 0 ? 100 : Math.round((test.pos / presses) * 100),
    }
  }, [test, now])

  const nextChar = test.finished ? null : test.chars[test.pos]

  if (result) {
    return (
      <div className="result-screen">
        {result.passed ? (
          <div className="pass-banner passed">✓ lesson passed — no mistakes, under 60 seconds</div>
        ) : (
          <div className="pass-banner">
            goal: no mistakes in under 60 seconds
            {result.errors > 0 && ` — ${result.errors} ${result.errors === 1 ? 'mistake' : 'mistakes'} this time`}
            {result.errors === 0 && result.seconds >= 60 && ' — clean run, just too slow'}
          </div>
        )}
        <div className="result-stats">
          <div className="result-stat">
            <div className="result-label">wpm</div>
            <div className="result-value">{result.wpm}</div>
          </div>
          <div className="result-stat">
            <div className="result-label">acc</div>
            <div className="result-value">{result.accuracy}%</div>
          </div>
          <div className="result-stat small">
            <div className="result-label">time</div>
            <div className="result-value">{result.seconds}s</div>
          </div>
          <div className="result-stat small">
            <div className="result-label">errors</div>
            <div className="result-value">{result.errors}</div>
          </div>
        </div>
        <div className="result-actions">
          <button onClick={restart}>next drill (tab)</button>
          <button onClick={onBack}>lesson list</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="test"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
    >
      <div className="test-header">
        <button className="back-btn" onClick={onBack}>
          ← lessons
        </button>
        <div className="test-title">
          <span className="lesson-num">{lesson.id}</span> {lesson.title}
          <span className="lesson-keys"> {lesson.subtitle}</span>
        </div>
        <div className="live-stats">
          <span>{liveStats.wpm} wpm</span>
          <span>{liveStats.acc}%</span>
        </div>
      </div>

      {capsOn && <div className="caps-warning">⛔ caps lock is on</div>}

      <div className="words">
        {test.chars.map((ch, i) => (
          <span key={i} className={`char ${test.states[i]}${i === test.pos ? ' current' : ''}`}>
            {i === test.pos && <span className="caret" ref={caretRef} />}
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </div>

      <div className="test-footer">
        <span className="hint">tab — restart with a new drill · click here if typing does nothing</span>
      </div>

      <Keyboard nextChar={nextChar} />
    </div>
  )
}
