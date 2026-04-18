import { AnimatePresence, motion } from 'framer-motion'
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
  type CSSProperties,
} from 'react'
import { RadarChart } from './components/RadarChart'
import {
  dimensions,
  likertLabels,
  questions,
  songs,
  sourceLinks,
  type SongProfile,
} from './data/quiz'
import {
  calculateQuizResult,
  type AnswerValue,
  type QuizResult,
} from './lib/quiz-engine'

type Screen = 'landing' | 'quiz' | 'result'

type QuizAnswers = Array<AnswerValue | null>

const emptyAnswers = () => Array.from({ length: questions.length }, () => null) as QuizAnswers

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45 },
}

const quizCardTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.28 },
}

const formatAxisValue = (value: number) => Math.round(((value + 1) / 2) * 100)

const applyAnswer = (
  currentAnswers: QuizAnswers,
  currentIndex: number,
  answer: AnswerValue,
) => {
  const nextAnswers = [...currentAnswers]
  nextAnswers[currentIndex] = answer

  return {
    nextAnswers,
    isLastQuestion: currentIndex === questions.length - 1,
  }
}

function SongTile({ song }: { song: SongProfile }) {
  return (
    <article
      className="song-tile"
      style={
        {
          '--song-accent': song.palette.accent,
          '--song-surface': song.palette.surface,
          '--song-glow': song.palette.glow,
        } as CSSProperties
      }
    >
      <div className="song-tile__glow" />
      <div className="song-tile__meta">
        <span>{song.romanized}</span>
        <span>{song.epithet}</span>
      </div>
      <h3>{song.title}</h3>
      <p>{song.summary}</p>
      <div className="tag-row">
        {song.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  )
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.main className="page" {...pageTransition}>
      <section className="hero-section">
        <div className="hero-orbit hero-orbit--left" />
        <div className="hero-orbit hero-orbit--right" />
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">HITORIE DESTINY TRACK TEST</span>
            <h1>不是测你像哪种人格，而是看哪首 Hitorie 会先把你认出来。</h1>
            <p className="hero-lead">
              参考 SBTI 的多题渐进作答方式，我们把 10 首热门曲目的歌词意象拆成 5
              条维度，做成一个更像“命中曲”而不是“命中类型”的测试。
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={onStart}>
                开始测试
              </button>
              <a className="ghost-button" href="#song-atlas">
                先看十首歌地图
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="hero-panel__header">
              <span>30 道问题</span>
              <span>5 条歌词坐标</span>
              <span>10 首命运曲</span>
            </div>
            <div className="hero-panel__tracks">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="hero-track"
                  style={
                    {
                      '--delay': `${index * 0.06}s`,
                      '--accent': song.palette.accent,
                    } as CSSProperties
                  }
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{song.title}</strong>
                  <em>{song.epithet}</em>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="strip-section">
        <div>
          <strong>视觉参考</strong>
          <p>借了 SBTI 的节奏感，但把结果从“人格标签”改成“歌词命中曲”。</p>
        </div>
        <div>
          <strong>内容边界</strong>
          <p>歌词用于主题分析，站内不直接嵌入完整歌词文本，改用意象和情绪总结。</p>
        </div>
        <div>
          <strong>结果机制</strong>
          <p>不靠单题强引导，而是靠正反向混合题和多维匹配减少单曲塌缩。</p>
        </div>
      </section>

      <section className="process-section">
        <div className="section-head">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>这套题不是“你更像谁”，而是“你的状态会被哪首歌接住”</h2>
        </div>
        <div className="process-grid">
          <article>
            <strong>01</strong>
            <h3>30 题渐进作答</h3>
            <p>每个维度都有正向和反向陈述，避免大家一路点“非常同意”就被拉去同一首。</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>歌词主题向量</h3>
            <p>每首歌用“点燃、开门、幻视、硬骨、索求”五个主轴来建模，而不是直接抓字面。</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>命中曲结果页</h3>
            <p>输出命中度、维度雷达、Top 3 共鸣歌和一段更像 SBTI 风格的短分析。</p>
          </article>
        </div>
      </section>

      <section className="atlas-section" id="song-atlas">
        <div className="section-head">
          <span className="eyebrow">SONG ATLAS</span>
          <h2>这十首歌不是十种绝对人格，而是十种会在不同阶段命中你的歌词气候</h2>
        </div>
        <div className="song-grid">
          {songs.map((song) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <SongTile song={song} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="source-section">
        <div className="section-head">
          <span className="eyebrow">SOURCES</span>
          <h2>开发参考与歌词整理边界</h2>
        </div>
        <div className="source-grid">
          <article>
            <h3>SBTI 交互参考</h3>
            <p>参考了公开 SBTI 站点的“逐题推进 + 结果分析”节奏，但整体视觉、题库和算法为本项目独立设计。</p>
            <a href={sourceLinks.sbti} target="_blank" rel="noreferrer">
              打开 SBTI 站点
            </a>
          </article>
          <article>
            <h3>GitHub 结构参考</h3>
            <p>参考 React/TypeScript 多题测验项目的状态组织与页面切换思路，没有直接复制题型和样式。</p>
            <div className="link-stack">
              <a href={sourceLinks.githubQuiz} target="_blank" rel="noreferrer">
                React-Typescript-Quiz-App
              </a>
              <a href={sourceLinks.githubMbti} target="_blank" rel="noreferrer">
                MBTI
              </a>
              <a href={sourceLinks.quillforms} target="_blank" rel="noreferrer">
                Quill Forms
              </a>
            </div>
          </article>
          <article>
            <h3>歌曲来源</h3>
            <p>十首歌名单取自 2026 年 4 月仍可访问的热门排序页；歌词只做内部主题分析，站内不展示完整文本。</p>
            <a href={sourceLinks.ranking} target="_blank" rel="noreferrer">
              打开热门歌曲排行
            </a>
          </article>
        </div>
      </section>
    </motion.main>
  )
}

type QuizScreenProps = {
  answers: QuizAnswers
  activeIndex: number
  onAnswer: (answer: AnswerValue) => void
  onBack: () => void
  onReset: () => void
}

function QuizScreen({ answers, activeIndex, onAnswer, onBack, onReset }: QuizScreenProps) {
  const question = questions[activeIndex]
  const currentAnswer = answers[activeIndex]
  const answeredCount = answers.filter((answer) => answer !== null).length

  return (
    <motion.main className="page quiz-page" {...pageTransition}>
      <section className="quiz-shell">
        <header className="quiz-header">
          <div>
            <span className="eyebrow">QUESTION {String(activeIndex + 1).padStart(2, '0')}</span>
            <h2>选最像你“最近状态”的那一格</h2>
          </div>
          <button className="text-button" onClick={onReset}>
            重新开始
          </button>
        </header>

        <div className="progress-meta">
          <span>已完成 {answeredCount} / {questions.length}</span>
          <span>没有对错，别选“理想中的你”，选“现在的你”。</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.section key={question.id} className="question-card" {...quizCardTransition}>
            <div className="question-card__meta">
              <span>{String(question.id).padStart(2, '0')} / {questions.length}</span>
              <span>键盘也可直接按 1-5</span>
            </div>
            <p className="question-card__prompt">{question.prompt}</p>
            <div className="scale-grid">
              {likertLabels.map((label, index) => (
                <button
                  key={label}
                  className={`scale-button ${currentAnswer === index ? 'is-active' : ''}`}
                  onClick={() => onAnswer(index as AnswerValue)}
                >
                  <span>{index + 1}</span>
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="quiz-footer">
          <button className="ghost-button" onClick={onBack} disabled={activeIndex === 0}>
            上一题
          </button>
          <span>这套题默认一题一页，让每个判断都更接近“当下反应”。</span>
        </div>
      </section>
    </motion.main>
  )
}

function ResultScreen({
  result,
  onRetake,
}: {
  result: QuizResult
  onRetake: () => void
}) {
  const primary = result.primary
  const accent = primary.song.palette.accent

  return (
    <motion.main className="page result-page" {...pageTransition}>
      <section className="result-hero">
        <div
          className="result-poster"
          style={
            {
              '--poster-accent': accent,
              '--poster-surface': primary.song.palette.surface,
              '--poster-glow': primary.song.palette.glow,
            } as CSSProperties
          }
        >
          <div className="poster-noise" />
          <div className="result-poster__meta">
            <span>你的命中曲</span>
            <span>共振度 {primary.resonance}%</span>
          </div>
          <h1>{primary.song.title}</h1>
          <p className="poster-subtitle">{primary.song.epithet}</p>
          <p className="poster-summary">{primary.song.summary}</p>
          <div className="tag-row">
            {primary.song.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="result-side">
          <div className="section-head section-head--compact">
            <span className="eyebrow">RESULT ANALYSIS</span>
            <h2>{result.summary}</h2>
          </div>
          <div className="result-stat-grid">
            <article>
              <span>命中稳定度</span>
              <strong>{result.stability}%</strong>
              <p>{result.footerNote}</p>
            </article>
            <article>
              <span>第二共鸣</span>
              <strong>{result.secondary[0].song.title}</strong>
              <p>{result.secondary[0].song.epithet}</p>
            </article>
            <article>
              <span>第三共鸣</span>
              <strong>{result.secondary[1].song.title}</strong>
              <p>{result.secondary[1].song.epithet}</p>
            </article>
          </div>
          <div className="result-actions">
            <button className="primary-button" onClick={onRetake}>
              再测一次
            </button>
            <a className="ghost-button" href={primary.song.sources.ranking} target="_blank" rel="noreferrer">
              查看歌曲来源
            </a>
          </div>
        </div>
      </section>

      <section className="result-grid">
        <article className="analysis-card">
          <div className="section-head section-head--compact">
            <span className="eyebrow">YOUR SHAPE</span>
            <h2>五维歌词坐标</h2>
          </div>
          <RadarChart values={result.profile.dimensions} accent={accent} />
          <div className="dimension-list">
            {dimensions.map((dimension) => {
              const value = result.profile.dimensions[dimension.id]
              return (
                <div key={dimension.id} className="dimension-row">
                  <div className="dimension-row__head">
                    <span>{dimension.name}</span>
                    <strong>{value >= 0 ? dimension.positiveLabel : dimension.negativeLabel}</strong>
                  </div>
                  <div className="dimension-track">
                    <div className="dimension-track__center" />
                    <div
                      className="dimension-track__marker"
                      style={{
                        left: `${formatAxisValue(value)}%`,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                  <p>{value >= 0 ? dimension.positiveHint : dimension.negativeHint}</p>
                </div>
              )
            })}
          </div>
        </article>

        <article className="analysis-card">
          <div className="section-head section-head--compact">
            <span className="eyebrow">WHY THIS SONG</span>
            <h2>为什么会命中 {primary.song.title}</h2>
          </div>
          <div className="reason-list">
            {primary.reasons.map((reason) => (
              <div key={reason} className="reason-list__item">
                <strong>{primary.song.title}</strong>
                <p>{reason}</p>
              </div>
            ))}
          </div>
          <div className="scene-card">
            <h3>你的歌词场景</h3>
            <p>{primary.song.scene}</p>
          </div>
          <div className="insight-stack">
            <article>
              <span>你会带来的东西</span>
              <p>{primary.song.gift}</p>
            </article>
            <article>
              <span>容易被忽略的阴影</span>
              <p>{primary.song.shadow}</p>
            </article>
            <article>
              <span>适合现在的动作</span>
              <p>{primary.song.ritual}</p>
            </article>
          </div>
        </article>
      </section>

      <section className="top-match-section">
        <div className="section-head section-head--compact">
          <span className="eyebrow">TOP MATCHES</span>
          <h2>除了命中曲，你也和这两首保持强共鸣</h2>
        </div>
        <div className="top-match-grid">
          {[primary, ...result.secondary].map((match, index) => (
            <article
              key={match.song.id}
              className="top-match-card"
              style={
                {
                  '--song-accent': match.song.palette.accent,
                  '--song-glow': match.song.palette.glow,
                } as CSSProperties
              }
            >
              <div className="top-match-card__rank">0{index + 1}</div>
              <h3>{match.song.title}</h3>
              <p>{match.song.epithet}</p>
              <div className="top-match-card__meter">
                <div
                  style={{
                    width: `${match.resonance}%`,
                    backgroundColor: match.song.palette.accent,
                  }}
                />
              </div>
              <strong>{match.resonance}% 共振</strong>
            </article>
          ))}
        </div>
      </section>
    </motion.main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers)
  const [activeIndex, setActiveIndex] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)

  const resetAll = () => {
    setAnswers(emptyAnswers())
    setActiveIndex(0)
    setResult(null)
    setScreen('landing')
  }

  const startQuiz = () => {
    setAnswers(emptyAnswers())
    setActiveIndex(0)
    setResult(null)
    setScreen('quiz')
  }

  const finishQuiz = (nextAnswers: QuizAnswers) => {
    const completedAnswers = nextAnswers as AnswerValue[]
    startTransition(() => {
      setResult(calculateQuizResult(completedAnswers))
      setScreen('result')
    })
  }

  function onAnswer(answer: AnswerValue) {
    const { nextAnswers, isLastQuestion } = applyAnswer(answers, activeIndex, answer)
    setAnswers(nextAnswers)

    if (isLastQuestion) {
      finishQuiz(nextAnswers)
      return
    }

    setActiveIndex((current) => current + 1)
  }

  const goBack = () => {
    setActiveIndex((current) => Math.max(current - 1, 0))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  const onQuizKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key >= '1' && event.key <= '5') {
      const answer = (Number(event.key) - 1) as AnswerValue
      const { nextAnswers, isLastQuestion } = applyAnswer(
        answers,
        activeIndex,
        answer,
      )

      setAnswers(nextAnswers)

      if (isLastQuestion) {
        finishQuiz(nextAnswers)
        return
      }

      setActiveIndex((current) => current + 1)
    }

    if (event.key === 'ArrowLeft' && activeIndex > 0) {
      setActiveIndex((current) => current - 1)
    }
  })

  useEffect(() => {
    if (screen !== 'quiz') {
      return
    }

    window.addEventListener('keydown', onQuizKeyDown)
    return () => window.removeEventListener('keydown', onQuizKeyDown)
  }, [screen])

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {screen === 'landing' && <LandingScreen key="landing" onStart={startQuiz} />}
        {screen === 'quiz' && (
          <QuizScreen
            key="quiz"
            answers={answers}
            activeIndex={activeIndex}
            onAnswer={onAnswer}
            onBack={goBack}
            onReset={resetAll}
          />
        )}
        {screen === 'result' && result && (
          <ResultScreen key="result" result={result} onRetake={startQuiz} />
        )}
      </AnimatePresence>
    </div>
  )
}
