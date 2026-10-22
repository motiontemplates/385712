Global media binding fields and official music-prepare result mapping: read MEDIA.md and params.schema.json.properties.media. 全局人物、旁白与配乐字段及官网配乐返回值映射见 MEDIA.md。

## Verify caption clocks against the original audio / 先听校字幕时间

Treat a supplied automatic/draft SRT as unverified. `provided-captions` and `reviewed-transcript` name an input source; they do not prove alignment. Before scheduling captions or phrase emphasis, use actual local ASR/alignment evidence, or listen to **every complete cue** against the bound original narration and retain its checked SRT. Never rescale a draft to the audio duration, guess sentence/word times, or relabel it to pass validation. Preserve negation, conditions, counts and both comparison sides. Keep the original draft separately.

With bound narration and displayed captions, normal check-params/plan/prepare require `captionTimingEvidence` (below), unless the existing real `narrationTimingEvidence` already supports all complete captions. An actually listened-to sentence SRT works directly: no ASR subscription, word timestamps or new approval is required. No-voice text compositions remain supported. The validator also reads signal activity from the original voice, using the existing source container clock and every channel; substantial uncovered activity requires source review. Trailing silence alone is not an error. This coarse alarm is not speech recognition, cannot infer sentence boundaries or meaning, and must never generate replacement timings.

中文：自动字幕草稿先按未核对处理，不能仅改 provided-captions、reviewed-transcript 或工具名来声称已对齐。先用真实本地识别/对齐，或逐句听原声校正整句 SRT，保留原草稿；不要按全片比例拉伸。已实际听校的完整句级 SRT 可以直接绑定，不强制收费 ASR，也不增加审批。保留“还没／别／以后再”等否定、条件和限定，以及比较的两侧。检查通过仍不等于最终声画语义验收。

## Timing evidence before phrase focus / 先核对时间证据

Sentence-only SRT does not provide word boundaries. Use the complete cue text and unchanged whole-cue interval with `timing: sentence`. If one cue contains both comparison sides, emphasize the overall heading/card for that cue; do not guess when left switches to right. Side-specific emphasis is appropriate only when its complete actual cue owns that side, or actual finer alignment evidence is retained. Never divide a sentence equally, by character count or by a guessed reading speed and call it `measured-word`.

只有句级 SRT 时，使用完整句文与原整句区间，不自行拆时点；同一句同时讲两侧时用整体标题/卡片，不猜左右切换。仅当某一侧已有独立完整句级字幕，或保留了真实细分对齐证据时，才安排对应侧的强调。`measured-word` 与逐词字幕 units 须提供 `narrationTimingEvidence` 的实际 ASR/forced-align JSON 文件、摘要、源媒体身份、工具与时钟，并通过 `wordIndices` 引用原始词区间。详细格式与正常命令见 NARRATION-MAP.md。哈希与工具名称只提供可追溯性，不证明测量真实、识别准确或语义正确；最终编码听看仍单独验收。

# Audio preservation / 原声保留

Preserve the complete supplied narration. Source video and audio share the container origin, including leading silence, variable frame timestamps and internal gaps. Never reset the audio alone, stretch speech, infer silence from a low volume threshold, or cast normalized float samples directly to int16. The normal adapter checks decoded samples before planning, extracts with FFmpeg, and compares final encoded audio against the actual pre-encode mix. Digital silence is a binding error; scene effects do not prove narration survived. Extremely quiet audio needs listening, not automatic rejection.

优先保留用户完整口播视频原声。视频与音频共用源容器起点，保留开头与中间间隙；不要单独移动音轨、变速口播，或把归一化浮点直接转为整数。全零音频必须重新从原文件抽取，不能以“存在音轨、有时长、有音效”冒充人声正常。声音很小应试听，不能按阈值当静音丢弃。

626: bind media.voice.mode=presenter for embedded presenter audio, or file for an explicit separate track. An explicit none requires discardPresenterAudio=true if a presenter video has sound; set this only for an actual user-requested mute. Other component timelines preserve embedded presenter audio when voiceover is empty; a separate voiceover takes priority. presenter.audio=mute is an explicit user-requested mute. Native talking-video inputs preserve original narration. Explicit partial narrationRange is for a user-approved excerpt, never a workaround for short scene capacity.

For background music, inspect the verified personal package and its current official API capabilities. Use its official music-recommend/music-prepare path for authorized existing music when available. A source-stage apiEnabled=false declaration is historical, not a denial of a personal package's current capabilities. Check music.search, music.match and music.generate separately; do not invent support, keys or credentials. Keep license receipts and cover the full film. Ask only when materials or authorization are actually missing. Paid generation needs the user's authorization.

配乐按当前已验签个人包的官网能力查询；不要由旧作者源码的 apiEnabled=false 判定无配乐。检索、匹配与生成分别检查，已有授权曲使用随包官方准备流程并保留许可记录。不得伪造 Key、能力或授权，不擅自调用付费生成。

Before delivery, listen to the first sentence, a middle passage, the last sentence, and the final encoded mix. Verify speech remains intelligible against music and effects. Record technical audio validation and actual listening separately; neither sample metrics nor a transcript proves intelligibility or meaning.
