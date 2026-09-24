import { useEffect, useState } from 'react'
import { lessons } from './data/lessons'
import type { Lesson } from './data/lessons'
import { TypingTest } from './components/TypingTest'
import type { TestResult } from './components/TypingTest'
import './App.css'

interface LessonBest {
  wpm: number
  accuracy: number
  passed?: boolean
}

type Progress = Record<number, LessonBest>

const STORAGE_KEY = 'monkeyseemonkeydo-progress'
const OLD_STORAGE_KEY = 'monkeytype-learn-progress'

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_STORAGE_KEY) ?? '{}'
    return JSON.parse(raw) as Progress
  } catch {
    return {}
  }
}

function lessonFromHash(): Lesson | null {
  const match = /^#lesson-(\d+)$/.exec(window.location.hash)
  if (!match) return null
  return lessons.find((l) => l.id === Number(match[1])) ?? null
}

export default function App() {
  const [active, setActiveState] = useState<Lesson | null>(lessonFromHash)
  const [progress, setProgress] = useState<Progress>(loadProgress)

  const setActive = (lesson: Lesson | null) => {
    setActiveState(lesson)
    window.history.pushState(null, '', lesson ? `#lesson-${lesson.id}` : window.location.pathname)
  }

  // Keep state in sync with browser back/forward
  useEffect(() => {
    const onPop = () => setActiveState(lessonFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // localStorage unavailable (private mode / quota) — progress just won't persist
    }
  }, [progress])

  const handleFinish = (result: TestResult) => {
    setProgress((p) => {
      const best = p[result.lessonId]
      const passed = (best?.passed ?? false) || result.passed
      if (best && best.wpm >= result.wpm && passed === best.passed) return p
      return {
        ...p,
        [result.lessonId]: {
          wpm: Math.max(best?.wpm ?? 0, result.wpm),
          accuracy: best && best.wpm >= result.wpm ? best.accuracy : result.accuracy,
          passed,
        },
      }
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => setActive(null)}>
          <span className="logo-mark">⌨</span> monkeysee<span className="logo-accent">monkeydo</span>
        </h1>
        <span className="layout-badge">svenskt tangentbord</span>
      </header>

      {active ? (
        <TypingTest key={active.id} lesson={active} onFinish={handleFinish} onBack={() => setActive(null)} />
      ) : (
        <main className="lesson-list">
          <p className="intro">
            Touch typing course for the Swedish keyboard — 15 lessons from home row to the entire
            keyboard. Keep your fingers on <strong>a s d f</strong> and <strong>j k l ö</strong>,
            and don't look down.
          </p>
          <div className="lessons">
            {lessons.map((lesson) => {
              const best = progress[lesson.id]
              return (
                <button
                  key={lesson.id}
                  className={`lesson-card${best?.passed ? ' passed' : ''}`}
                  onClick={() => setActive(lesson)}
                >
                  <span className="lesson-card-num">{best?.passed ? '✓' : lesson.id}</span>
                  <span className="lesson-card-body">
                    <span className="lesson-card-title">{lesson.title}</span>
                    <span className="lesson-card-keys">{lesson.subtitle}</span>
                  </span>
                  <span className="lesson-card-best">
                    {best ? (
                      <>
                        <span className="best-wpm">{best.wpm} wpm</span>
                        <span className="best-acc">{best.accuracy}%</span>
                      </>
                    ) : (
                      <span className="best-none">—</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </main>
      )}
    </div>
  )
}
