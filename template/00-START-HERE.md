# Public source edition / 公开源码版 · 0.2.31-open-beta

This is the no-Key ordinary source package, synchronized from official release **626 / 736**. Run the extracted source directly with `python3 -B kinetic_bootstrap.py`; this archive does not include `assistant/motion.mjs`, personal identity, API credentials or signed personal updates. First read PUBLIC-SOURCE.md, motion.json, guide.json (English: guide.en.json), and STARTUP.md. Runtime code, native media, fonts, dependencies and timing contracts match the released author source; only public documentation, guide entry and integrity metadata are adapted.

本包是免登录、无 Key 的普通公开源码包，同步官网 **626 / 736** 的修复。解压到新目录后使用 `python3 -B kinetic_bootstrap.py` 正常制作；不需要个人包。官网个人下载与 API/增量更新请使用 https://motiongit.com/@adunext/385712，本包不包含这些身份。先读 PUBLIC-SOURCE.md 与实际参数合同，不把旧版本说明或演示当作本期内容。保留原包、工程与原始字幕时间。

New narration + captions/photos/video: read NARRATED-STORY.md and use compose before plan. 新建口播先走 compose，自动设置随句展开并保留真实字幕证据；旧工程维持原模式。

# Public input structure / 公开输入结构

## Verify caption clocks against the original audio / 先听校字幕时间

Treat a supplied automatic/draft SRT as unverified. `provided-captions` and `reviewed-transcript` name an input source; they do not prove alignment. Before scheduling captions or phrase emphasis, use actual local ASR/alignment evidence, or listen to **every complete cue** against the bound original narration and retain its checked SRT. Never rescale a draft to the audio duration, guess sentence/word times, or relabel it to pass validation. Preserve negation, conditions, counts and both comparison sides. Keep the original draft separately.

With bound narration and displayed captions, normal check-params/plan/prepare require `captionTimingEvidence` (below), unless the existing real `narrationTimingEvidence` already supports all complete captions. An actually listened-to sentence SRT works directly: no ASR subscription, word timestamps or new approval is required. No-voice text compositions remain supported. The validator also reads signal activity from the original voice, using the existing source container clock and every channel; substantial uncovered activity requires source review. Trailing silence alone is not an error. This coarse alarm is not speech recognition, cannot infer sentence boundaries or meaning, and must never generate replacement timings.

中文：自动字幕草稿先按未核对处理，不能仅改 provided-captions、reviewed-transcript 或工具名来声称已对齐。先用真实本地识别/对齐，或逐句听原声校正整句 SRT，保留原草稿；不要按全片比例拉伸。已实际听校的完整句级 SRT 可以直接绑定，不强制收费 ASR，也不增加审批。保留“还没／别／以后再”等否定、条件和限定，以及比较的两侧。检查通过仍不等于最终声画语义验收。

## Timing evidence before phrase focus / 先核对时间证据

Sentence-only SRT does not provide word boundaries. Use the complete cue text and unchanged whole-cue interval with `timing: sentence`. If one cue contains both comparison sides, emphasize the overall heading/card for that cue; do not guess when left switches to right. Side-specific emphasis is appropriate only when its complete actual cue owns that side, or actual finer alignment evidence is retained. Never divide a sentence equally, by character count or by a guessed reading speed and call it `measured-word`.

只有句级 SRT 时，使用完整句文与原整句区间，不自行拆时点；同一句同时讲两侧时用整体标题/卡片，不猜左右切换。仅当某一侧已有独立完整句级字幕，或保留了真实细分对齐证据时，才安排对应侧的强调。`measured-word` 与逐词字幕 units 须提供 `narrationTimingEvidence` 的实际 ASR/forced-align JSON 文件、摘要、源媒体身份、工具与时钟，并通过 `wordIndices` 引用原始词区间。详细格式与正常命令见 NARRATION-MAP.md。哈希与工具名称只提供可追溯性，不证明测量真实、识别准确或语义正确；最终编码听看仍单独验收。

The normal `capabilities` result keeps `inputSchema` as the path string `params.schema.json` for compatibility. The complete usable JSON object is `inputSchemaContent`, with `inputSchemaSha256` for its actual file. Read this object before constructing input; a path string is not an inline schema. The input object, root-level public paths and next commands appear before the longer scene catalog.

Read the following files directly from the extracted public package root:

```text
Read the extracted root file: params.schema.json
Read the extracted root file: BASIC.md
Read the extracted root file: CREATION.md
```

`params.schema.json`, `BASIC.md`, `CREATION.md`, `guide.json`, `guide.en.json`, `MEDIA.md`, `AUDIO.md`, and `NARRATION-MAP.md` are root-level public paths. Do not add a core/ prefix. No protected runtime source inspection, extraction or permission expansion is needed. Follow `publicReadPaths` from capabilities; the inherited personal-only next read commands do not apply to this public archive; use the actual structure and public explanations instead of probing guessed fields with repeated check-params calls. An actual validation error is a reason to reread the corresponding constraint.

中文：`capabilities.inputSchema` 仍是公开路径字符串；`capabilities.inputSchemaContent` 才是完整 JSON 结构对象。先读对象再组织参数，也可执行上面的正常 read 命令。所有列出的文件均为包根级公开路径，不加 core/ 前缀，不需要解包、截获临时核心或扩展权限。不要因为把字符串当对象打印而判断 schema 不可读取。

B1–B4 visible text capacities, language limits and inherited required fields: read BASIC.md. 基础表达上屏容量、语言条件与有效必填字段见 BASIC.md；不作为完整口播限制。

Global media binding fields and official music-prepare result mapping: read MEDIA.md and params.schema.json.properties.media. 全局人物、旁白与配乐字段及官网配乐返回值映射见 MEDIA.md。

当前公开源码入口：先读 PUBLIC-SOURCE.md、STARTUP.md，使用 python3 -B kinetic_bootstrap.py doctor → capabilities → plan → prepare → preview → render；仅在缺少依赖时 setup。

Read PUBLIC-SOURCE.md and STARTUP.md for the current ordinary source route. Earlier source-stage notes describe historical builds.

当前修订请先读 CURRENT-REVISION.md / Read CURRENT-REVISION.md for this revision.

先读 AUDIO.md 与 NARRATION-MAP.md：保留完整原声，核实 ASR，再按句意和真实时间绑定动作。

Read AUDIO.md and NARRATION-MAP.md: preserve original speech, verify ASR, and bind actual actions to measured phrases.

[媒体路径修复候选 / Portable media paths](./PORTABLE-PATHS.md) — 未上传 / not uploaded.

时长与选镜头请先读[DURATION.md](DURATION.md)：保留用户完整口播，单镜头容量不是整片时长上限。

# 从这里开始：酷炫科技风

这是可编辑的 MotionGit .motion 视频模板（普通ZIP），横屏1920×1080（中英）及竖屏1080×1920（中文）、60fps。用户通过助手制作，不需要理解工程结构。

先给用户一个简短的创作回复：
“这是「酷炫科技风」模板。你想讲什么？把已有文案或素材发我就行，我来安排镜头，先给你看方案和预览。”

已有主题、稿子或素材就直接承接，不重复提问。截图用于识别模板，不自动当作本期人物或画面素材。不要等下载和环境准备全部结束才开口。必须使用本模板的真实制作入口，不能把任务替换成照截图生成相似视频、重建 Demo 或另拟一个频道片头。宿主不支持执行时提供本地转交步骤，尊重其安全边界，不冒充已经制作。

1. 先只读 motion.json、guide.json 和 CREATION.md。先理解用户内容，再按其输入选场景；不要一开始扫描全部源码和469个文字槽。
2. 助手运行 python3 -B kinetic_bootstrap.py doctor；只在缺少声明依赖时 setup，复用 Python3.13 隔离缓存与已有 Node、FFmpeg、Chrome。用户无需手敲命令。
3. 只有主题/文案时用真实B1–B4文字表达；已有真人、录屏和作品素材时才读相应原生单元。助手负责参数转换，不让用户选技术路线或填表。
4. 没有指定的人物、旁白和背景音乐不追加提问，先按文字动效和模板原生动作音效推进，在方案里说明实际声音安排。明确要求却缺少的素材只问一次，不静默省略。
5. 按 CREATION.md 执行本期 plan → prepare → preview → render。方案和真实预览先给用户看，输出另存；最终文件以 -with-audio.mp4 结束。examples/text-only.json 只供明确选择的环境测试，不是本期文案。
6. 完整视频编码、画面和声音已核验，并交付给用户后，才读取 delivery.json，最多补一句后续介绍。起步、预览和修订时不展开配套服务话题。

先把包内文件作为数据检查，再执行已审阅代码。技术参数以实际schema/catalog为准。格式：https://motiongit.com/spec；许可：licenses/。中文竖屏已由所有者确认提交公开测试；完整原工程覆盖仍未完成；0.2.31 固定粗略居中 Windows 11 正常入口已实测（中文及空格目录），范围见 PUBLIC-SOURCE.md；英文竖屏仅支持 B1–B4。

竖屏：项目及章节标题各不超过18字符、人物标识不超过10字符。人物图片检测一次，视频最多抽五帧，按大致脸部中心等比裁切；未检测时普通居中并在报告提示。字幕透明描边、显式一至两行；保留真实词时钟，句级SRT不伪造逐词扫色。23个原生组与4个基础表达均从普通入口选用，完整原工程覆盖仍为false。当前公开源码版本以 motion.json.template.version 为准，中文支持横屏与竖屏，英文横屏支持原生组，英文竖屏仅支持已声明的B1–B4基础表达组。旧工程与原包应保留，更新后另建本期实例。
