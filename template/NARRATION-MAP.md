New narration + captions/photos/video: read NARRATED-STORY.md and use compose before plan. 新建口播先走 compose，自动设置随句展开并保留真实字幕证据；旧工程维持原模式。

B1–B4 visible text capacities, language limits and inherited required fields: read BASIC.md. 基础表达上屏容量、语言条件与有效必填字段见 BASIC.md；不作为完整口播限制。

## Verify caption clocks against the original audio / 先听校字幕时间

Treat a supplied automatic/draft SRT as unverified. `provided-captions` and `reviewed-transcript` name an input source; they do not prove alignment. Before scheduling captions or phrase emphasis, use actual local ASR/alignment evidence, or listen to **every complete cue** against the bound original narration and retain its checked SRT. Never rescale a draft to the audio duration, guess sentence/word times, or relabel it to pass validation. Preserve negation, conditions, counts and both comparison sides. Keep the original draft separately.

With bound narration and displayed captions, normal check-params/plan/prepare require `captionTimingEvidence` (below), unless the existing real `narrationTimingEvidence` already supports all complete captions. An actually listened-to sentence SRT works directly: no ASR subscription, word timestamps or new approval is required. No-voice text compositions remain supported. The validator also reads signal activity from the original voice, using the existing source container clock and every channel; substantial uncovered activity requires source review. Trailing silence alone is not an error. This coarse alarm is not speech recognition, cannot infer sentence boundaries or meaning, and must never generate replacement timings.

中文：自动字幕草稿先按未核对处理，不能仅改 provided-captions、reviewed-transcript 或工具名来声称已对齐。先用真实本地识别/对齐，或逐句听原声校正整句 SRT，保留原草稿；不要按全片比例拉伸。已实际听校的完整句级 SRT 可以直接绑定，不强制收费 ASR，也不增加审批。保留“还没／别／以后再”等否定、条件和限定，以及比较的两侧。检查通过仍不等于最终声画语义验收。

## Timing evidence before phrase focus / 先核对时间证据

Sentence-only SRT does not provide word boundaries. Use the complete cue text and unchanged whole-cue interval with `timing: sentence`. If one cue contains both comparison sides, emphasize the overall heading/card for that cue; do not guess when left switches to right. Side-specific emphasis is appropriate only when its complete actual cue owns that side, or actual finer alignment evidence is retained. Never divide a sentence equally, by character count or by a guessed reading speed and call it `measured-word`.

只有句级 SRT 时，使用完整句文与原整句区间，不自行拆时点；同一句同时讲两侧时用整体标题/卡片，不猜左右切换。仅当某一侧已有独立完整句级字幕，或保留了真实细分对齐证据时，才安排对应侧的强调。`measured-word` 与逐词字幕 units 须提供 `narrationTimingEvidence` 的实际 ASR/forced-align JSON 文件、摘要、源媒体身份、工具与时钟，并通过 `wordIndices` 引用原始词区间。详细格式与正常命令见 NARRATION-MAP.md。哈希与工具名称只提供可追溯性，不证明测量真实、识别准确或语义正确；最终编码听看仍单独验收。

# Narration, picture and action / 口播与画面

The assistant builds the plan from the complete real narration. Do not ask the user to fill technical tables. Read the source, listen at phrase boundaries and topic changes, and review ASR text/timestamps against the actual sound. ASR can be wrong; uncertain timing remains pending review. Do not automatically shift captions because a screenshot appears mismatched. A whole-film duration match proves neither sentence alignment nor action meaning.

按完整原声理解句意，先核对否定、限定、实体、数字与先后关系，再选择动作。ASR 文本和时间戳可能出错，须结合试听核实。一个时间映射表通过不代表画面表达正确；不应仅凭截图归因于模板或ASR。

For 626 and component timelines provide narrationMap with one row per selected shot: shot (zero-based), start, end (output seconds), spokenText (complete owned words), purpose, timingSource (provided-captions/measured-phrases/reviewed-transcript), captionIndices (zero-based when captions exist), and beats. Each beat has at, until, spokenText, timing (sentence or measured-word), and target. Sentence timing must use the real sentence interval; never invent word times from character count. Every caption belongs exactly once, and a shot must not cut its owned cue. Keep qualifiers and negatives in spokenText. Actual listening and meaning review remain required after this structural check.

626 B1 targets: keyword/explanation/headline; B2: heading/headline/points.0 through the actual last point; B3: heading/headline/left/right/conclusion; B4: summary/headline/action. These beats are consumed by the renderer to move visual focus at the actual output times. Different occurrences may use scene.basic overrides and different titles. Add enough compatible shots to cover all narration, or use the declared quiet hold with successive phrase focus. Existing entry/exit actions and native effects retain their source speed. Source native targets use actual protectedCueTimes IDs and must coincide with the spoken interval; if they cannot, choose a neutral expression instead of retiming protected motion.

Native multi-pack plans retain their existing measured contentEvidence.units, ownershipRefs, intent, anchors and phases. The plan writes narration-map.json and binds its hash into review. Match actual native actions and their source cue times to the words; inspect the selected group rather than picking it for remaining capacity. Component timelines use the real control/cue target and actual cues; the mapping does not add missing motion behavior to a control.

Do not show an unearned completed check for “not yet checked”; do not use elimination/shattering for outreach/support; do not use project-file graphics as account-association diagrams. S05/S13 are software-project workflows; S08 is decision/rejection; S10 is real comparison; S15/S16 are constrained process/completion or software actions. If the actual idea differs, use the same-style neutral B1–B4 or compatible components. All visible source labels and numerical endpoints must come from the current user's content. Do not invent years, counts, percentages, speeds or completion states. S08 labels/year tags and S16 terminal text are explicit slots; leave no option_A or author demo text in a production.

技术验收：原声完整、时钟保留、混音编码对比。内容验收：逐句实际听看，核对出现/强调时点、动作含义、左右对应、转折和结尾。分别记录，通过前者不能宣称后者通过。

B1–B4 support a bounded quiet middle hold of up to 30 seconds, with measured phrase focus; source entry/exit actions retain their speed. B1–B4 中性表达的安静阅读区现可延长最多30秒，并消费真实句段焦点；原动作和原生23组的保护窗不变。

Explicit approved excerpts: when narrationRange selects a complete source interval, captionIndices are zero-based among the selected output captions, and selectedSourceCaptionIndices records their original source indices. Whole cues entirely outside that explicit interval are omitted. A boundary through a sentence is rejected until a real reviewed phrase boundary/caption is supplied. With no explicit range, every full supplied cue remains required; this exception never authorizes shortening the user's full narration.

用户明确选取片段时，captionIndices 从所选输出字幕的0开始；报告保留原字幕索引。只排除明确范围外的完整句，边界穿过句子须核对真实分句。未明确选段时仍须完整覆盖全部口播，不默认删减。

## B2 counted points and actions / 计数内要点与行动

Optional `basic.pointRoles` is an array with exactly one `point` or `action` for each effective `points` entry. Root basic and scenes[i].basic follow the same shallow override rule. Omission defaults every row to point and preserves the previous appearance. Unknown values, null, and different effective lengths are rejected. If a scene overrides points but inherits global pointRoles, the inherited roles must still have the same length; supply a matching scene override when necessary. Do not silently drop the roles or guess them from text.

Points receive consecutive counted-point badges 01,02,03, skipping action rows. Actions display `行动` in Chinese or `ACTION` in English, with no numeric ordinal. An action may be first, middle or last; several actions and an all-action list are supported. The existing maximum remains five total rows, including actions, with the same point text length/line rules. The label uses a reserved localized badge width; actual text widths are still checked (ordinary point text790 source pixels; action text776 Chinese /752 English). Preview real text before export.

```json
{"heading":"先看三个要素","points":["观察光线方向","观察主体位置","观察背景层次","现在拍一张试试"],"pointRoles":["point","point","point","action"]}
```

Three counted points plus a final action are not four counted points. Build headings from the actual counted points and the user's meaning. A role is an explicit assistant content decision, not automatic semantic recognition. Preserve the complete narration and its real sentence/phrase times.

`points.i` always refers to the zero-based actual row index, including actions. If row1 is action and row2 is the second counted point, targets remain `points.1` and `points.2`; never replace them with the printed ordinal. Native card entry/exit timings and one sound cue per actual row remain unchanged. Selecting action does not declare anything completed or checked.

中文：B2 可用 pointRoles 逐项明确 point/action，与有效 points 等长；不填时沿用全部要点和原编号。行动使用“行动”标记，英文使用“ACTION”，不计入要点编号；不改行位置、原声、镜头时长、points.i 焦点或逐行动作音效。全局继承和逐镜头覆盖后仍须等长。三个要点加一个结尾行动时，标题应表达三个计数内要点，结尾行动另作行动；不得因模板容量剪短完整口播。

## Retained word alignment evidence / 保留实际词级对齐证据

The 626 normal `check-params`, `plan` and `prepare` operations check this contract. It does not run ASR, change the original audio, repair transcripts, subdivide words, or contact a particular provider. Obtain actual word output from an ASR tool or audio forced aligner that supports it. Keep its unmodified JSON result. A service returning only SRT/sentence timestamps cannot support a measured-word claim; use the sentence fallback above. Do not fabricate an evidence file or self-report a tool name to bypass the fallback.

`narrationTimingEvidence` is an optional root object, required whenever any narration beat uses `timing: measured-word` or any caption has nonempty `units`:

| Field | Meaning |
| --- | --- |
| `file` | Actual local ASR/aligner JSON, absolute or relative to user.json; a relative path stays inside that input directory. |
| `sha256` | SHA-256 of that exact unmodified JSON file. |
| `sourceMediaSha256` | SHA-256 of the actual original bound narration file: media.voice.file, or media.presenter.file when voice.mode is presenter. |
| `method` | `asr-word` or `forced-alignment`, describing what actually ran. Equal splits, estimated reading times and manually invented word intervals are not these methods. |
| `tool` | Object with the actual `name` and `version`. This is provenance, not an authenticity certificate. |
| `clock` | `bound-narration-seconds` when word times already use the complete bound audio/output origin; otherwise `source-media-seconds`. |
| `offsetSeconds` | Finite, measured translation with **output seconds = raw word seconds + offsetSeconds**. Required for source-media-seconds, including zero when origins coincide. A nonzero offset is supported only with that explicit source clock. No rate/scale change is supported. |

Supported provider-neutral JSON shapes are either an object with `words: [...]`, or an object with `segments: [...]` where each segment has `words: [...]`. Word objects contain `text` (or `word`), `start`, and `end` in seconds. The former uses the original words array order; the latter flattens segment/word order. No word is subdivided. Preserve the original source clock and record any actual offset; do not move the audio to make it fit. If the raw tool result records sourceMediaSha256, sourceAudioSha256, audioSha256 or audioSHA256, that recorded identity must also match the bound source. A raw result for another audio extraction needs its real source identity resolved, not a relabeled hash.

Each measured-word beat adds `wordIndices`: a nonempty contiguous sequence of zero-based indices into those actual word records. Its spokenText must match the complete referenced words, and at/until must equal their first start / last end after the declared offset, within one output frame. Each measured caption unit likewise adds wordIndices; its text/start/end follow the same rule. Do not add estimated padding, split an ASR token, infer internal character times, silently change recognized words, or retype guessed timestamps under a measured label. ASR text/timing errors require real source review and a traceable corrected alignment; a wrong ASR interval is not made true by hashing it.

A sentence beat requires one complete owned caption text and that exact caption interval. Removing captions does not bypass this requirement: supply the actual complete sentence captions, or real word alignment evidence with measured-word references. Full sentence cues can be owned by different compatible shots as before; this rule does not join all narration into a single shot. Preserve all source cues and the existing caption ownership rules. When a complete cue describes several ideas, select an overall neutral expression; structural checks cannot determine whether a left/right label expresses the speaker's meaning. A retained full-source ASR file may include words outside an explicitly selected output range: keep its original words/indices and clock, and only reference words that fall inside the selected output after the measured offset. The normal entry's existing complete-narration or approved-excerpt rules still apply; an offset is not permission to crop speech.

Use the normal verified personal helper, without extracting runtime source:

```text
Read the extracted root file: params.schema.json
Read the extracted root file: NARRATION-MAP.md
python3 -B kinetic_bootstrap.py check-params --input <instance>/inputs/user.json
python3 -B kinetic_bootstrap.py plan --input <instance>/inputs/user.json --out <instance>/plan.json
python3 -B kinetic_bootstrap.py prepare --input <instance>/inputs/user.json --out <instance>/project
```

The plan reports `narrationAlignment.timingEvidence`, including both file/source hashes, tool/method, clock/offset and referenced word indices. Preparation retains the exact word result at `project/user-assets/narration-timing-evidence.json`; `project/binding-report.json.narrationTimingEvidence` records its digest and path. Keep the actual ASR/aligner command/task receipt next to the input evidence. Hash/file/reference checks prove consistency and traceability only. The template cannot prove that a supplied file was genuinely measured, that a self-reported tool ran, or that recognized words and chosen visuals are correct. Inspect/listen to the encoded film at real phrase transitions separately; do not claim semantic acceptance from a successful plan or export.

中文：本约束只补 626 正常入口，不改源音频、原字幕、动作或其它模板。原声时钟可有非零起点；用实际 source-media-seconds 与 offsetSeconds 明确平移，原区间、语速和容器时钟不变。正常 check-params / plan / prepare 会检查证据文件、原声身份、词索引和真实首尾区间，prepare 留存原文件与摘要。只有整句证据时使用完整整句保底；不能把自行均分、估算、猜读速写进 measured-word。工具名与文件哈希不能自动证明“真实测量”或“语义正确”，实际命令/任务凭据应随证据保留，最终听看仍独立记录。


## Caption timing evidence / 句级字幕时间来源

`captionTimingEvidence` identifies an actual local checked `.srt` or unmodified ASR/alignment JSON. Required fields: `file`, `sha256`, `sourceMediaSha256`, `method`, `clock`. Hash the exact evidence file and **bound original voice file**, not the music, mixed export or a guessed source identity. Relative evidence paths stay inside the input directory.

- `method: reviewed-sentences`: use the real checked SRT directly, or JSON `{ "captions": [{ "text": "...", "start": 0, "end": 1 }] }`. Include `review: { "basis": "listened-to-bound-source", "scope": "all-cues", "notes": "Describe the listening check actually performed" }`. Only record this after listening against that audio. A review object is a traceable declaration, not an authenticity certificate.
- `method: asr-sentence` or `forced-alignment`: retain actual tool output as SRT or JSON `segments`/`captions` with complete text/start/end seconds, plus the actual `tool: { "name": "...", "version": "..." }`. Keep the real invocation/task receipt beside the evidence; a tool name does not prove it ran.
- `clock: bound-narration-seconds` has zero offset. `source-media-seconds` requires finite measured `offsetSeconds`, including zero: output = source time + offsetSeconds. No speed/scale change exists. Keep full-source records outside an explicitly selected range; output cues must match all complete records inside it.
- Caption text and boundaries must match the checked whole sentences within one frame. Negation, comparison words and qualifiers cannot be removed. Display-only punctuation/whitespace normalization remains unchanged. For real word evidence, every caption must match complete consecutive actual words and their first/last boundaries; no words inside the bound range may disappear. Existing wordIndices and measured-word evidence rules remain in force.
- Explicit `method: asr-word` reads actual top-level `words` or Whisper-style `segments[].words`. Captions may regroup these consecutive words across original segment boundaries, keeping their actual first/last word times. SRT and sentence-only segments cannot substitute for word records.

The normal plan reports `narrationAlignment.timingEvidence.captionTiming`; prepare retains the exact original SRT/JSON at `user-assets/caption-timing-evidence.srt` or `.json`, records its digest under `binding-report.json.narrationTimingEvidence.captionTiming`, and checks retained evidence before preview/export. Do not edit a prepared receipt or change labels to bypass a failure; correct a fresh input using actual source review.

The source-activity alarm tolerates 0.25s around captions and flags sustained uncovered signal (at least 1s span with 0.8s activity). It uses adaptive per-channel energy on the unchanged original audio, not container duration, invented speech duration, mixed music or scene effects. Sentence/word evidence is validated before the alarm is resolved. Silence at the tail remains valid. A reviewed label, listening declaration, ASR silence/no-words or uploaded reference waveform cannot waive uncovered sound.

For ordinary recorded music or environmental tails, the assistant can retain an actual **full-source listening review** or **local acoustic analysis** without changing the original source, requiring paid ASR or adding a user technical workflow. Do this only when the capability and original records exist. Otherwise keep the original audio/draft and report that listening/analysis is still needed; never invent a review. ASR no-words alone is insufficient.

`captionTimingEvidence.nonSpeechEvidence` binds the actual JSON findings with `file`, `sha256`, `sourceMediaSha256`, `clock: bound-narration-seconds`. The findings use `profile: motiongit.source-audio-review/1`, exact `sourceMediaSha256` and `captionEvidenceSha256`, `reviewedRange: {start: 0, end: <full original audio end>}`, `speechCues: [{text,start,end}]` retaining every complete cue, and `nonSpeechIntervals: [{start,end,kind,observation}]`. `kind` is music/environment/other-non-speech; observations describe the sound actually reviewed, not an ignore label. No review interval may erase a speech cue. Every uncovered active run, including shorter runs, must be accounted for, so a musical tail cannot conceal a separate omitted phrase.

`analysis` records `method: full-source-listening`, concrete `notes`, and the actual original listening log/record via `record: {file,sha256}`. Or use `method: local-analysis`, actual `tool: {name,version}`, notes, the original unmodified tool result as `record`, and `basis: acoustic-classification` or `source-reference-comparison`. Reference comparison also keeps the actual `referenceFiles: [{file,sha256}]` including the reference audio and provenance records. This contract does not require one particular classifier, model or waveform class. Do not fabricate a tool result or treat an ASR gap as acoustic classification.

Plan/binding reports keep the full-source findings and all original record/reference digests. Prepare retains the findings at `user-assets/caption-non-speech-review.json`, the original record and references beside it. Preview/export verifies **all** retained files before running. This is the same provenance standard as reviewed-sentences: files, hashes and interval consistency are auditable, but cannot authenticate that listening/tool execution occurred or that classification/recognition is correct. It is not a semantic acceptance certificate. Listen to the actual final first/last speech and negation/comparison transitions separately.

中文：普通录制音乐、环境音尾段可使用实际全源听校或本地声学分析记录恢复，不要求合成乐谱，也不限定 PCM 或迫使付费识别。助手保留实际原始记录、全源范围、完整语句与非语音观察区间，绑定原声和字幕；ASR 无词、改标签和 ignore 布尔不能代替这些记录。没有实际能力时如实待核对，不虚构听校。准备后连同原始记录和参考素材保留，预览/导出前检查所有摘要；这仍不能认证听校真实发生或语义正确，原声和源时钟不修改。




<!-- motiongit.narration-purpose-contract/1 -->
## Exact visual-purpose contract / 画面用途合法值

`narrationMap[].purpose` accepts exactly these source-defined values:

- `neutral-emphasis`
- `neutral-list`
- `ordered-process`
- `real-comparison`
- `provided-evidence`
- `decision-rejection`
- `confirmed-completion`
- `outreach-support`
- `summary`
- `user-requested-action`
- `software-project-workflow`

These values describe the actual intended meaning. They are not interchangeable style tags. The original scene restrictions still apply:

| Scene | Allowed purposes |
| --- | --- |
| `S05` | `software-project-workflow` |
| `S08` | `decision-rejection` |
| `S10` | `real-comparison` |
| `S13` | `software-project-workflow` |
| `S15` | `ordered-process`, `real-comparison`, `confirmed-completion` |
| `S16` | `software-project-workflow`, `confirmed-completion` |

Controls `stamp`, `check`, and `checklist` additionally require `confirmed-completion` or `user-requested-action`. A scene absent from this table has no additional enum restriction from this validator; its visible action must still match the real speech. Enum/clock validation does not establish semantic correctness.

Examples: a neutral B1 explanation can use `neutral-emphasis`; S10 requires an actual two-sided comparison and `real-comparison`; S08 uses `decision-rejection` for an actual rejection; an unfulfilled instruction must not be relabeled `confirmed-completion`. These are semantic examples, not complete timed inputs. Retain every full original cue, qualifiers, negation and measured beats; use `compose` where supported to build a compatible input from the real narration. Never guess alternative labels until validation passes or fabricate word times.

中文：先按实际口播含义选上述合法值，再按场景限制选画面。合法值不是可任意替换的风格标签；未完成的请求不能标成已经完成。B1 中性解释可用 neutral-emphasis；S10 只用于真实比较，S08 用于真实拒绝。校验通过不代表语义正确，仍须审核实际画面与完整声音；不删原话、不改时钟，也不靠反复猜枚举过关。
