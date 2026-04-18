import { dimensions, questions, songs, type DimensionId, type SongProfile } from '../data/quiz'

export type AnswerValue = 0 | 1 | 2 | 3 | 4

export type UserProfile = {
  dimensions: Record<DimensionId, number>
  lean: number
  cadence: number
  variation: number
}

export type MatchResult = {
  song: SongProfile
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

const dimensionLookup = Object.fromEntries(
  dimensions.map((dimension) => [dimension.id, dimension]),
) as Record<DimensionId, (typeof dimensions)[number]>

const directionText = (dimensionId: DimensionId, score: number) => {
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

export const getUserProfile = (answers: AnswerValue[]): UserProfile => {
  const sums = {
    spark: 0,
    distance: 0,
    focus: 0,
    stance: 0,
    recovery: 0,
  } satisfies Record<DimensionId, number>

  const counts = {
    spark: 0,
    distance: 0,
    focus: 0,
    stance: 0,
    recovery: 0,
  } satisfies Record<DimensionId, number>

  const rawValues: number[] = []

  answers.forEach((answer, index) => {
    const question = questions[index]
    const centeredValue = centeredScale[answer]
    rawValues.push(centeredValue)
    sums[question.dimension] += centeredValue * question.direction
    counts[question.dimension] += 1
  })

  const dimensionValues = Object.fromEntries(
    dimensions.map((dimension) => [
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
  profile: UserProfile,
  song: SongProfile,
): number => {
  const diffSquares = dimensions.map((dimension) => {
    const diff = profile.dimensions[dimension.id] - song.vector[dimension.id]
    return diff ** 2
  })

  const maxDistance = Math.sqrt(dimensions.length * 4)
  return Math.sqrt(diffSquares.reduce((sum, value) => sum + value, 0)) / maxDistance
}

const getStyleDistance = (
  profile: UserProfile,
  song: SongProfile,
): number => {
  const leanDistance = Math.abs(profile.lean - song.answerStyle.lean) / 2
  const cadenceDistance = Math.abs(profile.cadence - song.answerStyle.cadence)

  return clamp(leanDistance * 0.42 + cadenceDistance * 0.58, 0, 1)
}

const getAffinityScore = (
  profile: UserProfile,
  song: SongProfile,
): number => {
  const pivotScore =
    profile.dimensions[song.pivot.dimension] * song.pivot.pole
  const dominance = Math.abs(profile.dimensions[song.pivot.dimension])
  const traitDistance = getTraitDistance(profile, song)
  const styleDistance = getStyleDistance(profile, song)
  const traitSimilarity = 1 - traitDistance
  const styleSimilarity = 1 - styleDistance
  const axisEnergy = average(
    dimensions.map((dimension) => Math.abs(profile.dimensions[dimension.id])),
  )
  const ambiguity = 1 - axisEnergy

  return round(
    pivotScore * (0.54 + axisEnergy * 0.1) +
      dominance * 0.22 +
      (traitSimilarity - 0.5) * (0.08 + ambiguity * 0.04) +
      (styleSimilarity - 0.5) * (0.12 + ambiguity * 0.14),
  )
}

const getReasons = (
  profile: UserProfile,
  song: SongProfile,
): string[] =>
  dimensions
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
          dimension.id,
          userValue,
        )}`,
      }
    })
    .sort((left, right) => right.alignment - left.alignment)
    .slice(0, 3)
    .map((item) => item.text)

const getSummary = (
  profile: UserProfile,
  song: SongProfile,
): string => {
  const dominantDimensions = [...dimensions]
    .sort(
      (left, right) =>
        Math.abs(profile.dimensions[right.id]) - Math.abs(profile.dimensions[left.id]),
    )
    .slice(0, 2)

  const first = directionText(dominantDimensions[0].id, profile.dimensions[dominantDimensions[0].id])
  const second = directionText(dominantDimensions[1].id, profile.dimensions[dominantDimensions[1].id])

  return `最近的你更像是 ${first}，同时也 ${second}。这会把你推向 ${song.title} 这种“${song.epithet}”的频率。`
}

export const calculateQuizResult = (answers: AnswerValue[]): QuizResult => {
  const profile = getUserProfile(answers)

  const rawMatches = songs.map((song) => ({
    song,
    score: getAffinityScore(profile, song),
  }))

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
        reasons: getReasons(profile, match.song),
      }
    })
    .sort((left, right) => right.score - left.score)

  const [primary, ...secondary] = rankedMatches
  const gap = primary.score - secondary[0].score
  const energy = average(
    dimensions.map((dimension) => Math.abs(profile.dimensions[dimension.id])),
  )
  const stability = Math.round(
    clamp(54 + gap * 150 + profile.cadence * 18 + energy * 16, 52, 96),
  )
  const footerNote =
    stability >= 70
      ? '这次的命中度比较集中，说明你的近期状态已经明显偏向某种歌词气候。'
      : '这次结果更像多首歌的交界地带，说明你现在的状态还在流动中，重测也许会命中另一首。'

  return {
    profile,
    primary,
    secondary: secondary.slice(0, 2),
    stability,
    summary: getSummary(profile, primary.song),
    footerNote,
  }
}

export const syntheticAnswersForSong = (song: SongProfile): AnswerValue[] =>
  questions.map((question) => {
    const target = song.vector[question.dimension] * question.direction
    const projected = clamp(Math.round(target * 2) + 2, 0, 4)
    return projected as AnswerValue
  })
