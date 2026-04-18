import { questions, songs } from '../src/data/quiz'
import {
  calculateQuizResult,
  syntheticAnswersForSong,
  type AnswerValue,
} from '../src/lib/quiz-engine'

type Scenario = {
  name: string
  size: number
  picker: () => AnswerValue
}

const weightedPick = (weights: number[]): AnswerValue => {
  const target = Math.random()
  let cursor = 0

  for (let index = 0; index < weights.length; index += 1) {
    cursor += weights[index]
    if (target <= cursor) {
      return index as AnswerValue
    }
  }

  return 4
}

const scenarios: Scenario[] = [
  {
    name: 'uniform-random',
    size: 20000,
    picker: () => weightedPick([0.2, 0.2, 0.2, 0.2, 0.2]),
  },
  {
    name: 'agree-skewed',
    size: 20000,
    picker: () => weightedPick([0.06, 0.12, 0.16, 0.28, 0.38]),
  },
  {
    name: 'disagree-skewed',
    size: 20000,
    picker: () => weightedPick([0.38, 0.28, 0.16, 0.12, 0.06]),
  },
  {
    name: 'midpoint-skewed',
    size: 20000,
    picker: () => weightedPick([0.1, 0.18, 0.44, 0.18, 0.1]),
  },
  {
    name: 'extreme-zigzag',
    size: 20000,
    picker: () => weightedPick([0.33, 0.08, 0.18, 0.08, 0.33]),
  },
]

const simulate = (scenario: Scenario) => {
  const counts = new Map<string, number>()

  songs.forEach((song) => counts.set(song.title, 0))

  for (let sample = 0; sample < scenario.size; sample += 1) {
    const answers = Array.from({ length: questions.length }, scenario.picker)
    const result = calculateQuizResult(answers)
    counts.set(
      result.primary.song.title,
      (counts.get(result.primary.song.title) ?? 0) + 1,
    )
  }

  const rows = [...counts.entries()]
    .map(([title, count]) => ({
      title,
      count,
      share: Number(((count / scenario.size) * 100).toFixed(2)),
    }))
    .sort((left, right) => right.count - left.count)

  return {
    scenario: scenario.name,
    rows,
    dominantShare: rows[0].share,
    weakestShare: rows.at(-1)?.share ?? 0,
  }
}

const verifySyntheticReachability = () =>
  songs.map((song) => {
    const answers = syntheticAnswersForSong(song)
    const result = calculateQuizResult(answers)
    return {
      expected: song.title,
      actual: result.primary.song.title,
      ok: result.primary.song.id === song.id,
    }
  })

const singleNotePatterns = [0, 1, 2, 3, 4].map((answer) => {
  const pattern = Array.from({ length: questions.length }, () => answer as AnswerValue)
  const result = calculateQuizResult(pattern)

  return {
    answer: answer + 1,
    song: result.primary.song.title,
    resonance: result.primary.resonance,
    stability: result.stability,
  }
})

console.log('\nBalance simulations:\n')

const reports = scenarios.map(simulate)

reports.forEach((report) => {
  console.log(`Scenario: ${report.scenario}`)
  report.rows.slice(0, 5).forEach((row) => {
    console.log(`  ${row.title.padEnd(18)} ${String(row.share).padStart(5)}%`)
  })
  console.log(
    `  Dominant share: ${report.dominantShare}% | Weakest share: ${report.weakestShare}%\n`,
  )
})

console.log('Synthetic reachability:')
verifySyntheticReachability().forEach((item) => {
  console.log(`  ${item.expected} -> ${item.actual} ${item.ok ? 'OK' : 'MISMATCH'}`)
})

console.log('\nSingle-note answer patterns:')
singleNotePatterns.forEach((item) => {
  console.log(
    `  全选 ${item.answer} -> ${item.song} | 共振 ${item.resonance}% | 稳定 ${item.stability}%`,
  )
})

const dominantLimit = 26
const weakestLimit = 4
const failedScenario = reports.find(
  (report) => report.dominantShare > dominantLimit || report.weakestShare < weakestLimit,
)
const failedSynthetic = verifySyntheticReachability().find((item) => !item.ok)

if (failedScenario || failedSynthetic) {
  console.error('\nBalance validation failed.')
  process.exit(1)
}

console.log('\nBalance validation passed.\n')
