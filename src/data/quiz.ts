export type DimensionId =
  | 'spark'
  | 'distance'
  | 'focus'
  | 'stance'
  | 'recovery'

export type SongId =
  | 'senseless-wonder'
  | 'rula-rula'
  | 'notok'
  | 'one-me-two-hearts'
  | 'kara-no-waremono'
  | 'three-minutes'
  | 'juggernaut'
  | 'on-the-frontline'
  | 'little-cry-baby'
  | 'loveless'

export type DimensionDefinition = {
  id: DimensionId
  name: string
  shortName: string
  description: string
  positiveLabel: string
  negativeLabel: string
  positiveHint: string
  negativeHint: string
}

export type Question = {
  id: number
  dimension: DimensionId
  direction: 1 | -1
  prompt: string
}

export type SongProfile = {
  id: SongId
  title: string
  romanized: string
  epithet: string
  summary: string
  scene: string
  gift: string
  shadow: string
  ritual: string
  tags: [string, string, string]
  palette: {
    accent: string
    surface: string
    glow: string
  }
  pivot: {
    dimension: DimensionId
    pole: 1 | -1
  }
  vector: Record<DimensionId, number>
  answerStyle: {
    lean: number
    cadence: number
  }
  sources: {
    ranking: string
    lyrics: string
  }
}

export const likertLabels = [
  '很不像我',
  '不太像我',
  '一半一半',
  '挺像我',
  '非常像我',
] as const

export const dimensions: DimensionDefinition[] = [
  {
    id: 'spark',
    name: '点燃 / 定影',
    shortName: '点燃',
    description: '你更靠行动把自己点亮，还是先把感受定住再出手。',
    positiveLabel: '点燃',
    negativeLabel: '定影',
    positiveHint: '先上场，再在火光里看清方向',
    negativeHint: '先看清，再决定要不要让自己着起来',
  },
  {
    id: 'distance',
    name: '开门 / 封存',
    shortName: '开门',
    description: '你会主动把心门推开，还是更习惯把核心部分封存起来。',
    positiveLabel: '开门',
    negativeLabel: '封存',
    positiveHint: '靠近别人时，愿意先给一点真实',
    negativeHint: '重要的东西，通常会留在自己这里',
  },
  {
    id: 'focus',
    name: '幻视 / 实感',
    shortName: '幻视',
    description: '你容易被预感、画面、氛围牵引，还是更信具体事实和落点。',
    positiveLabel: '幻视',
    negativeLabel: '实感',
    positiveHint: '相信那些还没被说清的画面',
    negativeHint: '更依赖能够落地、被验证的部分',
  },
  {
    id: 'stance',
    name: '硬骨 / 柔光',
    shortName: '硬骨',
    description: '面对摩擦和压力时，你更倾向硬顶出轮廓，还是用柔软的方式保护自己和别人。',
    positiveLabel: '硬骨',
    negativeLabel: '柔光',
    positiveHint: '宁愿有骨架，也不想太快被压平',
    negativeHint: '更懂得用柔软和留白保护重要的东西',
  },
  {
    id: 'recovery',
    name: '索求 / 漂移',
    shortName: '索求',
    description: '你会正面承认自己的渴望，还是更习惯在任何关系和状态里保持漂移。',
    positiveLabel: '索求',
    negativeLabel: '漂移',
    positiveHint: '真正想要的时候，不太会假装无所谓',
    negativeHint: '一旦太沉重，就会先把自己抽离一点',
  },
]

export const questions: Question[] = [
  {
    id: 1,
    dimension: 'spark',
    direction: 1,
    prompt: '如果一个想法让我心动，我通常会先做一点，再决定值不值得继续。',
  },
  {
    id: 2,
    dimension: 'spark',
    direction: -1,
    prompt: '我更喜欢把情绪放凉之后，再决定要不要行动。',
  },
  {
    id: 3,
    dimension: 'spark',
    direction: 1,
    prompt: '比起等待时机成熟，我更愿意边试边修正。',
  },
  {
    id: 4,
    dimension: 'spark',
    direction: -1,
    prompt: '计划一旦被打乱，我会先停下来重新整理，而不是硬冲。',
  },
  {
    id: 5,
    dimension: 'spark',
    direction: 1,
    prompt: '临场的冲动，有时比事先推演更能让我看见自己真正想要什么。',
  },
  {
    id: 6,
    dimension: 'spark',
    direction: -1,
    prompt: '我很少因为一时热烈就改变原本的节奏。',
  },
  {
    id: 7,
    dimension: 'distance',
    direction: 1,
    prompt: '状态不稳的时候，我通常会主动去找一个可以说话的人。',
  },
  {
    id: 8,
    dimension: 'distance',
    direction: -1,
    prompt: '再亲近的人，也很难真正碰到我最核心的那一层。',
  },
  {
    id: 9,
    dimension: 'distance',
    direction: 1,
    prompt: '如果一段关系有继续靠近的可能，我愿意先把门打开一点。',
  },
  {
    id: 10,
    dimension: 'distance',
    direction: -1,
    prompt: '我更习惯自己消化情绪，而不是把它带进关系里。',
  },
  {
    id: 11,
    dimension: 'distance',
    direction: 1,
    prompt: '对我来说，被理解这件事值得承担一点暴露自己的风险。',
  },
  {
    id: 12,
    dimension: 'distance',
    direction: -1,
    prompt: '哪怕很在意，我也常常选择把关键的话留在心里。',
  },
  {
    id: 13,
    dimension: 'focus',
    direction: 1,
    prompt: '我做决定时，常会被一种说不清的预感牵着走。',
  },
  {
    id: 14,
    dimension: 'focus',
    direction: -1,
    prompt: '比起氛围和想象，我更相信手里已经发生的事实。',
  },
  {
    id: 15,
    dimension: 'focus',
    direction: 1,
    prompt: '一个人真正的样子，常常藏在他没说出口的那些画面里。',
  },
  {
    id: 16,
    dimension: 'focus',
    direction: -1,
    prompt: '如果一件事暂时看不见落点，我很难持续投入热情。',
  },
  {
    id: 17,
    dimension: 'focus',
    direction: 1,
    prompt: '我会被模糊、暧昧、带一点幻觉感的东西长久吸引。',
  },
  {
    id: 18,
    dimension: 'focus',
    direction: -1,
    prompt: '我更容易被明确、可验证、能落地的东西说服。',
  },
  {
    id: 19,
    dimension: 'stance',
    direction: 1,
    prompt: '当所有人都默认一条路的时候，我反而会想试试别的方向。',
  },
  {
    id: 20,
    dimension: 'stance',
    direction: -1,
    prompt: '就算心里不完全认同，我也能为了整体顺利先配合。',
  },
  {
    id: 21,
    dimension: 'stance',
    direction: 1,
    prompt: '如果某种规则让我窒息，我会想办法把它拧开。',
  },
  {
    id: 22,
    dimension: 'stance',
    direction: -1,
    prompt: '很多事情与其硬碰硬，不如先顺着局面找到空间。',
  },
  {
    id: 23,
    dimension: 'stance',
    direction: 1,
    prompt: '我宁愿承受一点冲突，也不想把自己磨得太圆。',
  },
  {
    id: 24,
    dimension: 'stance',
    direction: -1,
    prompt: '在大多数场合里，保持流动性比坚持姿态更重要。',
  },
  {
    id: 25,
    dimension: 'recovery',
    direction: 1,
    prompt: '一旦真正想要某样东西，我很难假装自己其实无所谓。',
  },
  {
    id: 26,
    dimension: 'recovery',
    direction: -1,
    prompt: '关系、目标或情绪一旦变得太沉，我会本能地把自己抽离一点。',
  },
  {
    id: 27,
    dimension: 'recovery',
    direction: 1,
    prompt: '比起把渴望收起来，我更愿意正面承认自己在期待什么。',
  },
  {
    id: 28,
    dimension: 'recovery',
    direction: -1,
    prompt: '很多时候我宁愿继续流动，也不想被任何人或状态钉住。',
  },
  {
    id: 29,
    dimension: 'recovery',
    direction: 1,
    prompt: '我会想反复确认某种连接是不是真的存在。',
  },
  {
    id: 30,
    dimension: 'recovery',
    direction: -1,
    prompt: '当事情开始需要被定义时，我更容易想转身去别的地方。',
  },
]

const rankingSource = 'https://www.ragnet.co.jp/ranking-hitorie-songs'

export const songs: SongProfile[] = [
  {
    id: 'senseless-wonder',
    title: 'センスレス・ワンダー',
    romanized: 'Senseless Wonder',
    epithet: '失重却还在前进的人',
    summary:
      '你会在不安和好奇之间继续向前。越是说不清自己，越会被那种“先跨过去再解释”的闪光吸引。',
    scene:
      '像在城市高处被风吹了一下，心里明明摇晃，却还是决定跨向下一块霓虹。',
    gift: '你擅长把未知感转成推进力，越混乱的时候越容易长出自己的节拍。',
    shadow: '有时会把“继续走”当成唯一答案，忽略了自己其实也需要被接住。',
    ritual: '给最近最犹豫的一件事设一个 15 分钟试跑，不求做完，只求点火。',
    tags: ['失重', '跳跃', '不规则自尊'],
    palette: {
      accent: '#19d4c7',
      surface: '#0f1d26',
      glow: 'rgba(25, 212, 199, 0.26)',
    },
    pivot: {
      dimension: 'focus',
      pole: 1,
    },
    vector: {
      spark: 0.28,
      distance: -0.1,
      focus: 0.96,
      stance: 0.42,
      recovery: 0.18,
    },
    answerStyle: {
      lean: 0.2,
      cadence: 0.74,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/164006/',
    },
  },
  {
    id: 'rula-rula',
    title: 'るらるら',
    romanized: 'Rula Rula',
    epithet: '会把羞耻甩进风里的人',
    summary:
      '你不太相信被安排好的路线，宁愿在流动里找真实。越是要你站队，越容易激起你往别处去的冲动。',
    scene:
      '像耳机里鼓点一落下，就从拥挤人群里斜切出去，笑着把旧节奏甩在身后。',
    gift: '你能在混乱里保留快感和机动性，不容易被单一身份锁住。',
    shadow: '持续漂移也会让真正重要的事一直延后，只剩下短暂解放感。',
    ritual: '把最近最想逃开的那件事，改成一次带着节奏感的小偏航，而不是彻底失联。',
    tags: ['漂移', '失真快感', '不站队'],
    palette: {
      accent: '#f77b32',
      surface: '#241611',
      glow: 'rgba(247, 123, 50, 0.24)',
    },
    pivot: {
      dimension: 'recovery',
      pole: -1,
    },
    vector: {
      spark: 0.72,
      distance: 0.16,
      focus: 0.38,
      stance: 0.14,
      recovery: -0.96,
    },
    answerStyle: {
      lean: 0.58,
      cadence: 0.96,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/128561/',
    },
  },
  {
    id: 'notok',
    title: 'NOTOK',
    romanized: 'NOTOK',
    epithet: '带着错位感继续呼吸的人',
    summary:
      '你对“不对劲”非常敏感，不会轻易用漂亮答案盖过去。即使状态失真，你也想一路追到那个真正的缺口。',
    scene:
      '像凌晨的显示器边缘一直闪着错误提示，但你还坐在原地，盯着它等答案自己浮上来。',
    gift: '你有直视失配和真空地带的勇气，不容易被表面上的“没事”骗过。',
    shadow: '太执着于找到准确命名，可能会让你长时间停留在疼的地方。',
    ritual: '给现在最难命名的感受写三个版本，不求正确，只求先把轮廓留下。',
    tags: ['错位', '追问', '未完成'],
    palette: {
      accent: '#8a7fff',
      surface: '#171724',
      glow: 'rgba(138, 127, 255, 0.24)',
    },
    pivot: {
      dimension: 'distance',
      pole: -1,
    },
    vector: {
      spark: -0.2,
      distance: -0.96,
      focus: 0.28,
      stance: 0.28,
      recovery: 0.34,
    },
    answerStyle: {
      lean: -0.14,
      cadence: 0.44,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/364154/',
    },
  },
  {
    id: 'one-me-two-hearts',
    title: 'ワンミーツハー',
    romanized: 'one-Me two-Hearts',
    epithet: '愿意把心借出去的人',
    summary:
      '你对关系始终抱有某种浪漫信任，即使知道靠近有代价，也愿意试着打开门。你命中的不是纯甜，而是“带着不安也想相遇”的勇气。',
    scene:
      '像把长期折叠好的纸门轻轻拉开一条缝，让外面的风先试着进来一点。',
    gift: '你有把双人世界从想象拉回现实的能力，关系里很会给别人台阶和呼吸。',
    shadow: '当你太想让相遇成立时，容易忽略自己其实也有想退后的瞬间。',
    ritual: '找一个你已经想了很久的人或关系，补上一句最该被听见的话。',
    tags: ['相遇', '借心', '双向门'],
    palette: {
      accent: '#ff5978',
      surface: '#27141d',
      glow: 'rgba(255, 89, 120, 0.22)',
    },
    pivot: {
      dimension: 'distance',
      pole: 1,
    },
    vector: {
      spark: 0.24,
      distance: 0.96,
      focus: 0.22,
      stance: -0.06,
      recovery: 0.56,
    },
    answerStyle: {
      lean: 0.52,
      cadence: 0.56,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/162105/',
    },
  },
  {
    id: 'kara-no-waremono',
    title: 'カラノワレモノ',
    romanized: 'Kara no Waremono',
    epithet: '和空心感并排坐着的人',
    summary:
      '你不急着把一切修圆。你知道有些情绪就是会碎、会空、会抽象，而你偏偏能从那种空白里听见自己的回声。',
    scene:
      '像把一只裂开的空器皿放在窗边，让夜风穿过去，也让它发出只有自己懂的声音。',
    gift: '你对复杂、模糊、难以解释的状态容忍度很高，能让脆弱保留质地。',
    shadow: '停留在裂痕太久时，容易把“无解”误认成唯一真相。',
    ritual: '挑一个你最近一直想跳过的感受，给它一个颜色、一种材质，再看它有没有稍微靠近你。',
    tags: ['空器', '裂纹', '抽象体温'],
    palette: {
      accent: '#9bb0c8',
      surface: '#1b2028',
      glow: 'rgba(155, 176, 200, 0.24)',
    },
    pivot: {
      dimension: 'spark',
      pole: -1,
    },
    vector: {
      spark: -0.96,
      distance: -0.54,
      focus: 0.08,
      stance: -0.18,
      recovery: -0.1,
    },
    answerStyle: {
      lean: -0.42,
      cadence: 0.58,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/196742/',
    },
  },
  {
    id: 'three-minutes',
    title: '3分29秒',
    romanized: '3 Min 29 Sec',
    epithet: '把短暂窗口硬生生打亮的人',
    summary:
      '你很懂时间是稀缺的，所以一旦看见窗口，就会快速压缩犹豫。你不需要一直浪漫，只需要那几分钟足够锋利。',
    scene:
      '像发车前最后一次抬头，你已经知道来不及想更多，只能把整个人投进去。',
    gift: '你能在有限时间里迅速提炼核心，越逼仄越有执行力。',
    shadow: '节奏长期太紧，会让你误以为“停下来整理”就是掉队。',
    ritual: '把今天最重要的一件事改成一个 209 秒的冲刺回合，先把轮廓推出去。',
    tags: ['压缩', '短兵相接', '刀锋窗口'],
    palette: {
      accent: '#ffe66b',
      surface: '#28210f',
      glow: 'rgba(255, 230, 107, 0.24)',
    },
    pivot: {
      dimension: 'spark',
      pole: 1,
    },
    vector: {
      spark: 0.96,
      distance: 0.24,
      focus: -0.2,
      stance: 0.56,
      recovery: 0.22,
    },
    answerStyle: {
      lean: 0.76,
      cadence: 1,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/305773/',
    },
  },
  {
    id: 'juggernaut',
    title: 'ジャガーノート',
    romanized: 'Juggernaut',
    epithet: '宁愿硬碰也不想失去棱角的人',
    summary:
      '你命中的不是柔顺，而是冲击力。你很难彻底接受“就这样吧”，越是被现实压缩，越想把自己的骨架撑出来。',
    scene:
      '像脚下整条街都在逼你低头，但你偏偏抬起下巴，把噪声当作节拍器。',
    gift: '你在高压情境里仍保有自己的核心，不轻易让世界替你定义轮廓。',
    shadow: '如果始终只能靠硬顶来证明自己，心会比外表先疲惫。',
    ritual: '把最近一个“明明不想答应却已经快要默认”的事情，写下你真正的边界。',
    tags: ['硬核', '骨架', '不低头'],
    palette: {
      accent: '#ff2e45',
      surface: '#2a1016',
      glow: 'rgba(255, 46, 69, 0.24)',
    },
    pivot: {
      dimension: 'stance',
      pole: 1,
    },
    vector: {
      spark: 0.52,
      distance: -0.34,
      focus: -0.44,
      stance: 1,
      recovery: 0.18,
    },
    answerStyle: {
      lean: 0.9,
      cadence: 0.9,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/296760/',
    },
  },
  {
    id: 'on-the-frontline',
    title: 'オン・ザ・フロントライン',
    romanized: 'On the Frontline',
    epithet: '一边摇晃一边站住位置的人',
    summary:
      '你不是不会犹豫，而是即便犹豫，也会继续站在该站的地方。你和这首歌的共振来自“理想与现实之间，仍愿意把自己放上前线”。',
    scene:
      '像在风口处把衣领拉紧，知道前面并不轻松，但也不准备后退。',
    gift: '你有稳定别人也稳定局面的能力，在转折期尤其能给人力量。',
    shadow: '你很容易把责任感穿得太久，以至于忘了自己也可以暂时下场。',
    ritual: '给最近承担最重的一件事补一个“轮换动作”，哪怕只是让别人知道你也会累。',
    tags: ['前线', '责任感', '现实中的勇气'],
    palette: {
      accent: '#2fbf71',
      surface: '#102219',
      glow: 'rgba(47, 191, 113, 0.24)',
    },
    pivot: {
      dimension: 'focus',
      pole: -1,
    },
    vector: {
      spark: 0.28,
      distance: 0.64,
      focus: -0.9,
      stance: 0.1,
      recovery: 0.2,
    },
    answerStyle: {
      lean: 0.36,
      cadence: 0.66,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/356129/',
    },
  },
  {
    id: 'little-cry-baby',
    title: 'リトルクライベイビー',
    romanized: 'Little Cry Baby',
    epithet: '愿意护送梦想长大的人',
    summary:
      '你对脆弱并不排斥，反而会本能地想把它抱起来继续走。你命中的是那种“会哭，但也会把梦送到更远地方”的明亮韧性。',
    scene:
      '像把一个刚出生的愿望抱在怀里，哪怕路上吵、风大，也不想让它落地。',
    gift: '你既能照顾感受，也能给感受找到去处，很适合做别人低潮时的缓冲层。',
    shadow: '太习惯照料和托举时，可能会忘记先确认自己是不是已经累了。',
    ritual: '把你最近想守住的一件小事具体写下来，像给它取一个会长大的名字。',
    tags: ['柔亮', '护送', '会哭也会向前'],
    palette: {
      accent: '#7fd6ff',
      surface: '#10202a',
      glow: 'rgba(127, 214, 255, 0.28)',
    },
    pivot: {
      dimension: 'stance',
      pole: -1,
    },
    vector: {
      spark: -0.16,
      distance: 0.82,
      focus: 0.14,
      stance: -0.96,
      recovery: 0.42,
    },
    answerStyle: {
      lean: 0.12,
      cadence: 0.32,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/220051/',
    },
  },
  {
    id: 'loveless',
    title: 'Loveless',
    romanized: 'Loveless',
    epithet: '一边索求爱一边抵抗命运的人',
    summary:
      '你对爱和缺爱都很敏感，不太会装作自己其实无所谓。你命中的不是圆满，而是那种“越想抓住，越要先看清自己到底在渴望什么”的夜色。',
    scene:
      '像在一场几乎失真的夜里，手里攥着梦，嘴上说着抗拒，心里却仍想被真正看见。',
    gift: '你对情感中的真空和饥饿有超强辨识度，因此一旦认真，也会认真得很深。',
    shadow: '当你太想被确认，容易把拉扯当作关系真实发生的唯一证据。',
    ritual: '写下一句“我真正想要的不是 ____ ，而是 ____”，替自己的渴望去一次伪装。',
    tags: ['夜色', '爱欲真空', '抗拒与索求'],
    palette: {
      accent: '#ff9b8f',
      surface: '#281614',
      glow: 'rgba(255, 155, 143, 0.24)',
    },
    pivot: {
      dimension: 'recovery',
      pole: 1,
    },
    vector: {
      spark: 0.12,
      distance: 0.36,
      focus: 0.68,
      stance: 0.34,
      recovery: 0.96,
    },
    answerStyle: {
      lean: 0.18,
      cadence: 0.7,
    },
    sources: {
      ranking: rankingSource,
      lyrics: 'https://www.uta-net.com/song/240823/',
    },
  },
]

export const sourceLinks = {
  sbti: 'https://www.test-sbti.com/',
  ranking: rankingSource,
  githubQuiz: 'https://github.com/AhmedTohamy01/React-Typescript-Quiz-App',
  githubMbti: 'https://github.com/rojcode/MBTI',
  quillforms: 'https://github.com/quillforms/quillforms',
}
