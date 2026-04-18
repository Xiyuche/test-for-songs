import type { ContentPack, PackDimension, PackTrack } from '../content/schema'

export type AnswerValue = 0 | 1 | 2 | 3 | 4
export type DimensionId = string
export type QuizDataset = Pick<ContentPack, 'dimensions' | 'questions' | 'tracks' | 'ui'>

export type UserProfile = {
  dimensions: Record<DimensionId, number>
  lean: number
  cadence: number
  variation: number
}

export type MatchResult = {
  song: PackTrack
  score: number
  probability: number
  resonance: number
  reasons: string[]
}

export type QuizResult = {
  profile: UserProfile
  primary: MatchResult
  secondary: MatchResult[]
  stability: number
  summary: string
  footerNote: string
}

type RankedSong = {
  song: PackTrack
  score: number
}

type TargetSearchResult = {
  answers: AnswerValue[]
  margin: number
  targetScore: number
}

const centeredScale = [-1, -0.5, 0, 0.5, 1] as const

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round = (value: number) => Math.round(value * 100) / 100

const average = (values: number[]) =>
  values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length

const standardDeviation = (values: number[]) => {
  if (values.length === 0) {
    return 0
  }

  const mean = average(values)
  const variance = average(values.map((value) => (value - mean) ** 2))
  return Math.sqrt(variance)
}

const getDimensionLookup = (dimensions: PackDimension[]) =>
  Object.fromEntries(dimensions.map((dimension) => [dimension.id, dimension])) as Record<
    DimensionId,
    PackDimension
  >

const directionText = (
  dimensionLookup: Record<DimensionId, PackDimension>,
  dimensionId: DimensionId,
  score: number,
) => {
  const dimension = dimensionLookup[dimensionId]
  const towardPositive = score >= 0
  const magnitude = Math.abs(score)

  const label = towardPositive
    ? dimension.positiveLabel
    : dimension.negativeLabel
  const hint = towardPositive ? dimension.positiveHint : dimension.negativeHint

  if (magnitude > 0.66) {
    return `${label}很明确：${hint}`
  }

  if (magnitude > 0.3) {
    return `${label}略占上风：${hint}`
  }

  return `${dimension.positiveLabel}与${dimension.negativeLabel}之间保持游移`
}

export const getUserProfile = (dataset: QuizDataset, answers: AnswerValue[]): UserProfile => {
  const sums = Object.fromEntries(
    dataset.dimensions.map((dimension) => [dimension.id, 0]),
  ) as Record<DimensionId, number>

  const counts = Object.fromEntries(
    dataset.dimensions.map((dimension) => [dimension.id, 0]),
  ) as Record<DimensionId, number>

  const rawValues: number[] = []

  answers.forEach((answer, index) => {
    const question = dataset.questions[index]
    const centeredValue = centeredScale[answer]
    rawValues.push(centeredValue)
    sums[question.dimension] += centeredValue * question.direction
    counts[question.dimension] += 1
  })

  const dimensionValues = Object.fromEntries(
    dataset.dimensions.map((dimension) => [
      dimension.id,
      round(sums[dimension.id] / Math.max(counts[dimension.id], 1)),
    ]),
  ) as Record<DimensionId, number>

  return {
    dimensions: dimensionValues,
    lean: round(average(rawValues)),
    cadence: round(average(rawValues.map((value) => Math.abs(value)))),
    variation: round(standardDeviation(rawValues)),
  }
}

const getTraitDistance = (
  dataset: QuizDataset,
  profile: UserProfile,
  song: PackTrack,
): number => {
  const diffSquares = dataset.dimensions.map((dimension) => {
    const diff = profile.dimensions[dimension.id] - song.vector[dimension.id]
    return diff ** 2
  })

  const maxDistance = Math.sqrt(dataset.dimensions.length * 4)
  return Math.sqrt(diffSquares.reduce((sum, value) => sum + value, 0)) / maxDistance
}

const getStyleDistance = (
  profile: UserProfile,
  song: PackTrack,
): number => {
  const leanDistance = Math.abs(profile.lean - song.answerStyle.lean) / 2
  const cadenceDistance = Math.abs(profile.cadence - song.answerStyle.cadence)

  return clamp(leanDistance * 0.42 + cadenceDistance * 0.58, 0, 1)
}

const getAffinityScore = (
  dataset: QuizDataset,
  profile: UserProfile,
  song: PackTrack,
): number => {
  const pivotScore =
    profile.dimensions[song.pivot.dimension] * song.pivot.pole
  const dominance = Math.abs(profile.dimensions[song.pivot.dimension])
  const traitDistance = getTraitDistance(dataset, profile, song)
  const styleDistance = getStyleDistance(profile, song)
  const traitSimilarity = 1 - traitDistance
  const styleSimilarity = 1 - styleDistance
  const axisEnergy = average(
    dataset.dimensions.map((dimension) => Math.abs(profile.dimensions[dimension.id])),
  )
  const ambiguity = 1 - axisEnergy

  return round(
    pivotScore * (0.54 + axisEnergy * 0.1) +
      dominance * 0.22 +
      (traitSimilarity - 0.5) * (0.08 + ambiguity * 0.04) +
      (styleSimilarity - 0.5) * (0.12 + ambiguity * 0.14),
  )
}

const rankSongsForProfile = (
  dataset: QuizDataset,
  profile: UserProfile,
): RankedSong[] =>
  dataset.tracks
    .map((song) => ({
      song,
      score: getAffinityScore(dataset, profile, song),
    }))
    .sort((left, right) => right.score - left.score)

const getReasons = (
  dataset: QuizDataset,
  profile: UserProfile,
  song: PackTrack,
): string[] => {
  const dimensionLookup = getDimensionLookup(dataset.dimensions)

  return dataset.dimensions
    .map((dimension) => {
      const userValue = profile.dimensions[dimension.id]
      const songValue = song.vector[dimension.id]
      const alignment = 1 - Math.abs(userValue - songValue) / 2

      const anchor =
        songValue >= 0 ? dimension.positiveLabel : dimension.negativeLabel

      return {
        alignment:
          dimension.id === song.pivot.dimension ? alignment + 0.35 : alignment,
        text: `${dimension.name}偏向 ${anchor}：${directionText(
          dimensionLookup,
          dimension.id,
          userValue,
        )}`,
      }
    })
    .sort((left, right) => right.alignment - left.alignment)
    .slice(0, 3)
    .map((item) => item.text)
}

const getSummary = (
  dataset: QuizDataset,
  profile: UserProfile,
  song: PackTrack,
): string => {
  const dimensionLookup = getDimensionLookup(dataset.dimensions)
  const dominantDimensions = [...dataset.dimensions]
    .sort(
      (left, right) =>
        Math.abs(profile.dimensions[right.id]) - Math.abs(profile.dimensions[left.id]),
    )
    .slice(0, 2)

  const first = directionText(
    dimensionLookup,
    dominantDimensions[0].id,
    profile.dimensions[dominantDimensions[0].id],
  )
  const second = directionText(
    dimensionLookup,
    dominantDimensions[1].id,
    profile.dimensions[dominantDimensions[1].id],
  )

  return `最近的你更像是 ${first}，同时也 ${second}。这会把你推向 ${song.title} 这种“${song.epithet}”的频率。`
}

export const calculateQuizResult = (
  dataset: QuizDataset,
  answers: AnswerValue[],
): QuizResult => {
  const profile = getUserProfile(dataset, answers)
  const rawMatches = rankSongsForProfile(dataset, profile)

  const temperature = 5.2
  const weights = rawMatches.map((match) => Math.exp(match.score * temperature))
  const totalWeight = weights.reduce((sum, value) => sum + value, 0)

  const rankedMatches = rawMatches
    .map((match, index) => {
      const probability = weights[index] / totalWeight
      return {
        ...match,
        probability,
        resonance: Math.round(
          clamp(54 + probability * 175 + Math.max(match.score, 0) * 20, 50, 97),
        ),
        reasons: getReasons(dataset, profile, match.song),
      }
    })
    .sort((left, right) => right.score - left.score)

  const [primary, ...secondary] = rankedMatches
  const gap = primary.score - secondary[0].score
  const energy = average(
    dataset.dimensions.map((dimension) => Math.abs(profile.dimensions[dimension.id])),
  )
  const stability = Math.round(
    clamp(54 + gap * 150 + profile.cadence * 18 + energy * 16, 52, 96),
  )
  const footerNote =
    stability >= 70
      ? dataset.ui.result.footerStable
      : dataset.ui.result.footerFluid

  return {
    profile,
    primary,
    secondary: secondary.slice(0, 2),
    stability,
    summary: getSummary(dataset, profile, primary.song),
    footerNote,
  }
}

const projectAnswersForSong = (
  dataset: QuizDataset,
  song: PackTrack,
): AnswerValue[] =>
  dataset.questions.map((question) => {
    const target = song.vector[question.dimension] * question.direction
    const projected = clamp(Math.round(target * 2) + 2, 0, 4)
    return projected as AnswerValue
  })

const createSeededRng = (seedText: string) => {
  let seed = 0

  for (const character of seedText) {
    seed = (seed * 31 + character.charCodeAt(0)) >>> 0
  }

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0x100000000
  }
}

const evaluateSongTarget = (
  dataset: QuizDataset,
  song: PackTrack,
  answers: AnswerValue[],
): TargetSearchResult => {
  const rankedSongs = rankSongsForProfile(dataset, getUserProfile(dataset, answers))
  const targetEntry = rankedSongs.find((entry) => entry.song.id === song.id)

  if (!targetEntry) {
    return {
      answers,
      margin: Number.NEGATIVE_INFINITY,
      targetScore: Number.NEGATIVE_INFINITY,
    }
  }

  const bestOtherScore =
    rankedSongs.find((entry) => entry.song.id !== song.id)?.score ?? Number.NEGATIVE_INFINITY

  return {
    answers,
    margin: targetEntry.score - bestOtherScore,
    targetScore: targetEntry.score,
  }
}

const isBetterTargetResult = (
  candidate: TargetSearchResult,
  current: TargetSearchResult,
) => {
  if (candidate.margin > current.margin + 0.0001) {
    return true
  }

  if (Math.abs(candidate.margin - current.margin) <= 0.0001) {
    return candidate.targetScore > current.targetScore + 0.0001
  }

  return false
}

const climbTowardSong = (
  dataset: QuizDataset,
  song: PackTrack,
  seed: AnswerValue[],
): TargetSearchResult => {
  let best = evaluateSongTarget(dataset, song, seed)
  let improved = true
  let passes = 0

  while (improved && passes < 18 && best.margin < 0) {
    improved = false
    passes += 1

    for (let index = 0; index < seed.length; index += 1) {
      for (let value = 0; value < 5; value += 1) {
        if (value === best.answers[index]) {
          continue
        }

        const candidateAnswers = [...best.answers]
        candidateAnswers[index] = value as AnswerValue
        const candidate = evaluateSongTarget(dataset, song, candidateAnswers)

        if (isBetterTargetResult(candidate, best)) {
          best = candidate
          improved = true
        }
      }
    }
  }

  return best
}

export const syntheticAnswersForSong = (
  dataset: QuizDataset,
  song: PackTrack,
): AnswerValue[] => {
  const seededRandom = createSeededRng(song.id)
  const seeds: AnswerValue[][] = [
    projectAnswersForSong(dataset, song),
    ...(Array.from({ length: 5 }, (_, value) =>
      Array.from({ length: dataset.questions.length }, () => value as AnswerValue),
    ) as AnswerValue[][]),
  ]

  for (let sample = 0; sample < 24; sample += 1) {
    seeds.push(
      Array.from({ length: dataset.questions.length }, () =>
        Math.floor(seededRandom() * 5),
      ) as AnswerValue[],
    )
  }

  const best = seeds.reduce<TargetSearchResult>((currentBest, seed) => {
    const candidate = climbTowardSong(dataset, song, seed)
    return isBetterTargetResult(candidate, currentBest) ? candidate : currentBest
  }, evaluateSongTarget(dataset, song, projectAnswersForSong(dataset, song)))

  return best.answers
}
