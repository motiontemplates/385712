"""File-backed sentence clocks and conservative original-audio coverage checks.

Neither a label, a digest nor signal activity proves speech recognition or meaning.
No ASR, audio rewrite, word interpolation or paid service is performed here.
"""
from pathlib import Path
import hashlib
import json
import math
import shutil
import numpy as np
from audio_integrity import _chunks, probe
from narration_alignment import cue, normal, read_srt

PROFILE = 'motiongit.caption-timing-review/1'


def fail(message):
    raise ValueError('CAPTION_TIMING_REVIEW_REQUIRED: ' + message +
        ' Keep the original audio and draft. Obtain actual local ASR/alignment, or listen to every complete cue against the bound original audio and retain the checked SRT. Do not stretch, rescale, relabel or invent timestamps. Read NARRATION-MAP.md.')


def sha(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def audio_coverage(path, captions, duration):
    """Flag substantial uncovered signal, not silence or container duration.

    Decode the bound source, with its original container origin and all channels.
    This is a conservative mismatch alarm, not VAD or a sentence-boundary finder.
    """
    _, stream = probe(path)
    if not stream:
        fail('Bound narration has no audio stream')
    rate, window = 8000, 160  # 20ms measurements, unrelated to any film length.
    channels = int(stream.get('channels', 1))
    pending = np.empty(0, dtype=np.float64)
    energy = []
    for chunk in _chunks(path, duration=duration, rate=rate, channels=channels):
        values = np.concatenate((pending, np.asarray(chunk, dtype=np.float64)))
        if not np.isfinite(values).all():
            fail('Bound narration contains nonfinite decoded samples')
        count = len(values) // (window * channels)
        blocks = values[:count * window * channels].reshape(count, window, channels)
        energy.extend(np.sqrt(np.max(np.mean(blocks * blocks, axis=1), axis=1)).tolist())
        pending = values[count * window * channels:]
    if len(pending) >= channels:
        block = pending[:len(pending)//channels*channels].reshape(-1, channels)
        energy.append(float(np.sqrt(np.max(np.mean(block * block, axis=0)))))
    positive = np.asarray([value for value in energy if value > 1e-10])
    threshold = float(np.quantile(positive, .85) * .12) if len(positive) else 0
    active = np.asarray(energy) > max(threshold, 1e-10)
    covered = np.zeros(len(active), dtype=bool)
    centers = (np.arange(len(active)) + .5) * window / rate
    for row in captions:
        covered |= (centers >= row['start'] - .25) & (centers <= row['end'] + .25)
    missing = np.flatnonzero(active & ~covered)
    groups = []
    for index in missing.tolist():
        if not groups or (index - groups[-1][-1]) * .02 > .12:
            groups.append([index])
        else:
            groups[-1].append(index)
    runs = [{'start': group[0]*.02, 'end': (group[-1]+1)*.02,
             'activeSeconds': len(group)*.02} for group in groups]
    suspect = [row for row in runs if row['end']-row['start'] >= 1 and row['activeSeconds'] >= .8]
    return {'profile': PROFILE, 'method': 'original-source-per-channel-20ms-energy',
            'sourceMediaSha256': sha(path), 'sourceClockUnchanged': True,
            'thresholdRms': threshold, 'captionBoundaryToleranceSeconds': .25,
            'uncoveredActiveSeconds': len(missing)*.02,
            'uncoveredRuns': runs, 'substantialUncoveredRuns': suspect,
            'lastActiveSeconds': (np.flatnonzero(active)[-1]+1)*.02 if active.any() else 0,
            'lastCaptionSeconds': max(row['end'] for row in captions),
            'speechOrSentenceAlignmentProved': False, 'meaningAccepted': False}


def coverage_failure(coverage):
    row = coverage['substantialUncoveredRuns'][0]
    return (f"Original narration has substantial signal outside the captions at {row['start']:.2f}–{row['end']:.2f}s. "
            'The draft may end early or use another clock; activity is not proof of speech. '
            'Retain actual sentence evidence; a review label or missing ASR words cannot waive this alarm. '
            'Retain full-source listening or actual acoustic-analysis findings and their original records for non-speech intervals')


def review_record(root, descriptor):
    if not isinstance(descriptor, dict) or set(descriptor) != {'file', 'sha256'}:
        fail('Keep each actual original review/analysis record file and SHA-256')
    value = descriptor['file']
    if not isinstance(value, str) or not value.strip():
        fail('Review records need actual input files')
    raw = Path(value) if Path(value).is_absolute() else root / value
    path = raw.resolve()
    if (raw.is_symlink() or not path.is_file() or
            (not Path(value).is_absolute() and not path.is_relative_to(root)) or
            not 1 <= path.stat().st_size <= 32*1024*1024 or sha(path) != descriptor['sha256']):
        fail('Original review/analysis record is missing, empty, unsafe or changed')
    return {'file': str(path), 'sha256': sha(path)}


def non_speech_evidence(descriptor, root, voice, caption_digest, captions, duration, coverage, tolerance, language):
    """Check retained full-source findings and their original record files.

    This uses the same provenance standard as reviewed sentence clocks. It does
    not authenticate a person/tool or turn ASR silence into proof of no speech.
    """
    from audio_integrity import source_clock
    path, offset = evidence_file(root, descriptor, voice)
    if descriptor.get('clock') != 'bound-narration-seconds' or offset:
        fail('Full-source audio review uses the unchanged bound narration clock')
    try:
        raw = json.loads(path.read_text(encoding='utf-8-sig'))
    except (ValueError, UnicodeError) as error:
        fail('Cannot read full-source audio review: '+str(error))
    if (not isinstance(raw, dict) or raw.get('profile') != 'motiongit.source-audio-review/1'
            or set(raw) != {'profile','sourceMediaSha256','captionEvidenceSha256','reviewedRange','speechCues','nonSpeechIntervals','analysis'}):
        fail('Bind the actual full-source review findings, not a non-speech/review label')
    if raw.get('sourceMediaSha256') != sha(voice) or raw.get('captionEvidenceSha256') != caption_digest:
        fail('Full-source review source or caption evidence identity differs')
    source_end = source_clock(voice)['audio']['endSeconds']
    reviewed = raw.get('reviewedRange', {})
    if (not isinstance(reviewed, dict) or not finite(reviewed.get('start')) or not finite(reviewed.get('end'))
            or reviewed['start'] != 0 or abs(reviewed['end']-source_end) > tolerance):
        fail('Review the full original audio, including all speech and the audible tail')
    rows = raw.get('speechCues')
    if not isinstance(rows, list) or not rows:
        fail('Full-source findings must retain the complete reviewed speech cues')
    match_sentences(rows, captions, duration, 0, tolerance, language)
    analysis = raw.get('analysis', {})
    if (not isinstance(analysis, dict) or analysis.get('method') not in ['full-source-listening', 'local-analysis']
            or not isinstance(analysis.get('notes'), str) or not analysis['notes'].strip()):
        fail('Retain the full-source listening or actual local-analysis method and findings')
    record = review_record(root, analysis.get('record'))
    # Preserve unmodified tool/log files. When the original JSON already binds
    # source/caption identities, do not let an edited findings wrapper override
    # them. Plain listening logs remain auditable originals, not authenticated.
    if Path(record['file']).suffix.lower() == '.json':
        try:
            original = json.loads(Path(record['file']).read_text(encoding='utf-8-sig'))
        except (ValueError, UnicodeError):
            original = None
        if isinstance(original, dict):
            for key in ['sourceMediaSha256', 'sourceAudioSha256', 'audioSha256', 'audioSHA256']:
                if key in original and original[key] != raw['sourceMediaSha256']:
                    fail('Original analysis record identifies another source audio')
            if 'captionEvidenceSha256' in original and original['captionEvidenceSha256'] != caption_digest:
                fail('Original analysis record identifies another caption evidence file')
    references = []
    allowed = {'method', 'notes', 'record'}
    if analysis['method'] == 'local-analysis':
        allowed |= {'tool', 'basis', 'referenceFiles'}
    if set(analysis)-allowed:
        fail('Full-source analysis must retain actual findings, not ignore/review flags')
    if analysis['method'] == 'local-analysis':
        tool = analysis.get('tool', {})
        if (not isinstance(tool, dict) or any(not isinstance(tool.get(k), str) or not tool[k].strip() for k in ['name','version'])
                or analysis.get('basis') not in ['acoustic-classification', 'source-reference-comparison']):
            fail('Local analysis needs its actual acoustic tool/result; missing ASR words alone are not non-speech evidence')
        if analysis['basis'] == 'source-reference-comparison':
            refs = analysis.get('referenceFiles')
            if not isinstance(refs, list) or not 1 <= len(refs) <= 16:
                fail('Source-reference analysis must retain the actual reference audio and its provenance records')
            references = [review_record(root, ref) for ref in refs]
    intervals = raw.get('nonSpeechIntervals')
    if not isinstance(intervals, list) or not 1 <= len(intervals) <= 256:
        fail('Retain the actual reviewed non-speech intervals and concrete observations')
    previous = 0
    for row in intervals:
        if (not isinstance(row, dict) or set(row) != {'start','end','kind','observation'}
                or not finite(row.get('start')) or not finite(row.get('end'))
                or row['start'] < previous or row['end'] <= row['start'] or row['end'] > source_end+tolerance
                or row.get('kind') not in ['music', 'environment', 'other-non-speech']
                or not isinstance(row.get('observation'), str) or not row['observation'].strip()):
            fail('Non-speech findings need ordered source intervals, sound class and concrete observations')
        if any(row['start'] < c['end'] and row['end'] > c['start'] for c in captions):
            fail('Non-speech review cannot erase a retained complete speech cue')
        previous = row['end']
    # Do not use a valid tail finding to mask a separate shorter omitted phrase.
    for run in coverage['uncoveredRuns']:
        if not any(row['start'] <= run['start']+1e-8 and row['end'] >= run['end']-1e-8 for row in intervals):
            fail('Full-source review leaves uncovered source activity unresolved')
    return {'mode': 'file-backed-full-source-review', 'file': str(path), 'sha256': sha(path),
            'sourceMediaSha256': sha(voice), 'captionEvidenceSha256': caption_digest,
            'reviewedRange': reviewed, 'speechCues': rows, 'nonSpeechIntervals': intervals,
            'analysis': analysis, 'originalRecord': record, 'referenceFiles': references,
            'sourceAudioChanged': False, 'measurementAuthenticityOrMeaningAccepted': False,
            'limitation': 'Retained files, source/caption bindings and interval consistency do not authenticate listening, tool execution or non-speech classification. No actual review/analysis capability means review is still required.'}


def evidence_file(root, evidence, voice):
    value = evidence.get('file')
    if not isinstance(value, str) or not value.strip():
        fail('Supply the actual checked SRT or unmodified ASR/alignment result file')
    relative = Path(value)
    raw = relative if relative.is_absolute() else root / relative
    path = raw.resolve()
    if raw.is_symlink() or not path.is_file() or (not relative.is_absolute() and not path.is_relative_to(root)):
        fail('Evidence must be a real input file; relative paths stay inside the input directory')
    if path.stat().st_size > 32*1024*1024:
        fail('Caption timing evidence exceeds 32 MiB')
    if evidence.get('sha256') != sha(path) or evidence.get('sourceMediaSha256') != sha(voice):
        fail('Evidence file or bound original audio identity differs')
    offset = evidence.get('offsetSeconds', 0)
    clock = evidence.get('clock')
    if not finite(offset) or clock not in ['bound-narration-seconds', 'source-media-seconds']:
        fail('Declare a finite original source clock and its actual offset; never a rate/scale')
    if (clock == 'bound-narration-seconds' and offset != 0) or (clock == 'source-media-seconds' and 'offsetSeconds' not in evidence):
        fail('A source clock needs its measured offsetSeconds; a bound clock has zero offset')
    return path, offset


def match_sentences(rows, captions, duration, offset, tolerance, language):
    selected = []
    for raw in rows:
        if not isinstance(raw, dict):
            fail('Sentence evidence must contain complete text/start/end records')
        row = cue(raw, language)
        if not finite(row['start']) or not finite(row['end']) or row['start'] >= row['end'] or not normal(row['text']):
            fail('Sentence evidence needs finite ordered complete cues')
        row = {**row, 'start': row['start']+offset, 'end': row['end']+offset}
        if row['end'] <= 0 or row['start'] >= duration:
            continue  # Preserve full-source evidence outside an explicit offset.
        selected.append(row)
    if len(selected) != len(captions):
        fail('Retain every complete source sentence in the bound output range')
    for actual, expected in zip(captions, selected):
        if normal(actual['text']) != normal(expected['text']):
            fail('Caption text differs from the checked full sentence; preserve negation, qualifiers and both comparison sides')
        if any(abs(actual[key]-expected[key]) > tolerance for key in ['start', 'end']):
            fail('Caption times differ from the retained sentence clock; no guessed or compressed timings')


def match_words(raw, captions, duration, offset, tolerance):
    words = raw.get('words')
    if not isinstance(words, list):
        segments = raw.get('segments')
        if not isinstance(segments, list) or not segments or not all(isinstance(s, dict) and isinstance(s.get('words'), list) for s in segments):
            fail('Retained word evidence contains no actual word records')
        words = [word for segment in segments for word in segment['words']]
    selected = []
    previous = -math.inf
    for word in words:
        if not isinstance(word, dict) or not finite(word.get('start')) or not finite(word.get('end')):
            fail('Retained word evidence needs finite real word boundaries')
        start, end = word['start']+offset, word['end']+offset
        text = word.get('text', word.get('word'))
        if not isinstance(text, str) or start > end or start < previous:
            fail('Retained words must preserve their original ordered clock')
        previous = start
        if end > 0 and start < duration:
            selected.append({'text': text, 'start': start, 'end': end})
    cursor = 0
    for caption in captions:
        begin, text = cursor, ''
        while cursor < len(selected) and len(normal(text)) < len(normal(caption['text'])):
            text += selected[cursor]['text']
            cursor += 1
        if begin == cursor or normal(text) != normal(caption['text']):
            fail('Captions must retain all actual words, including negation and comparison qualifiers')
        if abs(caption['start']-selected[begin]['start']) > tolerance or abs(caption['end']-selected[cursor-1]['end']) > tolerance:
            fail('Caption sentence boundaries differ from actual referenced word boundaries')
    if cursor != len(selected):
        fail('Captions omit actual words at the end of the bound narration')


def validate(data, root, voice, duration, fps=60):
    captions = [cue(row, data['language']) for row in data.get('captions', [])]
    if voice is None or not captions:
        return {'profile': PROFILE, 'mode': 'no-bound-voiced-captions', 'meaningAccepted': False}
    coverage = audio_coverage(voice, captions, duration)
    evidence = data.get('captionTimingEvidence')
    word_fallback = evidence is None and isinstance(data.get('narrationTimingEvidence'), dict)
    if word_fallback:
        evidence = data['narrationTimingEvidence']
    if not isinstance(evidence, dict):
        if coverage['substantialUncoveredRuns']:
            fail(coverage_failure(coverage))
        fail('provided-captions/reviewed-transcript is only a label. Bind captionTimingEvidence to the actual reviewed SRT or real ASR result; an unverified draft is not an aligned sentence clock')
    path, offset = evidence_file(root, evidence, voice)
    method = evidence.get('method')
    if method == 'reviewed-sentences' and not word_fallback:
        review = evidence.get('review', {})
        if not isinstance(review, dict) or review.get('basis') != 'listened-to-bound-source' or review.get('scope') != 'all-cues' or not isinstance(review.get('notes'), str) or not review['notes'].strip():
            fail('Reviewed SRT needs an actual all-cues listening review against this bound original audio; do not declare a review that did not occur')
    elif method in ['asr-sentence', 'asr-word', 'forced-alignment']:
        tool = evidence.get('tool', {})
        if not isinstance(tool, dict) or any(not isinstance(tool.get(key), str) or not tool[key].strip() for key in ['name', 'version']):
            fail('Retain the actual local ASR/aligner tool name and version')
    else:
        fail('Use actual ASR/alignment or a complete listened-to sentence SRT; guessed labels are not evidence')
    tolerance = 1/fps + .002
    if path.suffix.lower() == '.srt':
        if word_fallback or method == 'asr-word':
            fail('Sentence SRT cannot replace word alignment evidence')
        match_sentences(read_srt(path), captions, duration, offset, tolerance, data['language'])
    else:
        try:
            raw = json.loads(path.read_text(encoding='utf-8-sig'))
        except (ValueError, UnicodeError) as error:
            fail('Cannot read timing evidence JSON: '+str(error))
        if not isinstance(raw, dict):
            fail('Timing evidence JSON must be an object')
        for key in ['sourceMediaSha256', 'sourceAudioSha256', 'audioSha256', 'audioSHA256']:
            if key in raw and raw[key] != evidence['sourceMediaSha256']:
                fail('The original ASR result identifies another source audio')
        if word_fallback or method == 'asr-word' or 'words' in raw:
            match_words(raw, captions, duration, offset, tolerance)
        else:
            rows = raw.get('segments', raw.get('captions'))
            if not isinstance(rows, list) or not rows:
                fail('Timing evidence needs actual complete sentence records')
            match_sentences(rows, captions, duration, offset, tolerance, data['language'])
    non_speech = None
    if 'nonSpeechEvidence' in evidence:
        descriptor = evidence['nonSpeechEvidence']
        if not isinstance(descriptor, dict):
            fail('nonSpeechEvidence must bind actual full-source listening/analysis findings and original records')
        non_speech = non_speech_evidence(descriptor, root, voice, sha(path), captions, duration, coverage, tolerance, data['language'])
    if coverage['substantialUncoveredRuns'] and non_speech is None:
        fail(coverage_failure(coverage))
    coverage['substantialActivityResolvedBySourceReview'] = bool(coverage['substantialUncoveredRuns'] and non_speech)
    return {'profile': PROFILE, 'mode': 'file-backed-caption-timing', 'file': str(path),
            'sha256': sha(path), 'sourceMediaSha256': evidence['sourceMediaSha256'],
            'method': method, 'clock': evidence['clock'], 'offsetSeconds': offset,
            'review': evidence.get('review'), 'tool': evidence.get('tool'),
            'completeCuesChecked': len(captions), 'originalAudioCoverage': coverage,
            'nonSpeechEvidence': non_speech,
            'measurementAuthenticityOrMeaningAccepted': False,
            'limitation': 'File/clock consistency and coarse activity checks do not certify that a self-declared review or ASR occurred, nor that its recognition/meaning is correct; inspect and listen to the actual encoded film.'}


def retain(report, output):
    if report.get('mode') != 'file-backed-caption-timing':
        return report
    source = Path(report['file'])
    if source.is_symlink() or not source.is_file() or sha(source) != report['sha256']:
        fail('Caption timing evidence changed after planning')
    suffix = '.srt' if source.suffix.lower() == '.srt' else '.json'
    target = output / ('user-assets/caption-timing-evidence'+suffix)
    shutil.copyfile(source, target)
    if sha(target) != report['sha256']:
        fail('Retained sentence evidence differs from the reviewed original')
    result = {**report, 'retainedFile': target.relative_to(output).as_posix(), 'retainedSha256': sha(target)}
    review = report.get('nonSpeechEvidence')
    if review:
        def copy_record(item, name):
            source = Path(item['file'])
            if source.is_symlink() or not source.is_file() or sha(source) != item['sha256']:
                fail('Full-source review evidence changed after planning')
            target = output / ('user-assets/'+name)
            shutil.copyfile(source, target)
            if sha(target) != item['sha256']:
                fail('Retained full-source review evidence differs from the original')
            return {**item, 'retainedFile': target.relative_to(output).as_posix(), 'retainedSha256': sha(target)}
        saved = copy_record(review, 'caption-non-speech-review.json')
        record = review['originalRecord']
        saved['originalRecord'] = copy_record(record, 'caption-audio-review-original'+Path(record['file']).suffix.lower())
        saved['referenceFiles'] = [copy_record(item, 'caption-audio-reference-'+str(i)+Path(item['file']).suffix.lower()) for i,item in enumerate(review['referenceFiles'])]
        result['nonSpeechEvidence'] = saved
    return result
