import { parse } from 'yaml'

type UnknownRecord = Record<string, unknown>

export type PackLink = {
  label: string
  url: string
  note?: string
}

export type PackCommentEvidence = {
  platform: string
  url: string
  likes?: number
  excerpt: string
  summary: string
}

export type PackDimension = {
  id: string
  name: string
  shortName: string
  description: string
  positiveLabel: string
  negativeLabel: string
  positiveHint: string
  negativeHint: string
}

export type PackQuestion = {
  id: number
  dimension: string
  direction: 1 | -1
  prompt: string
}

export type PackPalette = {
  accent: string
  surface: string
  glow: string
}

export type PackTrack = {
  id: string
  title: string
  romanized: string
  epithet: string
  summary: string
  scene: string
  gift: string
  shadow: string
  ritual: string
  tags: string[]
  keywords: string[]
  palette: PackPalette
  pivot: {
    dimension: string
    pole: 1 | -1
  }
  vector: Record<string, number>
  answerStyle: {
    lean: number
    cadence: number
  }
  platforms: {
    appleMusic?: PackLink
    netease?: PackLink
  }
  sources: {
    ranking: string
    lyrics: string
  }
  evidence: {
    canonicalRanking: {
      platform: string
      storefront?: string
      artistUrl: string
      snapshotDate: string
      rank: number
      releaseLine: string
      note: string
    }
    supportingRankings: PackLink[]
    lyrics: {
      primary: PackLink
      alternates: PackLink[]
      note: string
    }
    interpretation: {
      official: PackLink[]
      community: PackLink[]
      comments: PackCommentEvidence[]
      consensus: string[]
    }
    modelingNotes: string[]
  }
}

export type PackSourceCard = {
  title: string
  body: string
  links: PackLink[]
}

export type PackUi = {
  hero: {
    eyebrow: string
    title: string
    lead: string
    primaryCta: string
    secondaryCta: string
    stats: string[]
  }
  strips: Array<{
    title: string
    body: string
  }>
  process: {
    eyebrow: string
    title: string
    steps: Array<{
      title: string
      body: string
    }>
  }
  atlas: {
    eyebrow: string
    title: string
  }
  sources: {
    eyebrow: string
    title: string
    cards: PackSourceCard[]
  }
  quiz: {
    title: string
    resetLabel: string
    progressLabel: string
    progressHint: string
    keyboardHint: string
    footerHint: string
    backLabel: string
  }
  result: {
    posterLabel: string
    resonanceLabel: string
    analysisEyebrow: string
    stabilityLabel: string
    secondMatchLabel: string
    thirdMatchLabel: string
    retakeLabel: string
    sourceLabel: string
    radarEyebrow: string
    radarTitle: string
    whyEyebrow: string
    sceneTitle: string
    giftTitle: string
    shadowTitle: string
    ritualTitle: string
    topMatchesEyebrow: string
    topMatchesTitle: string
    footerStable: string
    footerFluid: string
  }
}

export type PackVoiceGuide = {
  referenceTone: string
  styleNotes: string[]
  avoid: string[]
}

export type PackLyricPolicy = {
  storeFullLyrics: boolean
  allowedStorage: string[]
  note: string
}

export type PackEditableText = {
  packTitle: string
  packSubtitle: string
  resultPrefix: string
  resultSuffix: string
  rankingBadge: string
  sourceBadge: string
  lyricBadge: string
}

export type ContentPack = {
  id: string
  version: string
  artist: {
    key: string
    displayName: string
    shortName: string
    title: string
    subtitle: string
    description: string
  }
  rankingDecision: {
    canonicalPlatform: string
    storefront?: string
    artistUrl: string
    snapshotDate: string
    rationale: string
    caveats: string[]
    supportingPlatforms: PackLink[]
  }
  lyricPolicy: PackLyricPolicy
  editableText: PackEditableText
  voiceGuide: PackVoiceGuide
  likertLabels: string[]
  dimensions: PackDimension[]
  questions: PackQuestion[]
  tracks: PackTrack[]
  ui: PackUi
}

const assertObject = (value: unknown, path: string): UnknownRecord => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`)
  }

  return value as UnknownRecord
}

const assertString = (value: unknown, path: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string`)
  }

  return value
}

const assertOptionalString = (value: unknown, path: string): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  return assertString(value, path)
}

const assertNumber = (value: unknown, path: string): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${path} must be a number`)
  }

  return value
}

const assertInteger = (value: unknown, path: string): number => {
  const number = assertNumber(value, path)

  if (!Number.isInteger(number)) {
    throw new Error(`${path} must be an integer`)
  }

  return number
}

const assertBoolean = (value: unknown, path: string): boolean => {
  if (typeof value !== 'boolean') {
    throw new Error(`${path} must be a boolean`)
  }

  return value
}

const assertStringArray = (value: unknown, path: string): string[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array`)
  }

  return value.map((item, index) => assertString(item, `${path}[${index}]`))
}

const assertArray = <T>(
  value: unknown,
  path: string,
  mapper: (item: unknown, path: string) => T,
): T[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array`)
  }

  return value.map((item, index) => mapper(item, `${path}[${index}]`))
}

const assertPole = (value: unknown, path: string): 1 | -1 => {
  if (value !== 1 && value !== -1) {
    throw new Error(`${path} must be 1 or -1`)
  }

  return value
}

const parseLink = (value: unknown, path: string): PackLink => {
  const object = assertObject(value, path)

  return {
    label: assertString(object.label, `${path}.label`),
    url: assertString(object.url, `${path}.url`),
    note: assertOptionalString(object.note, `${path}.note`),
  }
}

const parseCommentEvidence = (value: unknown, path: string): PackCommentEvidence => {
  const object = assertObject(value, path)

  return {
    platform: assertString(object.platform, `${path}.platform`),
    url: assertString(object.url, `${path}.url`),
    likes:
      object.likes === undefined || object.likes === null
        ? undefined
        : assertInteger(object.likes, `${path}.likes`),
    excerpt: assertString(object.excerpt, `${path}.excerpt`),
    summary: assertString(object.summary, `${path}.summary`),
  }
}

const parseDimension = (value: unknown, path: string): PackDimension => {
  const object = assertObject(value, path)

  return {
    id: assertString(object.id, `${path}.id`),
    name: assertString(object.name, `${path}.name`),
    shortName: assertString(object.shortName, `${path}.shortName`),
    description: assertString(object.description, `${path}.description`),
    positiveLabel: assertString(object.positiveLabel, `${path}.positiveLabel`),
    negativeLabel: assertString(object.negativeLabel, `${path}.negativeLabel`),
    positiveHint: assertString(object.positiveHint, `${path}.positiveHint`),
    negativeHint: assertString(object.negativeHint, `${path}.negativeHint`),
  }
}

const parseQuestion = (value: unknown, path: string): PackQuestion => {
  const object = assertObject(value, path)

  return {
    id: assertInteger(object.id, `${path}.id`),
    dimension: assertString(object.dimension, `${path}.dimension`),
    direction: assertPole(object.direction, `${path}.direction`),
    prompt: assertString(object.prompt, `${path}.prompt`),
  }
}

const parsePalette = (value: unknown, path: string): PackPalette => {
  const object = assertObject(value, path)

  return {
    accent: assertString(object.accent, `${path}.accent`),
    surface: assertString(object.surface, `${path}.surface`),
    glow: assertString(object.glow, `${path}.glow`),
  }
}

const parseTrack = (value: unknown, path: string): PackTrack => {
  const object = assertObject(value, path)
  const pivot = assertObject(object.pivot, `${path}.pivot`)
  const answerStyle = assertObject(object.answerStyle, `${path}.answerStyle`)
  const platforms = assertObject(object.platforms, `${path}.platforms`)
  const sources = assertObject(object.sources, `${path}.sources`)
  const evidence = assertObject(object.evidence, `${path}.evidence`)
  const canonicalRanking = assertObject(
    evidence.canonicalRanking,
    `${path}.evidence.canonicalRanking`,
  )
  const lyrics = assertObject(evidence.lyrics, `${path}.evidence.lyrics`)
  const interpretation = assertObject(
    evidence.interpretation,
    `${path}.evidence.interpretation`,
  )
  const vectorObject = assertObject(object.vector, `${path}.vector`)

  return {
    id: assertString(object.id, `${path}.id`),
    title: assertString(object.title, `${path}.title`),
    romanized: assertString(object.romanized, `${path}.romanized`),
    epithet: assertString(object.epithet, `${path}.epithet`),
    summary: assertString(object.summary, `${path}.summary`),
    scene: assertString(object.scene, `${path}.scene`),
    gift: assertString(object.gift, `${path}.gift`),
    shadow: assertString(object.shadow, `${path}.shadow`),
    ritual: assertString(object.ritual, `${path}.ritual`),
    tags: assertStringArray(object.tags, `${path}.tags`),
    keywords: assertStringArray(object.keywords, `${path}.keywords`),
    palette: parsePalette(object.palette, `${path}.palette`),
    pivot: {
      dimension: assertString(pivot.dimension, `${path}.pivot.dimension`),
      pole: assertPole(pivot.pole, `${path}.pivot.pole`),
    },
    vector: Object.fromEntries(
      Object.entries(vectorObject).map(([key, item]) => [
        key,
        assertNumber(item, `${path}.vector.${key}`),
      ]),
    ),
    answerStyle: {
      lean: assertNumber(answerStyle.lean, `${path}.answerStyle.lean`),
      cadence: assertNumber(answerStyle.cadence, `${path}.answerStyle.cadence`),
    },
    platforms: {
      appleMusic:
        platforms.appleMusic === undefined
          ? undefined
          : parseLink(platforms.appleMusic, `${path}.platforms.appleMusic`),
      netease:
        platforms.netease === undefined
          ? undefined
          : parseLink(platforms.netease, `${path}.platforms.netease`),
    },
    sources: {
      ranking: assertString(sources.ranking, `${path}.sources.ranking`),
      lyrics: assertString(sources.lyrics, `${path}.sources.lyrics`),
    },
    evidence: {
      canonicalRanking: {
        platform: assertString(
          canonicalRanking.platform,
          `${path}.evidence.canonicalRanking.platform`,
        ),
        storefront: assertOptionalString(
          canonicalRanking.storefront,
          `${path}.evidence.canonicalRanking.storefront`,
        ),
        artistUrl: assertString(
          canonicalRanking.artistUrl,
          `${path}.evidence.canonicalRanking.artistUrl`,
        ),
        snapshotDate: assertString(
          canonicalRanking.snapshotDate,
          `${path}.evidence.canonicalRanking.snapshotDate`,
        ),
        rank: assertInteger(canonicalRanking.rank, `${path}.evidence.canonicalRanking.rank`),
        releaseLine: assertString(
          canonicalRanking.releaseLine,
          `${path}.evidence.canonicalRanking.releaseLine`,
        ),
        note: assertString(canonicalRanking.note, `${path}.evidence.canonicalRanking.note`),
      },
      supportingRankings: assertArray(
        evidence.supportingRankings,
        `${path}.evidence.supportingRankings`,
        parseLink,
      ),
      lyrics: {
        primary: parseLink(lyrics.primary, `${path}.evidence.lyrics.primary`),
        alternates: assertArray(
          lyrics.alternates,
          `${path}.evidence.lyrics.alternates`,
          parseLink,
        ),
        note: assertString(lyrics.note, `${path}.evidence.lyrics.note`),
      },
      interpretation: {
        official: assertArray(
          interpretation.official,
          `${path}.evidence.interpretation.official`,
          parseLink,
        ),
        community: assertArray(
          interpretation.community,
          `${path}.evidence.interpretation.community`,
          parseLink,
        ),
        comments: assertArray(
          interpretation.comments,
          `${path}.evidence.interpretation.comments`,
          parseCommentEvidence,
        ),
        consensus: assertStringArray(
          interpretation.consensus,
          `${path}.evidence.interpretation.consensus`,
        ),
      },
      modelingNotes: assertStringArray(evidence.modelingNotes, `${path}.evidence.modelingNotes`),
    },
  }
}

const parseSourceCard = (value: unknown, path: string): PackSourceCard => {
  const object = assertObject(value, path)

  return {
    title: assertString(object.title, `${path}.title`),
    body: assertString(object.body, `${path}.body`),
    links: assertArray(object.links, `${path}.links`, parseLink),
  }
}

const parseUi = (value: unknown, path: string): PackUi => {
  const object = assertObject(value, path)
  const hero = assertObject(object.hero, `${path}.hero`)
  const process = assertObject(object.process, `${path}.process`)
  const atlas = assertObject(object.atlas, `${path}.atlas`)
  const sources = assertObject(object.sources, `${path}.sources`)
  const quiz = assertObject(object.quiz, `${path}.quiz`)
  const result = assertObject(object.result, `${path}.result`)

  return {
    hero: {
      eyebrow: assertString(hero.eyebrow, `${path}.hero.eyebrow`),
      title: assertString(hero.title, `${path}.hero.title`),
      lead: assertString(hero.lead, `${path}.hero.lead`),
      primaryCta: assertString(hero.primaryCta, `${path}.hero.primaryCta`),
      secondaryCta: assertString(hero.secondaryCta, `${path}.hero.secondaryCta`),
      stats: assertStringArray(hero.stats, `${path}.hero.stats`),
    },
    strips: assertArray(object.strips, `${path}.strips`, (item, itemPath) => {
      const strip = assertObject(item, itemPath)
      return {
        title: assertString(strip.title, `${itemPath}.title`),
        body: assertString(strip.body, `${itemPath}.body`),
      }
    }),
    process: {
      eyebrow: assertString(process.eyebrow, `${path}.process.eyebrow`),
      title: assertString(process.title, `${path}.process.title`),
      steps: assertArray(process.steps, `${path}.process.steps`, (item, itemPath) => {
        const step = assertObject(item, itemPath)
        return {
          title: assertString(step.title, `${itemPath}.title`),
          body: assertString(step.body, `${itemPath}.body`),
        }
      }),
    },
    atlas: {
      eyebrow: assertString(atlas.eyebrow, `${path}.atlas.eyebrow`),
      title: assertString(atlas.title, `${path}.atlas.title`),
    },
    sources: {
      eyebrow: assertString(sources.eyebrow, `${path}.sources.eyebrow`),
      title: assertString(sources.title, `${path}.sources.title`),
      cards: assertArray(sources.cards, `${path}.sources.cards`, parseSourceCard),
    },
    quiz: {
      title: assertString(quiz.title, `${path}.quiz.title`),
      resetLabel: assertString(quiz.resetLabel, `${path}.quiz.resetLabel`),
      progressLabel: assertString(quiz.progressLabel, `${path}.quiz.progressLabel`),
      progressHint: assertString(quiz.progressHint, `${path}.quiz.progressHint`),
      keyboardHint: assertString(quiz.keyboardHint, `${path}.quiz.keyboardHint`),
      footerHint: assertString(quiz.footerHint, `${path}.quiz.footerHint`),
      backLabel: assertString(quiz.backLabel, `${path}.quiz.backLabel`),
    },
    result: {
      posterLabel: assertString(result.posterLabel, `${path}.result.posterLabel`),
      resonanceLabel: assertString(result.resonanceLabel, `${path}.result.resonanceLabel`),
      analysisEyebrow: assertString(result.analysisEyebrow, `${path}.result.analysisEyebrow`),
      stabilityLabel: assertString(result.stabilityLabel, `${path}.result.stabilityLabel`),
      secondMatchLabel: assertString(result.secondMatchLabel, `${path}.result.secondMatchLabel`),
      thirdMatchLabel: assertString(result.thirdMatchLabel, `${path}.result.thirdMatchLabel`),
      retakeLabel: assertString(result.retakeLabel, `${path}.result.retakeLabel`),
      sourceLabel: assertString(result.sourceLabel, `${path}.result.sourceLabel`),
      radarEyebrow: assertString(result.radarEyebrow, `${path}.result.radarEyebrow`),
      radarTitle: assertString(result.radarTitle, `${path}.result.radarTitle`),
      whyEyebrow: assertString(result.whyEyebrow, `${path}.result.whyEyebrow`),
      sceneTitle: assertString(result.sceneTitle, `${path}.result.sceneTitle`),
      giftTitle: assertString(result.giftTitle, `${path}.result.giftTitle`),
      shadowTitle: assertString(result.shadowTitle, `${path}.result.shadowTitle`),
      ritualTitle: assertString(result.ritualTitle, `${path}.result.ritualTitle`),
      topMatchesEyebrow: assertString(
        result.topMatchesEyebrow,
        `${path}.result.topMatchesEyebrow`,
      ),
      topMatchesTitle: assertString(result.topMatchesTitle, `${path}.result.topMatchesTitle`),
      footerStable: assertString(result.footerStable, `${path}.result.footerStable`),
      footerFluid: assertString(result.footerFluid, `${path}.result.footerFluid`),
    },
  }
}

const parseVoiceGuide = (value: unknown, path: string): PackVoiceGuide => {
  const object = assertObject(value, path)

  return {
    referenceTone: assertString(object.referenceTone, `${path}.referenceTone`),
    styleNotes: assertStringArray(object.styleNotes, `${path}.styleNotes`),
    avoid: assertStringArray(object.avoid, `${path}.avoid`),
  }
}

const parseLyricPolicy = (value: unknown, path: string): PackLyricPolicy => {
  const object = assertObject(value, path)

  return {
    storeFullLyrics: assertBoolean(object.storeFullLyrics, `${path}.storeFullLyrics`),
    allowedStorage: assertStringArray(object.allowedStorage, `${path}.allowedStorage`),
    note: assertString(object.note, `${path}.note`),
  }
}

const parseEditableText = (value: unknown, path: string): PackEditableText => {
  const object = assertObject(value, path)

  return {
    packTitle: assertString(object.packTitle, `${path}.packTitle`),
    packSubtitle: assertString(object.packSubtitle, `${path}.packSubtitle`),
    resultPrefix: assertString(object.resultPrefix, `${path}.resultPrefix`),
    resultSuffix: assertString(object.resultSuffix, `${path}.resultSuffix`),
    rankingBadge: assertString(object.rankingBadge, `${path}.rankingBadge`),
    sourceBadge: assertString(object.sourceBadge, `${path}.sourceBadge`),
    lyricBadge: assertString(object.lyricBadge, `${path}.lyricBadge`),
  }
}

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const dedupeLinks = (links: PackLink[]) => {
  const seen = new Set<string>()

  return links.filter((link) => {
    const key = `${link.label}::${link.url}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const normalizeLink = (url: string, label: string, note?: string): PackLink => ({
  label,
  url,
  note,
})

const excerptFromNote = (note: string) => {
  const normalized = note.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 72) {
    return normalized
  }

  return `${normalized.slice(0, 69)}...`
}

const firstUrlByDomain = (tracks: UnknownRecord[], domain: string): string | undefined => {
  for (const track of tracks) {
    const evidenceEntries = assertArray(track.inline_evidence, 'tracks.inline_evidence', (item) => item)
    for (const entry of evidenceEntries) {
      const evidence = assertObject(entry, 'tracks.inline_evidence[]')
      const urls = getEvidenceUrls(evidence)
      const hit = urls.find((url) => getDomain(url).includes(domain))
      if (hit) {
        return hit
      }
    }
  }

  return undefined
}

const getEvidenceUrls = (entry: UnknownRecord): string[] => {
  const urls: string[] = []

  if (typeof entry.url === 'string' && entry.url.trim().length > 0) {
    urls.push(entry.url)
  }

  if (Array.isArray(entry.urls)) {
    entry.urls.forEach((item, index) => {
      urls.push(assertString(item, `inline_evidence.urls[${index}]`))
    })
  }

  return urls
}

const toQuestionNumber = (rawId: string, fallback: number) => {
  const digits = rawId.match(/\d+/g)?.join('')
  return digits ? Number(digits) : fallback
}

const normalizeAuthoringPack = (root: UnknownRecord, sourceName: string): UnknownRecord => {
  const packMeta = assertObject(root.pack, `${sourceName}.pack`)
  const artist = assertObject(packMeta.artist, `${sourceName}.pack.artist`)
  const lyricPolicy = assertObject(root.lyric_policy, `${sourceName}.lyric_policy`)
  const editableText = assertObject(root.editable_text, `${sourceName}.editable_text`)
  const voiceGuide = assertObject(root.voice_guide, `${sourceName}.voice_guide`)
  const uiCopy = assertObject(root.ui_copy, `${sourceName}.ui_copy`)
  const landing = assertObject(uiCopy.landing, `${sourceName}.ui_copy.landing`)
  const questionFlow = assertObject(uiCopy.question_flow, `${sourceName}.ui_copy.question_flow`)
  const resultPage = assertObject(uiCopy.result_page, `${sourceName}.ui_copy.result_page`)
  const sourcePanel = assertObject(uiCopy.source_panel, `${sourceName}.ui_copy.source_panel`)
  const rankingDecision = assertObject(root.ranking_decision, `${sourceName}.ranking_decision`)
  const canonicalSource = assertObject(
    rankingDecision.canonical_source,
    `${sourceName}.ranking_decision.canonical_source`,
  )
  const rawDimensions = assertArray(root.dimensions, `${sourceName}.dimensions`, (item, itemPath) =>
    assertObject(item, itemPath),
  )
  const rawQuestions = assertArray(root.questions, `${sourceName}.questions`, (item, itemPath) =>
    assertObject(item, itemPath),
  )
  const rawTracks = assertArray(root.tracks, `${sourceName}.tracks`, (item, itemPath) =>
    assertObject(item, itemPath),
  )

  const firstNeteaseUrl = firstUrlByDomain(rawTracks, 'music.163.com')
  const firstUtaNetUrl = firstUrlByDomain(rawTracks, 'uta-net.com')
  const firstOfficialUrl = firstUrlByDomain(rawTracks, 'hitorie.jp')

  const supportingPlatforms = dedupeLinks(
    [
      firstNeteaseUrl
        ? normalizeLink(
            firstNeteaseUrl,
            'NetEase Music',
            '用于歌词、热评与中文社区语境补充。',
          )
        : null,
      firstUtaNetUrl
        ? normalizeLink(firstUtaNetUrl, 'Uta-Net', '用于歌词页落点与主题校对。')
        : null,
      firstOfficialUrl
        ? normalizeLink(firstOfficialUrl, 'Hitorie Official', '用于官方曲目、MV 与发布信息。')
        : null,
    ].filter(Boolean) as PackLink[],
  )

  const normalizedDimensions = rawDimensions.map((item, index) => {
    const dimension = assertObject(item, `${sourceName}.dimensions[${index}]`)
    return {
      id: assertString(dimension.id, `${sourceName}.dimensions[${index}].id`),
      name: assertString(dimension.name, `${sourceName}.dimensions[${index}].name`),
      shortName: assertString(
        dimension.short_name,
        `${sourceName}.dimensions[${index}].short_name`,
      ),
      description: assertString(
        dimension.description,
        `${sourceName}.dimensions[${index}].description`,
      ),
      positiveLabel: assertString(
        dimension.positive_label,
        `${sourceName}.dimensions[${index}].positive_label`,
      ),
      negativeLabel: assertString(
        dimension.negative_label,
        `${sourceName}.dimensions[${index}].negative_label`,
      ),
      positiveHint: assertString(
        dimension.positive_hint,
        `${sourceName}.dimensions[${index}].positive_hint`,
      ),
      negativeHint: assertString(
        dimension.negative_hint,
        `${sourceName}.dimensions[${index}].negative_hint`,
      ),
    }
  })

  const normalizedQuestions = rawQuestions.map((item, index) => {
    const question = assertObject(item, `${sourceName}.questions[${index}]`)
    const rawId = assertString(question.id, `${sourceName}.questions[${index}].id`)

    return {
      id: toQuestionNumber(rawId, index + 1),
      dimension: assertString(
        question.dimension,
        `${sourceName}.questions[${index}].dimension`,
      ),
      direction: assertPole(question.direction, `${sourceName}.questions[${index}].direction`),
      prompt: assertString(question.prompt, `${sourceName}.questions[${index}].prompt`),
    }
  })

  const normalizedTracks = rawTracks.map((item, index) => {
    const track = assertObject(item, `${sourceName}.tracks[${index}]`)
    const content = assertObject(track.content, `${sourceName}.tracks[${index}].content`)
    const scoring = assertObject(track.scoring, `${sourceName}.tracks[${index}].scoring`)
    const pivot = assertObject(scoring.pivot, `${sourceName}.tracks[${index}].scoring.pivot`)
    const vector = assertObject(scoring.vector, `${sourceName}.tracks[${index}].scoring.vector`)
    const answerStyle = assertObject(
      scoring.answer_style,
      `${sourceName}.tracks[${index}].scoring.answer_style`,
    )
    const palette = assertObject(scoring.palette, `${sourceName}.tracks[${index}].scoring.palette`)
    const evidenceEntries = assertArray(
      track.inline_evidence,
      `${sourceName}.tracks[${index}].inline_evidence`,
      (entry) => entry,
    ).map((entry, evidenceIndex) =>
      assertObject(entry, `${sourceName}.tracks[${index}].inline_evidence[${evidenceIndex}]`),
    )

    const rankingEntry = evidenceEntries.find((entry) => entry.kind === 'ranking')
    const lyricEntry = evidenceEntries.find((entry) => entry.kind === 'lyrics')
    const commentEntry = evidenceEntries.find((entry) => entry.kind === 'comments')
    const officialEntries = evidenceEntries.filter((entry) => {
      return entry.kind === 'official_or_semiofficial' || entry.kind === 'official'
    })
    const communityEntries = evidenceEntries.filter((entry) => entry.kind === 'community')

    if (!rankingEntry) {
      throw new Error(`${sourceName}.tracks[${index}] is missing ranking evidence`)
    }

    if (!lyricEntry) {
      throw new Error(`${sourceName}.tracks[${index}] is missing lyric evidence`)
    }

    if (!commentEntry) {
      throw new Error(`${sourceName}.tracks[${index}] is missing comment evidence`)
    }

    if (officialEntries.length === 0 && communityEntries.length === 0) {
      throw new Error(
        `${sourceName}.tracks[${index}] must include at least one official or community source`,
      )
    }

    const lyricUrls = getEvidenceUrls(lyricEntry)
    const officialLinks = officialEntries.flatMap((entry, entryIndex) =>
      getEvidenceUrls(entry).map((url, urlIndex) =>
        normalizeLink(
          url,
          `${assertString(entry.source, `${sourceName}.tracks[${index}].inline_evidence[official].source`)} ${entryIndex + 1}.${urlIndex + 1}`,
          assertOptionalString(
            entry.note,
            `${sourceName}.tracks[${index}].inline_evidence[official].note`,
          ),
        ),
      ),
    )
    const communityLinks = communityEntries.flatMap((entry, entryIndex) =>
      getEvidenceUrls(entry).map((url, urlIndex) =>
        normalizeLink(
          url,
          `${assertString(entry.source, `${sourceName}.tracks[${index}].inline_evidence[community].source`)} ${entryIndex + 1}.${urlIndex + 1}`,
          assertOptionalString(
            entry.note,
            `${sourceName}.tracks[${index}].inline_evidence[community].note`,
          ),
        ),
      ),
    )
    const appleSongUrl =
      [...officialLinks.map((link) => link.url), ...getEvidenceUrls(rankingEntry)].find((url) =>
        getDomain(url).includes('music.apple.com'),
      ) ?? assertString(canonicalSource.url, `${sourceName}.ranking_decision.canonical_source.url`)
    const neteaseUrl =
      [...lyricUrls, ...getEvidenceUrls(commentEntry)].find((url) =>
        getDomain(url).includes('music.163.com'),
      ) ?? firstNeteaseUrl

    return {
      id: assertString(track.id, `${sourceName}.tracks[${index}].id`),
      title: assertString(track.title, `${sourceName}.tracks[${index}].title`),
      romanized: assertString(track.romanized, `${sourceName}.tracks[${index}].romanized`),
      epithet: assertString(content.epithet, `${sourceName}.tracks[${index}].content.epithet`),
      summary: assertString(content.summary, `${sourceName}.tracks[${index}].content.summary`),
      scene: assertString(content.scene, `${sourceName}.tracks[${index}].content.scene`),
      gift: assertString(content.gift, `${sourceName}.tracks[${index}].content.gift`),
      shadow: assertString(content.shadow, `${sourceName}.tracks[${index}].content.shadow`),
      ritual: assertString(content.ritual, `${sourceName}.tracks[${index}].content.ritual`),
      tags: assertStringArray(content.tags, `${sourceName}.tracks[${index}].content.tags`),
      keywords: assertStringArray(content.tags, `${sourceName}.tracks[${index}].content.tags`),
      palette: {
        accent: assertString(
          palette.accent,
          `${sourceName}.tracks[${index}].scoring.palette.accent`,
        ),
        surface: assertString(
          palette.surface,
          `${sourceName}.tracks[${index}].scoring.palette.surface`,
        ),
        glow: assertString(
          palette.glow,
          `${sourceName}.tracks[${index}].scoring.palette.glow`,
        ),
      },
      pivot: {
        dimension: assertString(
          pivot.dimension,
          `${sourceName}.tracks[${index}].scoring.pivot.dimension`,
        ),
        pole: assertPole(pivot.pole, `${sourceName}.tracks[${index}].scoring.pivot.pole`),
      },
      vector: Object.fromEntries(
        Object.entries(vector).map(([key, value]) => [
          key,
          assertNumber(value, `${sourceName}.tracks[${index}].scoring.vector.${key}`),
        ]),
      ),
      answerStyle: {
        lean: assertNumber(
          answerStyle.lean,
          `${sourceName}.tracks[${index}].scoring.answer_style.lean`,
        ),
        cadence: assertNumber(
          answerStyle.cadence,
          `${sourceName}.tracks[${index}].scoring.answer_style.cadence`,
        ),
      },
      platforms: {
        appleMusic: appleSongUrl
          ? normalizeLink(appleSongUrl, 'Apple Music', '用于外部访问与复核曲目页。')
          : undefined,
        netease: neteaseUrl
          ? normalizeLink(neteaseUrl, 'NetEase Music', '用于歌词与热评复核。')
          : undefined,
      },
      sources: {
        ranking: assertString(rankingEntry.url, `${sourceName}.tracks[${index}].ranking.url`),
        lyrics: lyricUrls[0] ?? assertString(commentEntry.url, `${sourceName}.tracks[${index}].comments.url`),
      },
      evidence: {
        canonicalRanking: {
          platform: assertString(
            canonicalSource.name,
            `${sourceName}.ranking_decision.canonical_source.name`,
          ),
          storefront: assertOptionalString(
            canonicalSource.storefront,
            `${sourceName}.ranking_decision.canonical_source.storefront`,
          ),
          artistUrl: assertString(
            canonicalSource.url,
            `${sourceName}.ranking_decision.canonical_source.url`,
          ),
          snapshotDate: assertString(packMeta.observed_at, `${sourceName}.pack.observed_at`),
          rank: assertInteger(track.rank, `${sourceName}.tracks[${index}].rank`),
          releaseLine: assertString(
            track.apple_visible_release_line,
            `${sourceName}.tracks[${index}].apple_visible_release_line`,
          ),
          note: assertString(rankingEntry.note, `${sourceName}.tracks[${index}].ranking.note`),
        },
        supportingRankings: dedupeLinks(
          [neteaseUrl ? normalizeLink(neteaseUrl, 'NetEase song page') : null].filter(
            Boolean,
          ) as PackLink[],
        ),
        lyrics: {
          primary: normalizeLink(
            lyricUrls[0] ?? assertString(commentEntry.url, `${sourceName}.tracks[${index}].comments.url`),
            getDomain(lyricUrls[0] ?? assertString(commentEntry.url, `${sourceName}.tracks[${index}].comments.url`))
              .includes('uta-net.com')
              ? 'Uta-Net'
              : 'Lyric source',
          ),
          alternates: lyricUrls.slice(1).map((url) =>
            normalizeLink(url, getDomain(url).includes('music.163.com') ? 'NetEase Music' : 'Alt lyric source'),
          ),
          note: assertString(lyricEntry.note, `${sourceName}.tracks[${index}].lyrics.note`),
        },
        interpretation: {
          official: dedupeLinks(officialLinks),
          community: dedupeLinks(communityLinks),
          comments: [
            {
              platform: assertString(
                commentEntry.source,
                `${sourceName}.tracks[${index}].comments.source`,
              ),
              url: assertString(commentEntry.url, `${sourceName}.tracks[${index}].comments.url`),
              excerpt: excerptFromNote(
                assertString(commentEntry.note, `${sourceName}.tracks[${index}].comments.note`),
              ),
              summary: assertString(
                commentEntry.note,
                `${sourceName}.tracks[${index}].comments.note`,
              ),
            },
          ],
          consensus: [
            assertString(lyricEntry.note, `${sourceName}.tracks[${index}].lyrics.note`),
            assertString(commentEntry.note, `${sourceName}.tracks[${index}].comments.note`),
            ...officialEntries
              .map((entry) => assertOptionalString(entry.note, `${sourceName}.tracks[${index}].official.note`))
              .filter((note): note is string => Boolean(note)),
          ],
        },
        modelingNotes: [
          '结果页文案必须能回溯到 inline_evidence，不能把热评直接当成官方释义。',
          assertString(voiceGuide.one_line_test, `${sourceName}.voice_guide.one_line_test`),
        ],
      },
    }
  })

  const rankingNote = assertString(
    landing.ranking_note,
    `${sourceName}.ui_copy.landing.ranking_note`,
  )
  const storefrontWarning = assertString(
    sourcePanel.storefront_warning,
    `${sourceName}.ui_copy.source_panel.storefront_warning`,
  )

  return {
    id: assertString(packMeta.id, `${sourceName}.pack.id`),
    version: String(assertInteger(root.version, `${sourceName}.version`)),
    artist: {
      key: assertString(artist.name_latn, `${sourceName}.pack.artist.name_latn`),
      displayName: assertString(artist.name_ja, `${sourceName}.pack.artist.name_ja`),
      shortName: assertString(artist.name_latn, `${sourceName}.pack.artist.name_latn`),
      title: assertString(editableText.pack_title, `${sourceName}.editable_text.pack_title`),
      subtitle: assertString(
        editableText.pack_subtitle,
        `${sourceName}.editable_text.pack_subtitle`,
      ),
      description: assertString(packMeta.intent, `${sourceName}.pack.intent`),
    },
    rankingDecision: {
      canonicalPlatform: assertString(
        canonicalSource.name,
        `${sourceName}.ranking_decision.canonical_source.name`,
      ),
      storefront: assertOptionalString(
        canonicalSource.storefront,
        `${sourceName}.ranking_decision.canonical_source.storefront`,
      ),
      artistUrl: assertString(
        canonicalSource.url,
        `${sourceName}.ranking_decision.canonical_source.url`,
      ),
      snapshotDate: assertString(packMeta.observed_at, `${sourceName}.pack.observed_at`),
      rationale: rankingNote,
      caveats: [
        assertString(
          rankingDecision.storefront_note,
          `${sourceName}.ranking_decision.storefront_note`,
        ),
        ...assertStringArray(
          rankingDecision.decision_rules,
          `${sourceName}.ranking_decision.decision_rules`,
        ),
      ],
      supportingPlatforms,
    },
    lyricPolicy: {
      storeFullLyrics: assertBoolean(
        lyricPolicy.store_full_lyrics,
        `${sourceName}.lyric_policy.store_full_lyrics`,
      ),
      allowedStorage: assertStringArray(
        lyricPolicy.allowed_storage,
        `${sourceName}.lyric_policy.allowed_storage`,
      ),
      note: assertString(lyricPolicy.note, `${sourceName}.lyric_policy.note`),
    },
    editableText: {
      packTitle: assertString(editableText.pack_title, `${sourceName}.editable_text.pack_title`),
      packSubtitle: assertString(
        editableText.pack_subtitle,
        `${sourceName}.editable_text.pack_subtitle`,
      ),
      resultPrefix: assertString(
        editableText.result_prefix,
        `${sourceName}.editable_text.result_prefix`,
      ),
      resultSuffix: assertString(
        editableText.result_suffix,
        `${sourceName}.editable_text.result_suffix`,
      ),
      rankingBadge: assertString(
        editableText.ranking_badge,
        `${sourceName}.editable_text.ranking_badge`,
      ),
      sourceBadge: assertString(
        editableText.source_badge,
        `${sourceName}.editable_text.source_badge`,
      ),
      lyricBadge: assertString(
        editableText.lyric_badge,
        `${sourceName}.editable_text.lyric_badge`,
      ),
    },
    voiceGuide: {
      referenceTone: assertString(
        voiceGuide.core_brief,
        `${sourceName}.voice_guide.core_brief`,
      ),
      styleNotes: [
        ...assertStringArray(voiceGuide.do, `${sourceName}.voice_guide.do`),
        assertString(voiceGuide.one_line_test, `${sourceName}.voice_guide.one_line_test`),
      ],
      avoid: assertStringArray(voiceGuide.avoid, `${sourceName}.voice_guide.avoid`),
    },
    likertLabels: assertStringArray(root.likert_labels, `${sourceName}.likert_labels`),
    dimensions: normalizedDimensions,
    questions: normalizedQuestions,
    tracks: normalizedTracks,
    ui: {
      hero: {
        eyebrow: assertString(landing.eyebrow, `${sourceName}.ui_copy.landing.eyebrow`),
        title: assertString(landing.title, `${sourceName}.ui_copy.landing.title`),
        lead: assertString(landing.subtitle, `${sourceName}.ui_copy.landing.subtitle`),
        primaryCta: assertString(
          landing.primary_cta,
          `${sourceName}.ui_copy.landing.primary_cta`,
        ),
        secondaryCta: assertString(
          landing.secondary_cta,
          `${sourceName}.ui_copy.landing.secondary_cta`,
        ),
        stats: [
          assertString(
            editableText.ranking_badge,
            `${sourceName}.editable_text.ranking_badge`,
          ),
          `${normalizedQuestions.length} questions / ${normalizedDimensions.length} axes`,
          assertString(editableText.lyric_badge, `${sourceName}.editable_text.lyric_badge`),
        ],
      },
      strips: [
        {
          title: assertString(
            editableText.ranking_badge,
            `${sourceName}.editable_text.ranking_badge`,
          ),
          body: rankingNote,
        },
        {
          title: assertString(
            editableText.source_badge,
            `${sourceName}.editable_text.source_badge`,
          ),
          body: assertString(packMeta.intent, `${sourceName}.pack.intent`),
        },
        {
          title: assertString(
            editableText.lyric_badge,
            `${sourceName}.editable_text.lyric_badge`,
          ),
          body: assertString(lyricPolicy.note, `${sourceName}.lyric_policy.note`),
        },
      ],
      process: {
        eyebrow: 'Workflow',
        title: '这份测试包如何生成',
        steps: [
          {
            title: '锁定榜单',
            body: rankingNote,
          },
          {
            title: '补足证据',
            body:
              '每首歌至少保留歌词落点、热评旁证，以及官方或半官方页面，结论必须能回溯。',
          },
          {
            title: '回写成包',
            body:
              '题面、文案、画像、来源和写作约束全部落在一个 YAML 内容包里，再交给框架渲染。',
          },
        ],
      },
      atlas: {
        eyebrow: 'Track Atlas',
        title: '当前冻结的 Hitorie Top 10 画像',
      },
      sources: {
        eyebrow: 'Sources',
        title: assertString(sourcePanel.title, `${sourceName}.ui_copy.source_panel.title`),
        cards: [
          {
            title: assertString(
              sourcePanel.ranking_label,
              `${sourceName}.ui_copy.source_panel.ranking_label`,
            ),
            body: storefrontWarning,
            links: dedupeLinks([
              normalizeLink(
                assertString(
                  canonicalSource.url,
                  `${sourceName}.ranking_decision.canonical_source.url`,
                ),
                assertString(
                  canonicalSource.name,
                  `${sourceName}.ranking_decision.canonical_source.name`,
                ),
              ),
              ...supportingPlatforms.filter((link) => link.label !== 'Apple Music'),
            ]),
          },
          {
            title: assertString(
              sourcePanel.lyric_label,
              `${sourceName}.ui_copy.source_panel.lyric_label`,
            ),
            body: assertString(lyricPolicy.note, `${sourceName}.lyric_policy.note`),
            links: dedupeLinks(
              [firstUtaNetUrl ? normalizeLink(firstUtaNetUrl, 'Uta-Net') : null, firstNeteaseUrl
                ? normalizeLink(firstNeteaseUrl, 'NetEase Music')
                : null].filter(Boolean) as PackLink[],
            ),
          },
          {
            title: assertString(
              sourcePanel.comments_label,
              `${sourceName}.ui_copy.source_panel.comments_label`,
            ),
            body:
              '热评只作为听众接收方式与社区语感旁证，不直接等同于歌曲官方含义。',
            links: dedupeLinks(
              [firstNeteaseUrl ? normalizeLink(firstNeteaseUrl, 'NetEase hot comments') : null, firstOfficialUrl
                ? normalizeLink(firstOfficialUrl, 'Hitorie Official')
                : null].filter(Boolean) as PackLink[],
            ),
          },
        ],
      },
      quiz: {
        title: '回答这些问题，看看你最近更像哪首歌',
        resetLabel: '重置',
        progressLabel: assertString(
          questionFlow.progress_label,
          `${sourceName}.ui_copy.question_flow.progress_label`,
        ),
        progressHint: assertString(
          questionFlow.likert_hint,
          `${sourceName}.ui_copy.question_flow.likert_hint`,
        ),
        keyboardHint: '键盘 1-5 可快速作答',
        footerHint: '没有标准答案，按你最近更常出现的反应来选。',
        backLabel: assertString(
          questionFlow.back_button,
          `${sourceName}.ui_copy.question_flow.back_button`,
        ),
      },
      result: {
        posterLabel: '命中曲目',
        resonanceLabel: assertString(
          resultPage.resonance_label,
          `${sourceName}.ui_copy.result_page.resonance_label`,
        ),
        analysisEyebrow: 'Result Analysis',
        stabilityLabel: assertString(
          resultPage.stability_label,
          `${sourceName}.ui_copy.result_page.stability_label`,
        ),
        secondMatchLabel: '第二命中',
        thirdMatchLabel: '第三命中',
        retakeLabel: assertString(
          resultPage.retake_button,
          `${sourceName}.ui_copy.result_page.retake_button`,
        ),
        sourceLabel: '查看来源',
        radarEyebrow: 'Profile',
        radarTitle: assertString(
          resultPage.radar_title,
          `${sourceName}.ui_copy.result_page.radar_title`,
        ),
        whyEyebrow: assertString(
          resultPage.evidence_title,
          `${sourceName}.ui_copy.result_page.evidence_title`,
        ),
        sceneTitle: 'Scene',
        giftTitle: 'Gift',
        shadowTitle: 'Shadow',
        ritualTitle: 'Ritual',
        topMatchesEyebrow: 'Nearby Matches',
        topMatchesTitle: assertString(
          resultPage.secondary_title,
          `${sourceName}.ui_copy.result_page.secondary_title`,
        ),
        footerStable: assertString(
          editableText.result_prefix,
          `${sourceName}.editable_text.result_prefix`,
        ),
        footerFluid: assertString(
          editableText.result_suffix,
          `${sourceName}.editable_text.result_suffix`,
        ),
      },
    },
  }
}

const normalizeSourceShape = (root: UnknownRecord, sourceName: string) => {
  if ('pack' in root) {
    return normalizeAuthoringPack(root, sourceName)
  }

  return root
}

const parseNormalizedContentPack = (root: UnknownRecord, sourceName: string): ContentPack => {
  const artist = assertObject(root.artist, `${sourceName}.artist`)
  const rankingDecision = assertObject(root.rankingDecision, `${sourceName}.rankingDecision`)

  const pack: ContentPack = {
    id: assertString(root.id, `${sourceName}.id`),
    version: assertString(root.version, `${sourceName}.version`),
    artist: {
      key: assertString(artist.key, `${sourceName}.artist.key`),
      displayName: assertString(artist.displayName, `${sourceName}.artist.displayName`),
      shortName: assertString(artist.shortName, `${sourceName}.artist.shortName`),
      title: assertString(artist.title, `${sourceName}.artist.title`),
      subtitle: assertString(artist.subtitle, `${sourceName}.artist.subtitle`),
      description: assertString(artist.description, `${sourceName}.artist.description`),
    },
    rankingDecision: {
      canonicalPlatform: assertString(
        rankingDecision.canonicalPlatform,
        `${sourceName}.rankingDecision.canonicalPlatform`,
      ),
      storefront: assertOptionalString(
        rankingDecision.storefront,
        `${sourceName}.rankingDecision.storefront`,
      ),
      artistUrl: assertString(
        rankingDecision.artistUrl,
        `${sourceName}.rankingDecision.artistUrl`,
      ),
      snapshotDate: assertString(
        rankingDecision.snapshotDate,
        `${sourceName}.rankingDecision.snapshotDate`,
      ),
      rationale: assertString(
        rankingDecision.rationale,
        `${sourceName}.rankingDecision.rationale`,
      ),
      caveats: assertStringArray(rankingDecision.caveats, `${sourceName}.rankingDecision.caveats`),
      supportingPlatforms: assertArray(
        rankingDecision.supportingPlatforms,
        `${sourceName}.rankingDecision.supportingPlatforms`,
        parseLink,
      ),
    },
    lyricPolicy: parseLyricPolicy(root.lyricPolicy, `${sourceName}.lyricPolicy`),
    editableText: parseEditableText(root.editableText, `${sourceName}.editableText`),
    voiceGuide: parseVoiceGuide(root.voiceGuide, `${sourceName}.voiceGuide`),
    likertLabels: assertStringArray(root.likertLabels, `${sourceName}.likertLabels`),
    dimensions: assertArray(root.dimensions, `${sourceName}.dimensions`, parseDimension),
    questions: assertArray(root.questions, `${sourceName}.questions`, parseQuestion),
    tracks: assertArray(root.tracks, `${sourceName}.tracks`, parseTrack),
    ui: parseUi(root.ui, `${sourceName}.ui`),
  }

  const dimensionIds = new Set<string>()
  pack.dimensions.forEach((dimension, index) => {
    if (dimensionIds.has(dimension.id)) {
      throw new Error(`${sourceName}.dimensions[${index}] duplicates id ${dimension.id}`)
    }

    dimensionIds.add(dimension.id)
  })

  const questionIds = new Set<number>()
  pack.questions.forEach((question, index) => {
    if (questionIds.has(question.id)) {
      throw new Error(`${sourceName}.questions[${index}] duplicates id ${question.id}`)
    }

    if (!dimensionIds.has(question.dimension)) {
      throw new Error(
        `${sourceName}.questions[${index}] references missing dimension ${question.dimension}`,
      )
    }

    questionIds.add(question.id)
  })

  const trackIds = new Set<string>()
  pack.tracks.forEach((track, index) => {
    if (trackIds.has(track.id)) {
      throw new Error(`${sourceName}.tracks[${index}] duplicates id ${track.id}`)
    }

    trackIds.add(track.id)

    if (!dimensionIds.has(track.pivot.dimension)) {
      throw new Error(
        `${sourceName}.tracks[${index}] references missing pivot dimension ${track.pivot.dimension}`,
      )
    }

    const vectorKeys = Object.keys(track.vector)
    const missingKeys = [...dimensionIds].filter((dimensionId) => !vectorKeys.includes(dimensionId))
    const extraKeys = vectorKeys.filter((dimensionId) => !dimensionIds.has(dimensionId))

    if (missingKeys.length > 0 || extraKeys.length > 0) {
      throw new Error(
        `${sourceName}.tracks[${index}] has invalid vector keys; missing=${missingKeys.join(',') || 'none'} extra=${extraKeys.join(',') || 'none'}`,
      )
    }

    if (!track.sources.ranking) {
      throw new Error(`${sourceName}.tracks[${index}] must include a ranking source`)
    }

    if (!track.sources.lyrics) {
      throw new Error(`${sourceName}.tracks[${index}] must include a lyric source`)
    }

    if (
      track.evidence.interpretation.official.length === 0 &&
      track.evidence.interpretation.community.length === 0
    ) {
      throw new Error(
        `${sourceName}.tracks[${index}] must include at least one official or community source`,
      )
    }

    if (track.evidence.interpretation.comments.length === 0) {
      throw new Error(`${sourceName}.tracks[${index}] must include at least one comment source`)
    }

    if (track.evidence.interpretation.consensus.length === 0) {
      throw new Error(`${sourceName}.tracks[${index}] must include at least one consensus note`)
    }
  })

  return pack
}

export const parseContentPack = (source: string, sourceName = 'content-pack'): ContentPack => {
  const parsed = parse(source)
  const root = assertObject(parsed, sourceName)
  const normalizedRoot = normalizeSourceShape(root, sourceName)
  return parseNormalizedContentPack(normalizedRoot, sourceName)
}
