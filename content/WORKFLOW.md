# 音乐内容包工作流

这个仓库把每个艺人的测试内容视为一个独立的 `content/<artist>.yaml`，而不是一组散落在代码里的常量。

目标不是做运行时抓取器，而是建立一套可以由人类或 agent 重复执行、最后稳定落到 YAML 内容包里的研究流程。

## 产物要求

每个艺人只产出一个统一内容包，至少包含：

- 艺人信息
- 榜单决策
- 语气约束
- 维度
- 题目
- 曲目画像
- 每首歌的 inline evidence

文本、题面、关键词、结论都优先写进 YAML，不要先写死到代码里。

## 研究顺序

1. 锁 canonical 榜单

- 优先选可直接访问、且明确展示 `Top Songs` 的大平台
- 记录平台、storefront、日期、artist page URL
- 榜单顺序按页面原样冻结，不在 v1 自作主张做合并或“修正”

2. 补 supporting sources

- 网易云音乐：歌词、热评、中文社区语境
- Uta-Net 或同类歌词页：歌词落点与主题校对
- 官方 / 半官方：官网、MV、曲目页、发行信息、采访、特设页
- 社区知识页：Wikipedia / 百度百科 / 萌娘百科等

3. 写证据，不写猜想

- 每首歌都要有 ranking evidence
- 每首歌都要有 lyric evidence
- 每首歌都要有 comment evidence
- 每首歌都要有 official 或 community evidence
- 用户可见文案必须能回溯到这些证据

4. 回写成内容包

当前 `content/hitorie.yaml` 的 authoring 结构分成这些区块：

- `pack`
- `lyric_policy`
- `editable_text`
- `voice_guide`
- `ui_copy`
- `likert_labels`
- `dimensions`
- `questions`
- `ranking_decision`
- `tracks`

每首歌放在 `tracks[*]` 下，核心字段是：

- `content`
- `scoring`
- `inline_evidence`

## 写作规则

- 不落库完整歌词
- 只保存歌词链接、主题摘记和必要的极短证据注记
- 热评只能作为听众接收方式，不等于官方释义
- summary / scene / gift / shadow / ritual 这些用户文案，必须能被多源证据支撑
- 语气尽量贴近该艺人社区、歌词和官方语感，不要写成泛 GPT 心理测试腔

## Agent 拆分建议

在 canonical Top Songs 锁定后，再并行拆分：

- Agent A：canonical 榜单、日期、storefront、可见发行行
- Agent B：网易云 song id、歌词、热评
- Agent C：官方 / 半官方曲目页、MV、新闻、采访
- Agent D+：按单曲分批写 `inline_evidence` 和结果文案

推荐分批：

- 10 首歌：`4 + 3 + 3`
- 20 首歌：`5 + 5 + 5 + 5`

## 提交流程

1. 先改 `content/<artist>.yaml`
2. 跑 `npm run validate:content`
3. 跑 `npm run test:balance`
4. 跑 `npm run lint`
5. 跑 `npm run build`

只有当内容包和框架一起通过校验时，才继续发布。
