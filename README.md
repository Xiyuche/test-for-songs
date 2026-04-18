# Hitorie Resonance Pack

一个把音乐测试内容拆成「框架 + 内容包」的实验项目。

现在这版已经不再把题面、歌曲画像、来源和结果文案硬编码在 TypeScript 常量里，而是统一收进一个可人工审阅的内容包文件里，由前端框架负责加载、校验、评分和渲染。

## 当前内容包

- 主包文件：`content/hitorie.yaml`
- 当前艺人：`ヒトリエ / hitorie`
- canonical 榜单：`Apple Music Japan artist page`
- 快照日期：`2026-04-18`
- supporting sources：`网易云音乐 / Uta-Net / Hitorie 官方站`

这份包里集中保存了：

- 艺人级文案与语气约束
- 五条维度定义
- 30 道题目
- Top 10 曲目画像
- 排名决策
- 歌词落点、官方/半官方来源、评论旁证

项目不落库存整段歌词，只保留外链、主题摘记和证据说明。

## 架构

- `content/hitorie.yaml`
  文本和证据的单一事实来源
- `content/WORKFLOW.md`
  后续扩新艺人时可复用的 research / agent workflow
- `src/content/schema.ts`
  authoring YAML -> runtime pack 的 normalize loader 与校验器
- `src/content/current-pack.ts`
  浏览器侧加载当前内容包
- `src/data/quiz.ts`
  对外暴露运行时内容包给应用使用
- `src/lib/quiz-engine.ts`
  通用评分逻辑与结果生成
- `scripts/validate-content.ts`
  内容包结构校验
- `scripts/validate-balance.ts`
  结果分布、可达性与单曲统治风险校验

## Authoring Philosophy

- 文本优先，代码次之
- 内容包是编辑对象，框架是渲染对象
- 不做运行时抓取，不把脆弱爬虫绑进站点
- 社区评论只能做旁证，不能代替官方或多源共识
- 如果榜单日期或 storefront 变化，新增新包，不静默覆盖旧快照

## 本地运行

```bash
npm install
npm run dev
```

## 校验命令

```bash
npm run validate:content
npm run lint
npm run build
npm run test:balance
```

当前 `test:balance` 主要检查三件事：

- 五种典型答题分布下，不会塌成单曲统治
- 每首歌都能通过评分模型找到可达画像
- 十首歌在整组模拟里都有覆盖，不会变成“死曲目”

## GitHub Pages

这个仓库现在走 `main /docs` 发布方式。

每次更新页面：

```bash
npm run build:pages
git add .
git commit -m "Update pack"
git push
```

`npm run build:pages` 会重新生成适合 GitHub Pages 项目路径的静态文件到 `docs/`。

## 后续扩展

- 新增 `content/<artist>.yaml`，不改评分框架
- 给内容包补审阅页 / 来源查看模式
- 把 workflow 抽成更正式的 skill
- 用多 agent 并行整理单曲证据，但继续保持人工可审阅的 YAML 落点
