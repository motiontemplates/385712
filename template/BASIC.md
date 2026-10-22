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

# B1–B4 text capacity / 基础表达的文字容量

These limits describe the current adapter and reviewed layouts. They constrain short on-screen fields, not the complete narration or film duration. Keep the complete script in real captions and narrationMap. Recompose compatible shots, use faithful short labels, or use one or two explicit semantic lines; preserve negation, qualifiers, entities and quantities. Do not ask the user to shorten the whole narration to satisfy a card label.

## Global defaults and scene overrides / 全局与逐镜头内容

`basic` supplies global defaults. Each occurrence's `scenes[i].basic` overrides matching keys; the effective object is `{...basic, ...scenes[i].basic}`. Each B1–B4 occurrence validates its own effective fields. A blank override replaces a good global value and is rejected when that field is required. Repeated B2 scenes can have different headings and different point counts. Do not supply unused long fields in a shared global basic object: all present scalar basic fields are checked against the selected language limits.

| Scene | Required nonblank effective fields |
| --- | --- |
| B1 | keyword, explanation |
| B2 | heading, points (1–5 nonblank entries) |
| B3 | heading, left, right, conclusion |
| B4 | summary, action |

`label` is optional in every basic expression. Titles and subtitles are separate fields. `scenes[].intent` retains its existing purpose contract; duration and quiet holds retain the existing catalog contract. This revision changes no scene behavior or display capacity.

## Actual limits / 实际容量

| Field | Chinese `language=zh` | English `language=en` |
| --- | ---: | ---: |
| keyword | 8 | 36 |
| heading | 10 | 42 |
| left, right | 8 each | 36 each |
| explanation | 42 | 138 |
| conclusion | 48 | 156 |
| summary | 10 | 42 |
| action | 42 | 138 |
| label | 32 | 108 |
| each points entry | at most 2 explicit lines, at most 18 characters per line | at most 2 explicit lines, at most 44 characters per line |

Every scalar field allows at most two explicit lines. Scalar maximum length counts the newline itself; it is a total-field limit, not a per-line allowance. Points use a per-line limit instead: the theoretical two-line totals are 37 Chinese or 89 English characters including the newline. Spaces and punctuation count. Entries must contain non-whitespace text. No third line is allowed, including a trailing newline that creates a third empty line. The runtime also checks actual rendered glyph width; a character count does not guarantee all fonts/words fit, so preview the actual text.

中文标量上限依次为关键词8、标题10、左右标签各8、解释42、结论48、总结10、行动42、角标32；英文分别为36、42、36、36、138、156、42、138、108。标量最多显式两行，换行符计入总长度。B2 每项最多两行，中文每行18字符、英文每行44字符，不自动断行。空白覆盖值不会回退到全局。字数限制只约束上屏槽，完整口播必须保留，按句意组合镜头。

Existing title limits also remain: `title`, `presenterLabel`, and `scenes[].title` at most45 characters for landscape; Chinese and English portrait have film/chapter titles at most18 and presenterLabel at most10. English portrait is supported for B1–B4 basic-expression groups only; English native groups remain landscape only. These values do not limit the complete captions or narration.

Example valid Chinese B2 effective fields:

```json
{"heading":"先看三个要素","points":["观察光线方向","观察主体位置","观察背景层次"]}
```

Use `params.schema.json` language conditions for both root basic and scenes[].basic, then run the verified personal helper's normal `check-params`, `plan`, `prepare`, `preview` and `render` operations. Preserve prior outputs and use fresh revision paths. A valid schema or successful plan is not a visual or listening approval.

## B2 counted points and actions / 计数内要点与行动

Optional `basic.pointRoles` is an array with exactly one `point` or `action` for each effective `points` entry. Root basic and scenes[i].basic follow the same shallow override rule. Omission defaults every row to point and preserves the previous appearance. Unknown values, null, and different effective lengths are rejected. If a scene overrides points but inherits global pointRoles, the inherited roles must still have the same length; supply a matching scene override when necessary. Do not silently drop the roles or guess them from text.

Points receive consecutive counted-point badges 01,02,03, skipping action rows. Actions display `行动` in Chinese or `ACTION` in English, with no numeric ordinal. An action may be first, middle or last; several actions and an all-action list are supported. The existing maximum remains five total rows, including actions, with the same point text length/line rules. The label uses a reserved localized badge width; actual text widths are still checked (ordinary point text790 source pixels; action text776 Chinese /752 English). Preview real text before export.

```json
{"heading":"先看三个要素","points":["观察光线方向","观察主体位置","观察背景层次","现在拍一张试试"],"pointRoles":["point","point","point","action"]}
```

Three counted points plus a final action are not four counted points. Build headings from the actual counted points and the user's meaning. A role is an explicit assistant content decision, not automatic semantic recognition. Preserve the complete narration and its real sentence/phrase times.

`points.i` always refers to the zero-based actual row index, including actions. If row1 is action and row2 is the second counted point, targets remain `points.1` and `points.2`; never replace them with the printed ordinal. Native card entry/exit timings and one sound cue per actual row remain unchanged. Selecting action does not declare anything completed or checked.

中文：B2 可用 pointRoles 逐项明确 point/action，与有效 points 等长；不填时沿用全部要点和原编号。行动使用“行动”标记，英文使用“ACTION”，不计入要点编号；不改行位置、原声、镜头时长、points.i 焦点或逐行动作音效。全局继承和逐镜头覆盖后仍须等长。三个要点加一个结尾行动时，标题应表达三个计数内要点，结尾行动另作行动；不得因模板容量剪短完整口播。

## B3 visible comparison focus / 对比面板的可见焦点

Existing left/right phrase targets add a visible outline and soft glow to the active comparison panel. The native glass shadow, silver/gold text gradients and all entry/exit motion remain. Leaving the target restores the original panel shadow. Heading and conclusion retain their existing effects; no beats means no added panel emphasis. A reported target is timing metadata, not proof of visible emphasis: inspect the actual panel pixels. No new parameter or timing rule is introduced.

B3 的 left/right 沿用原焦点索引，仅当前面板出现强调边框与柔光；原金属配色、玻璃底影和原动作保留。离开焦点恢复，无 beats 不附加面板强调。请核对真实预览像素，不能把 target 报告本身当作可见证明。
