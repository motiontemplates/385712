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

# Normal public-source startup / 公开源码正常启动

Read the public motion.lock.json and dependencies/runtime-dependencies.json. The bootstrap uses only the host Python standard library, so doctor and capabilities work before NumPy/jsonschema/OpenCV are installed. The locked production interpreter is Python3.13. Prefer an existing Python3.13 or an existing uv-managed3.13. The default system Python3.14 is not treated as compatible with these wheels. If no compatible interpreter exists, doctor names that concrete prerequisite. Setup never changes global Python.

本公开包直接使用解压根目录 kinetic_bootstrap.py。doctor/capabilities 不依赖第三方Python库；制作使用独立Python3.13环境，不在系统Python里安装依赖，系统3.14不会被冒充为兼容。官网个人包另按其随包助手执行。

Normal commands (the assistant fills real absolute paths; the user need not type them):

    python3 -B kinetic_bootstrap.py doctor
    python3 -B kinetic_bootstrap.py setup
    python3 -B kinetic_bootstrap.py capabilities
    python3 -B kinetic_bootstrap.py check-params --input <user.json>
    python3 -B kinetic_bootstrap.py plan --input <user.json> --out <work>/plan.json
    python3 -B kinetic_bootstrap.py prepare --input <user.json> --out <work>/project
    python3 -B kinetic_bootstrap.py preview --instance <work>/project --time 2 --out <work>/preview.png
    python3 -B kinetic_bootstrap.py render --instance <work>/project --out <work>/silent.mp4

The final sound result is silent-with-audio.mp4. All outputs need fresh paths. For an explicitly chosen external dependency-cache root, put --cache <cache-root> before the operation and keep using that root. The default is the platform's external MotionGit cache. Setup stores only the exact hashed Python wheels, locked Node dependencies and receipts there. It does not persist the helper's temporary template core. Rendering reuses that same isolated Python and explicitly loads playwright-core from this cache. Existing compatible Chrome/Chromium is used; explicit setup may install the standard Playwright headless shell into Playwright's own default browser cache if absent. FFmpeg/ffprobe and Node/npm remain declared host tools.

setup 会安装并核对完整锁定的Python与Node依赖，后续每一步使用同一Python，并从已核对外部缓存加载Node模块。依赖缓存与浏览器默认缓存可以保留复用；模板临时核心不作为安装目录。依赖失败须保留准确诊断；不要当作文稿太长、ASR不准或同步失败，也不能虚构 setup 成功。

This public source edition uses python3 -B kinetic_bootstrap.py doctor/setup/... directly. Official personal packages separately use their verified bundled helper. Read AUDIO.md, NARRATION-MAP.md and DURATION.md for actual audio, phrase ownership and full-narration planning. Initial environment readiness, final encoded audio, actual action meaning and listening are separate checks.
