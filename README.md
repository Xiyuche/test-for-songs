# Hitorie Destiny Track Test

一个参考 `SBTI / MBTI` 作答节奏、但结果落到 `ひとりえ` 十首热门歌曲上的互动测试站。

## 这个版本做了什么

- 用 `React + Vite + TypeScript` 从零搭了一个单页测试站
- 设计了 `30` 道渐进式题目，全部采用 `5` 档 Likert 量表
- 把十首歌拆成 `5` 条歌词主轴，每条主轴的两个极点对应两首不同歌曲
- 结果页输出命中曲、共振度、稳定度、Top 3 共鸣歌、五维雷达图和短分析文案
- 附带 `balance` 校验脚本，专门检测结果是否过度塌向某一首歌

## 五条主轴

- `点燃 / 定影`
- `开门 / 封存`
- `幻视 / 实感`
- `硬骨 / 柔光`
- `索求 / 漂移`

## 为什么不用完整歌词

这个项目里的题库和歌曲画像来自对歌词主题、意象、叙事情绪的整理，但站内没有直接嵌入完整歌词文本。

这样做的原因：

- 保留了歌曲气质和测试灵魂
- 避免把完整歌词作为站点内容再分发
- 后续要继续扩歌单时，也更容易扩成“主题画像”而不是“文本堆砌”

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

这个仓库现在走的是 `main /docs` 发布方式，不依赖 `GitHub Actions`，适合本地直接用 `git push` 同步。

首次配置：

1. 在 GitHub 上新建一个公开仓库。
2. 把当前目录推到默认分支 `main`。
3. 在仓库的 `Settings -> Pages` 里，把 `Build and deployment` 的来源设成 `Deploy from a branch`。
4. 选择 `main` 分支，目录选 `/docs`。

之后每次更新页面，只需要：

```bash
npm install
npm run build:pages
git add .
git commit -m "Update site"
git push
```

`npm run build:pages` 会把适合 GitHub Pages 项目路径的静态文件重新生成到 `docs/`。  
[vite.config.ts](/Users/xiyuchen/WorkingSpace/Codex_Projects/Test_for_songs/vite.config.ts) 已经保留了可配置 `base` 的写法，后续如果仓库名变了，也只需要调整构建命令里的 `BASE_PATH`。

发布后的地址通常会是：

- 项目仓库：`https://<你的用户名>.github.io/<仓库名>/`
- 用户主页仓库（仓库名正好是 `<你的用户名>.github.io`）：`https://<你的用户名>.github.io/`

## 校验命令

```bash
npm run lint
npm run build
npm run test:balance
```

`test:balance` 会做三件事：

- 随机模拟多种作答分布，检查十首歌是否被比较均匀命中
- 验证每首歌都有可达的“命中画像”
- 检查极端作答模式不会让结果完全塌成单曲统治

## 主要文件

- `src/data/quiz.ts`：题库、维度、十首歌画像、来源链接
- `src/lib/quiz-engine.ts`：评分逻辑、结果排序、分析文案生成
- `src/components/RadarChart.tsx`：结果页雷达图
- `src/App.tsx`：落地页、测试流程、结果页
- `scripts/validate-balance.ts`：分布均衡性验证脚本

## 参考来源

- SBTI 公开站点交互：[https://www.test-sbti.com/](https://www.test-sbti.com/)
- React Quiz 结构参考：[AhmedTohamy01/React-Typescript-Quiz-App](https://github.com/AhmedTohamy01/React-Typescript-Quiz-App)
- MBTI 站点结构参考：[rojcode/MBTI](https://github.com/rojcode/MBTI)
- 题型/表单交互参考：[quillforms/quillforms](https://github.com/quillforms/quillforms)
- ひとりえ热门歌曲排行：[https://www.ragnet.co.jp/ranking-hitorie-songs](https://www.ragnet.co.jp/ranking-hitorie-songs)
- 歌词主题整理来源：各歌曲对应的 `Uta-Net` 页面链接已写在 `src/data/quiz.ts`

## 后续可以继续做

- 接入分享图 / 结果海报导出
- 把十首歌扩成更多曲目或按专辑版本切分
- 做多语言结果页
- 接入数据库，记录答题分布和真实用户命中统计
