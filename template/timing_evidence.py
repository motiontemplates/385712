"""626 word timing provenance and sentence-only fallback; no timing inference."""
from pathlib import Path
import hashlib
import json
import math
import re
import shutil
from narration_alignment import cue, normal
from caption_timing import validate as validate_caption_timing, retain as retain_caption_timing

PROFILE = 'motiongit.kinetic-timing-evidence/1'


def fail(message):
    raise ValueError('NARRATION_TIMING_EVIDENCE_REQUIRED: ' + message +
                     ' Preserve the original audio and ASR. With sentence-only captions, use each complete cue text and its exact interval for an overall heading/card; do not estimate internal left/right or word times. Read NARRATION-MAP.md.')


def sha(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def number(value):
    return type(value) in [int, float] and math.isfinite(value)


def input_file(root, value):
    if not isinstance(value, str) or not value.strip():
        fail('Supply the actual local alignment JSON file')
    relative = Path(value)
    raw = relative if relative.is_absolute() else root / relative
    path = raw.resolve()
    if raw.is_symlink() or not path.is_file() or (not relative.is_absolute() and not path.is_relative_to(root)):
        fail('Alignment evidence must be a real input file; relative paths stay inside the input directory')
    if path.stat().st_size > 32 * 1024 * 1024:
        fail('Alignment JSON exceeds the 32 MiB evidence limit')
    return path


def load_words(raw, duration, tolerance, offset):
    # Consume actual word objects from the retained tool result. No character
    # splitting, equal allocation, interpolation or timestamp generation exists.
    if not isinstance(raw, dict):
        fail('Alignment JSON must contain actual words or segments[].words')
    if isinstance(raw.get('words'), list):
        words = raw['words']
    elif isinstance(raw.get('segments'), list) and raw['segments'] and all(isinstance(s, dict) and isinstance(s.get('words'), list) for s in raw['segments']):
        words = [word for segment in raw['segments'] for word in segment['words']]
    else:
        fail('Sentence segments or SRT without word intervals are not word alignment evidence')
    if not words:
        fail('Alignment evidence contains no measured word intervals')
    result = []
    previous = -math.inf
    for word in words:
        if not isinstance(word, dict):
            fail('Each alignment word must be an object')
        text = word.get('text', word.get('word'))
        start, end = word.get('start'), word.get('end')
        if not number(start) or not number(end):
            fail('Actual word boundaries must be finite numbers in seconds')
        start, end = start + offset, end + offset
        if not isinstance(text, str) or not text.strip() or start > end or start < previous:
            fail('Actual words need ordered finite start/end seconds on the declared source clock')
        result.append({'text': text, 'start': start, 'end': end})
        previous = start
    return result


def check_word_use(item, text_key, start_key, end_key, words, tolerance, duration):
    indices = item.get('wordIndices')
    if not isinstance(indices, list) or not indices or any(type(i) is not int or not 0 <= i < len(words) for i in indices) or indices != list(range(indices[0], indices[-1] + 1)):
        fail('Every measured-word beat/caption unit needs contiguous zero-based wordIndices into the original alignment result')
    selected = [words[i] for i in indices]
    if any(not -tolerance <= word['start'] <= word['end'] <= duration + tolerance for word in selected):
        fail('Referenced measured words lie outside the selected bound output range after its declared source offset')
    if normal(item.get(text_key, '')) != normal(''.join(word['text'] for word in selected)):
        fail('Measured-word text must match its actual referenced words; do not summarize or silently correct raw ASR')
    if not number(item.get(start_key)) or not number(item.get(end_key)) or abs(item[start_key] - selected[0]['start']) > tolerance or abs(item[end_key] - selected[-1]['end']) > tolerance:
        fail('Measured-word boundaries must be the referenced actual first/last word boundaries, within one frame; no estimated subdivisions or padding')
    return indices


def validate(data, root, bound_voice, duration, fps=60):
    tolerance = 1 / fps + .002
    captions = [cue(caption, data['language']) for caption in data.get('captions', [])]
    word_uses = []
    sentence_count = 0
    for row in data.get('narrationMap') or []:
        if not isinstance(row, dict):
            continue  # The existing ownership validator provides this error.
        for beat in row.get('beats', []) if isinstance(row.get('beats', []), list) else []:
            if not isinstance(beat, dict):
                continue
            if beat.get('timing') == 'measured-word':
                word_uses.append((beat, 'spokenText', 'at', 'until'))
            elif beat.get('timing') == 'sentence':
                if not captions:
                    fail('A sentence beat requires actual complete sentence captions; deleting captions does not turn guessed phrase times into measured sentences')
                refs = row.get('captionIndices', [])
                matching = [captions[i] for i in refs if type(i) is int and 0 <= i < len(captions) and number(beat.get('at')) and number(beat.get('until')) and number(captions[i]['start']) and number(captions[i]['end']) and abs(beat['at'] - captions[i]['start']) <= tolerance and abs(beat['until'] - captions[i]['end']) <= tolerance and normal(beat.get('spokenText', '')) == normal(captions[i]['text'])]
                if not matching:
                    fail('A sentence beat must retain one complete caption text and that same cue interval; a substring inside a sentence is not a separately measured phrase')
                sentence_count += 1
    for caption in data.get('captions', []):
        units = caption.get('units', [])
        if units and isinstance(units, list):
            for unit in units:
                if isinstance(unit, dict):
                    word_uses.append((unit, 'text', 'start', 'end'))
    evidence = data.get('narrationTimingEvidence')
    caption_timing = validate_caption_timing(data, root, bound_voice, duration, fps)
    if not word_uses and evidence is None:
        return {'profile': PROFILE, 'mode': 'sentence-only', 'completeSentenceBeatsChecked': sentence_count,
                'wordTimingClaimed': False, 'captionTiming': caption_timing, 'measurementAuthenticityOrMeaningAccepted': False,
                'meaningReview': 'Inspect/listen to whole cues; a cue containing several ideas must not assign guessed internal side changes'}
    if not isinstance(evidence, dict):
        fail('measured-word and caption units require narrationTimingEvidence, with an actual file/hash, bound source identity, method, tool and clock')
    if bound_voice is None:
        fail('Word timing evidence must be traceable to the actual bound original narration file')
    if evidence.get('method') not in ['asr-word', 'forced-alignment']:
        fail('Only actual asr-word or forced-alignment evidence is supported; equal splits, estimates and manual timing labels are not evidence')
    tool = evidence.get('tool')
    if not isinstance(tool, dict) or any(not isinstance(tool.get(key), str) or not tool[key].strip() for key in ['name', 'version']):
        fail('Retain the actual ASR/aligner tool name and version')
    clock = evidence.get('clock')
    offset = evidence.get('offsetSeconds', 0)
    if clock not in ['bound-narration-seconds', 'source-media-seconds'] or not number(offset):
        fail('Declare bound-narration-seconds or source-media-seconds and a finite offsetSeconds; output = raw word time + offsetSeconds')
    if clock == 'bound-narration-seconds' and offset != 0:
        fail('A nonzero offset requires source-media-seconds; document the actual source origin instead of silently shifting word timing')
    if clock == 'source-media-seconds' and 'offsetSeconds' not in evidence:
        fail('source-media-seconds requires its measured offsetSeconds, including zero when the origins coincide')
    for key in ['sha256', 'sourceMediaSha256']:
        if not isinstance(evidence.get(key), str) or not re.fullmatch('[0-9a-f]{64}', evidence[key]):
            fail('Evidence needs actual lowercase SHA-256 values for its JSON and bound source media')
    if sha(bound_voice) != evidence['sourceMediaSha256']:
        fail('Alignment sourceMediaSha256 differs from the actual bound original narration')
    path = input_file(root, evidence.get('file'))
    if sha(path) != evidence['sha256']:
        fail('Alignment file SHA-256 differs; retain the real unmodified result')
    try:
        raw = json.loads(path.read_text(encoding='utf-8-sig'))
    except (UnicodeError, ValueError) as error:
        fail('Cannot read the actual alignment JSON: ' + str(error))
    words = load_words(raw, duration, tolerance, offset)
    # Where the raw tool records an input identity, it must agree as well.
    for key in ['sourceMediaSha256', 'sourceAudioSha256', 'audioSha256', 'audioSHA256']:
        if key in raw and raw[key] != evidence['sourceMediaSha256']:
            fail('The raw aligner result records a different original source hash')
    used = set()
    for item, text_key, start_key, end_key in word_uses:
        used.update(check_word_use(item, text_key, start_key, end_key, words, tolerance, duration))
    return {'profile': PROFILE, 'mode': 'file-backed-word-timing', 'file': str(path),
            'sha256': evidence['sha256'], 'sourceMediaSha256': evidence['sourceMediaSha256'],
            'method': evidence['method'], 'tool': tool, 'clock': clock, 'offsetSeconds': offset,
            'clockTransform': 'bound output seconds = raw word seconds + offsetSeconds; original intervals retained without speed changes',
            'rawWordCount': len(words), 'usedWordIndices': sorted(used), 'checkedWordUses': len(word_uses),
            'completeSentenceBeatsChecked': sentence_count, 'fileIdentityAndWordReferencesVerified': True,
            'captionTiming': caption_timing,
            'measurementAuthenticityOrMeaningAccepted': False,
            'meaningReview': 'File hashes and word references are structural provenance, not proof that ASR is accurate or the selected visual target conveys the words. Listen and inspect the encoded film.'}


def retain(report, output):
    report = {**report, 'captionTiming': retain_caption_timing(report.get('captionTiming', {}), output)}
    if report.get('mode') != 'file-backed-word-timing':
        return report
    source = Path(report['file'])
    if source.is_symlink() or not source.is_file() or sha(source) != report['sha256']:
        fail('Alignment evidence changed between planning and preparation')
    target = output / 'user-assets/narration-timing-evidence.json'
    shutil.copyfile(source, target)
    if sha(target) != report['sha256']:
        fail('Retained alignment evidence does not match the actual input')
    return {**report, 'retainedFile': target.relative_to(output).as_posix(), 'retainedSha256': sha(target)}
