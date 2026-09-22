// Pro touch-typing course (15 lessons), adapted for the Swedish (sv-SE) keyboard.
// Modeled on typingme.com's pro lessons: each lesson introduces new keys and
// mixes in keys from earlier lessons.

export interface Lesson {
  id: number
  title: string
  subtitle: string
  /** Keys introduced in this lesson */
  newChars: string[]
  /** Keys from earlier lessons mixed into the drill */
  reviewChars: string[]
  /** Randomly capitalize letters (shift practice) */
  useShift: boolean
  /** Mix in real Swedish words built from unlocked letters */
  useWords: boolean
}

const HOME_LEFT = ['a', 's', 'd', 'f']
const HOME_RIGHT = ['j', 'k', 'l', 'ö']
const HOME_ALL = [...HOME_LEFT, ...HOME_RIGHT]
const GH = ['g', 'h']
const AE = ['ä']
const TOP_LEFT = ['q', 'w', 'e', 'r', 't']
const TOP_RIGHT = ['y', 'u', 'i', 'o', 'p', 'å']
const BOTTOM_LEFT = ['z', 'x', 'c', 'v', 'b']
const BOTTOM_RIGHT = ['n', 'm', ',', '.', '-']
const NUM_LEFT = ['1', '2', '3', '4', '5']
const NUM_RIGHT = ['6', '7', '8', '9', '0']
const NUM_SYMBOLS = ['!', '"', '#', '%', '&', '/', '(', ')', '=', '?', '+']
const REST_SYMBOLS = ['@', '$', '{', '[', ']', '}', '\\', '<', '>', '*', ';', ':', '_']

const ALL_LETTERS = [...HOME_ALL, ...GH, ...AE, ...TOP_LEFT, ...TOP_RIGHT, ...BOTTOM_LEFT, 'n', 'm']

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Left hand — home row',
    subtitle: 'a s d f',
    newChars: HOME_LEFT,
    reviewChars: [],
    useShift: false,
    useWords: false,
  },
  {
    id: 2,
    title: 'Right hand — home row',
    subtitle: 'j k l ö',
    newChars: HOME_RIGHT,
    reviewChars: [],
    useShift: false,
    useWords: false,
  },
  {
    id: 3,
    title: 'Both hands — home row',
    subtitle: 'a s d f j k l ö',
    newChars: HOME_ALL,
    reviewChars: [],
    useShift: false,
    useWords: false,
  },
  {
    id: 4,
    title: 'G and H keys',
    subtitle: 'g h',
    newChars: GH,
    reviewChars: HOME_ALL,
    useShift: false,
    useWords: true,
  },
  {
    id: 5,
    title: 'Ä key',
    subtitle: 'ä (right pinky)',
    newChars: AE,
    reviewChars: [...HOME_ALL, ...GH],
    useShift: false,
    useWords: true,
  },
  {
    id: 6,
    title: 'Shift keys',
    subtitle: 'Capital letters',
    newChars: [...HOME_ALL, ...GH, ...AE],
    reviewChars: [],
    useShift: true,
    useWords: true,
  },
  {
    id: 7,
    title: 'Top row — left hand',
    subtitle: 'q w e r t',
    newChars: TOP_LEFT,
    reviewChars: [...HOME_ALL, ...GH, ...AE],
    useShift: true,
    useWords: true,
  },
  {
    id: 8,
    title: 'Top row — right hand',
    subtitle: 'y u i o p å',
    newChars: TOP_RIGHT,
    reviewChars: [...HOME_ALL, ...GH, ...AE, ...TOP_LEFT],
    useShift: true,
    useWords: true,
  },
  {
    id: 9,
    title: 'Bottom row — left hand',
    subtitle: 'z x c v b',
    newChars: BOTTOM_LEFT,
    reviewChars: [...HOME_ALL, ...GH, ...AE, ...TOP_LEFT, ...TOP_RIGHT],
    useShift: true,
    useWords: true,
  },
  {
    id: 10,
    title: 'Bottom row — right hand',
    subtitle: 'n m , . -',
    newChars: BOTTOM_RIGHT,
    reviewChars: [...HOME_ALL, ...GH, ...AE, ...TOP_LEFT, ...TOP_RIGHT, ...BOTTOM_LEFT],
    useShift: true,
    useWords: true,
  },
  {
    id: 11,
    title: 'Number row — left hand',
    subtitle: '1 2 3 4 5',
    newChars: NUM_LEFT,
    reviewChars: ALL_LETTERS,
    useShift: false,
    useWords: true,
  },
  {
    id: 12,
    title: 'Number row — right hand',
    subtitle: '6 7 8 9 0',
    newChars: NUM_RIGHT,
    reviewChars: [...NUM_LEFT, ...ALL_LETTERS],
    useShift: false,
    useWords: true,
  },
  {
    id: 13,
    title: 'Number row symbols',
    subtitle: '! " # % & / ( ) = ? +',
    newChars: NUM_SYMBOLS,
    reviewChars: [...NUM_LEFT, ...NUM_RIGHT, ...ALL_LETTERS],
    useShift: false,
    useWords: true,
  },
  {
    id: 14,
    title: 'Remaining symbols',
    subtitle: '@ $ { [ ] } \\ < > * ; : _',
    newChars: REST_SYMBOLS,
    reviewChars: [...NUM_SYMBOLS, ...ALL_LETTERS],
    useShift: false,
    useWords: true,
  },
  {
    id: 15,
    title: 'Entire keyboard',
    subtitle: 'Everything mixed',
    newChars: [...ALL_LETTERS, ...BOTTOM_RIGHT.slice(2), ...NUM_LEFT, ...NUM_RIGHT, ...NUM_SYMBOLS, ...REST_SYMBOLS],
    reviewChars: [],
    useShift: true,
    useWords: true,
  },
]

// Common Swedish words, used once a lesson has unlocked their letters.
const SWEDISH_WORDS = [
  'och', 'att', 'det', 'som', 'en', 'på', 'är', 'av', 'för', 'med',
  'till', 'den', 'har', 'de', 'inte', 'om', 'ett', 'han', 'men', 'var',
  'jag', 'sig', 'från', 'vi', 'så', 'kan', 'när', 'år', 'säger', 'hon',
  'under', 'också', 'efter', 'eller', 'nu', 'sin', 'där', 'vid', 'mot', 'ska',
  'skulle', 'kommer', 'ut', 'får', 'finns', 'vara', 'hade', 'alla', 'andra', 'mycket',
  'än', 'här', 'då', 'sedan', 'över', 'bara', 'in', 'blir', 'upp', 'även',
  'vad', 'få', 'två', 'vill', 'ha', 'många', 'hur', 'mer', 'går', 'dag',
  'blev', 'fick', 'man', 'utan', 'sina', 'dess', 'lite', 'bra', 'först', 'går',
  'hela', 'annat', 'inom', 'del', 'stora', 'egen', 'samma', 'nya', 'redan', 'genom',
  'sätt', 'gör', 'allt', 'tid', 'stor', 'olika', 'själv', 'igen', 'kanske', 'gick',
  'ligger', 'bland', 'både', 'liv', 'barn', 'gånger', 'utan', 'folk', 'ner', 'ge',
  'gälla', 'god', 'gås', 'haka', 'hall', 'fall', 'kalla', 'lag', 'dag', 'glad',
  'saga', 'skada', 'lås', 'gata', 'hög', 'lögn', 'känd', 'händer', 'lägga', 'säga',
  'väg', 'näsa', 'läsa', 'åka', 'ö', 'sjö', 'snö', 'kö', 'mjölk', 'björn',
  'fjäll', 'kväll', 'häst', 'bäst', 'näst', 'väl', 'mål', 'båt', 'råd', 'stål',
  'as', 'sal', 'fas', 'lass', 'kal', 'fald', 'aska', 'flaska', 'klass', 'skall',
  'skog', 'stad', 'land', 'hand', 'vatten', 'huvud', 'öga', 'öra', 'fot', 'ben',
  'hus', 'bil', 'tåg', 'buss', 'bok', 'ord', 'namn', 'text', 'siffra', 'tal',
]

function lessonAlphabet(lesson: Lesson): Set<string> {
  return new Set([...lesson.newChars, ...lesson.reviewChars].map((c) => c.toLowerCase()))
}

function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Random drill "word": a group of 2–5 characters, weighted toward new keys. */
function randomGroup(lesson: Lesson): string {
  const len = 2 + Math.floor(Math.random() * 4)
  let out = ''
  for (let i = 0; i < len; i++) {
    const useNew = lesson.reviewChars.length === 0 || Math.random() < 0.6
    let ch = useNew ? randomOf(lesson.newChars) : randomOf(lesson.reviewChars)
    if (lesson.useShift && /[a-zåäö]/.test(ch) && Math.random() < 0.2) {
      ch = ch.toUpperCase()
    }
    out += ch
  }
  return out
}

export function generateDrill(lesson: Lesson, wordCount = 40): string[] {
  const alphabet = lessonAlphabet(lesson)
  const realWords = lesson.useWords
    ? SWEDISH_WORDS.filter((w) => [...w].every((c) => alphabet.has(c)))
    : []

  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    if (realWords.length >= 8 && Math.random() < 0.5) {
      let w = randomOf(realWords)
      if (lesson.useShift && Math.random() < 0.15) {
        w = w[0].toUpperCase() + w.slice(1)
      }
      words.push(w)
    } else {
      words.push(randomGroup(lesson))
    }
  }
  return words
}
