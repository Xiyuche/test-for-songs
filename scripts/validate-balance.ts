import { loadLocalContentPack } from './local-pack'
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

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const pack = loadLocalContentPack()
const { questions, tracks: songs } = pack

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
  let invalidResult: string | null = null

  songs.forEach((song) => counts.set(song.title, 0))

  for (let sample = 0; sample < scenario.size; sample += 1) {
    const answers = Array.from({ length: questions.length }, scenario.picker)
    const result = calculateQuizResult(pack, answers)

    const profileValues = Object.values(result.profile.dimensions)
    const numericValues = [
      result.primary.score,
      result.primary.probability,
      result.primary.resonance,
      result.stability,
      result.profile.lean,
      result.profile.cadence,
      result.profile.variation,
      ...profileValues,
      ...result.secondary.flatMap((match) => [
        match.score,
        match.probability,
        match.resonance,
      ]),
    ]

    if (
      numericValues.some((value) => !isFiniteNumber(value)) ||
      profileValues.some((value) => value < -1 || value > 1)
    ) {
      invalidResult = `Invalid numeric result in scenario ${scenario.name}, sample ${sample}`
      break
    }

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
    invalidResult,
  }
}

const verifySyntheticReachability = () =>
  songs.map((song) => {
    const answers = syntheticAnswersForSong(pack, song)
    const result = calculateQuizResult(pack, answers)
    const profileValues = Object.values(result.profile.dimensions)
    return {
      expected: song.title,
      actual: result.primary.song.title,
      ok: result.primary.song.id === song.id,
      numbersOk:
        [
          result.primary.score,
          result.primary.probability,
          result.primary.resonance,
          result.stability,
          result.profile.lean,
          result.profile.cadence,
          result.profile.variation,
          ...profileValues,
        ].every((value) => isFiniteNumber(value)) &&
        profileValues.every((value) => value >= -1 && value <= 1),
    }
  })

const buildAggregateCoverage = (reports: ReturnType<typeof simulate>[]) => {
  const counts = new Map<string, number>()

  songs.forEach((song) => counts.set(song.title, 0))

  reports.forEach((report) => {
    report.rows.forEach((row) => {
      counts.set(row.title, (counts.get(row.title) ?? 0) + row.count)
    })
  })

  const totalSamples = reports.reduce((sum, report) => {
    return sum + report.rows.reduce((rowSum, row) => rowSum + row.count, 0)
  }, 0)

  return [...counts.entries()]
    .map(([title, count]) => ({
      title,
      count,
      share: Number(((count / totalSamples) * 100).toFixed(2)),
    }))
    .sort((left, right) => right.count - left.count)
}

const singleNotePatterns = [0, 1, 2, 3, 4].map((answer) => {
  const pattern = Array.from({ length: questions.length }, () => answer as AnswerValue)
  const result = calculateQuizResult(pack, pattern)

  return {
    answer: answer + 1,
    song: result.primary.song.title,
    resonance: result.primary.resonance,
    stability: result.stability,
  }
})

console.log('\nBalance simulations:\n')

const reports = scenarios.map(simulate)
const syntheticReachability = verifySyntheticReachability()
const aggregateCoverage = buildAggregateCoverage(reports)

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
syntheticReachability.forEach((item) => {
  console.log(
    `  ${item.expected} -> ${item.actual} ${item.ok ? 'OK' : 'MISMATCH'} ${item.numbersOk ? '' : 'INVALID-NUMBERS'}`.trim(),
  )
})

console.log('\nAggregate coverage:')
aggregateCoverage.forEach((row) => {
  console.log(`  ${row.title.padEnd(18)} ${String(row.share).padStart(5)}%`)
})

console.log('\nSingle-note answer patterns:')
singleNotePatterns.forEach((item) => {
  console.log(
    `  全选 ${item.answer} -> ${item.song} | 共振 ${item.resonance}% | 稳定 ${item.stability}%`,
  )
})

const dominantLimit = 26
const failedScenario = reports.find(
  (report) => report.dominantShare > dominantLimit || report.invalidResult,
)
const failedSynthetic = syntheticReachability.find((item) => !item.ok || !item.numbersOk)
const zeroCoverageTrack = aggregateCoverage.find((row) => row.count === 0)

if (failedScenario || failedSynthetic || zeroCoverageTrack) {
  if (failedScenario?.invalidResult) {
    console.error(failedScenario.invalidResult)
  }
  console.error('\nBalance validation failed.')
  process.exit(1)
}

console.log('\nBalance validation passed.\n')
