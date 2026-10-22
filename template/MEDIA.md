Public source note / 公开源码说明：local media binding works without a Key. Any assistant/motion.mjs API example below applies only to an official verified personal package; it is not a command supplied by this archive. Bind existing local music directly when using this public source. 本包没有 API 身份，已有本地配乐可直接绑定。

# Global media bindings / 全局媒体绑定

Read `params.schema.json.properties.media` before building user.json. Every production explicitly chooses `media.presenter`, `media.voice`, and `media.music`. They are global inputs, independent of a scene's conditional visual ports. `core/catalog.json.mediaPorts` remains the existing scene-specific visual-port contract; it is not the list of all global media. Choose scenes from meaning, then supply only their required extra visual roles. Do not guess a binding from the outer distribution manifest.

## Existing modes / 已实现模式

| Input | Modes and fields | Real behavior |
| --- | --- | --- |
| `media.presenter` | `none`; `image` + `file`; `video` + `file` | Explicit no presenter, a local PNG/JPEG/WebP, or a local video covering the whole output clock. Optional `face:{cx,cy,h}` uses normalized original-frame coordinates in (0,1]; optional `tracking:[{time,cx,cy,h}]` is sorted on output seconds. Missing face hints use the existing approximate detector. |
| `media.voice` | `none`; `file` + `file`; `presenter` | `presenter` preserves embedded sound from `media.presenter.mode=video`; `file` uses a separate complete narration track. Voice duration matches the whole scene plan within 0.05 s. If the supplied presenter video has sound, `none` also needs `discardPresenterAudio:true`, only for a real user-requested mute. |
| `media.music` | `none`; `file` + `file` + `license` | A nonzero local audio file covering the whole film and its actual nonempty rights text/object. The official prepared license object is accepted unchanged. No automatic demo-track fallback. |

人物、旁白、配乐必须分别明确选择。人物视频原声用 `voice.mode="presenter"`，不要把“保留原声”误写为 `none`。人物可用 `none/image/video`，配乐只用 `none/file`；没有 avatar、music、generated 等额外模式。不要把原生动作音效当作旁白或配乐。`soundEffects:"native"` 保留动作音效；三个声音选择分别处理。

Files are existing local paths: absolute, or relative to the directory containing user.json. Relative paths may not escape that directory; symlink inputs are rejected. For a verified personal package follow its normal input vault and official helper route. Preparation copies/extracts bound inputs to a fresh writable project; no protected source inspection or extraction is needed to discover these fields.

## Official prepared music → exact binding / 官网配乐返回值到绑定字段

Use the current verified personal helper capability, after actual narration duration is known. The official command is:

```text
node assistant/motion.mjs api <personal.motion> music-prepare <instance/music-request.json> <instance/music-v1>
```

The parent instance must exist; music-v1 must be a new directory. Request JSON uses `text` (actual copy), `template_category`, `template_style`, `duration_s` (the full planned film), and `language`. Capability, authorization and current service results come from the real personal helper. This prepares an existing licensed track; it does not mix or render the video. Do not invent credentials or switch to paid generation.

On success the returned object and saved `music-v1/prepared-music.json` have `profile:"motiongit.prepared-music/1"`, `status:"ready"`, `output` (the actual absolute path to background.wav), `duration_s`, `sha256`, `license`, `attribution`, `source_url`, `original`, `fit`, and preparation/mix-review metadata. Preserve `recommendation.json`, `download.json`, and `prepared-music.json` beside the production. `failure.json` means no usable prepared music; do not bind a partial file.

| Official returned field | This template input / retained evidence |
| --- | --- |
| `output` | `user.media.music.file` |
| successful prepared file | `user.media.music.mode = "file"` |
| `license` | `user.media.music.license` — copy the actual object unchanged |
| `sha256` | Verify the selected local output's SHA-256; keep the receipt. The adapter records the actual bound input hash. |
| `duration_s` | Check coverage of the actual full film; re-prepare to a fresh path when narration duration changes. |
| `attribution`, `source_url`, `original`, `fit` | Keep the original receipts as provenance, including track ID and original source hash. They are not audio mix controls. |

After loading the actual saved result as `prepared`, the complete mapping is:

```javascript
user.media.music = {mode: "file", file: prepared.output, license: prepared.license};
```

Do not bind the JSON receipt path as the audio file, put the whole result in `file`, rename `license` to `licenseFile`, or invent `mode:"music"`. Use the actual returned values, never literal placeholders. Existing extra provenance fields remain compatible but are not required to control the mix.

官网 `music-prepare` 成功后，直接把返回的 `output` 填入 `media.music.file`，把返回的 `license` 原对象填入 `media.music.license`，`mode` 固定为 `file`。保存返回 JSON 和全部许可、来源、指纹记录；有 `failure.json` 不算成功。配音总时长改变后，按新时长另存准备配乐，不靠截短口播适配曲目。

The current renderer consumes prepared music from its beginning; it has no music offset, start, gain, volume, loop-count or generate input. Duration fitting/authorized looping belongs to the official preparation result. Existing mixing normalizes the voice and music, lowers music during voice energy, retains separately selected native SFX, and applies the final fade/limiter. Do not promise user-adjustable controls which do not exist. Listen to the complete encoded mix and any prepared loop seams; sample checks and successful rendering do not establish intelligibility or semantic correctness.

## Binding examples / 绑定示例

These are media fragments, not full user.json files. Replace the example paths with actual files in the current production.

```json
{"presenter":{"mode":"video","file":"/absolute/current-talk.mp4"},"voice":{"mode":"presenter"},"music":{"mode":"file","file":"/absolute/instance/music-v1/background.wav","license":{"commercial_use":"allowed","adaptation":"allowed","standalone_redistribution":"allowed"}}}
```

The example license shows the object shape only; use the real returned license and keep its complete fields. For text animation with separate narration: `presenter:{"mode":"none"}`, `voice:{"mode":"file","file":"/absolute/current-voice.wav"}`. For an explicit no-score choice: `music:{"mode":"none"}`. All three `none` choices plus `soundEffects:"none"` make the explicitly requested silent case; no presenter alone does not mute anything.
