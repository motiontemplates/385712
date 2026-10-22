"""Versioned visual-shot references to an unchanged, continuous caption track.

Sentence intervals remain evidence, not editable shot boundaries. Repeated
references are context in the plan; the renderer still emits each caption once.
The existing source-audio/word-evidence validators must run independently.
"""
import math
import re

PROFILE = 'motiongit.narration-continuity/1'


def normal(value):
    return re.sub(r'[\s,，.。!！?？;；:：、]+', '', str(value)).casefold()


def number(value):
    return type(value) in (int, float) and math.isfinite(value)


def overlap(a, b):
    return min(a['end'], b['end']) - max(a['start'], b['start']) > 1e-7


def validate(mapping, shots, captions, *, required, language, fps, purposes, restricted, word_evidence_verified=False):
    def fail(message):
        raise ValueError('NARRATION_CONTINUITY: ' + message)

    tolerance = 1 / fps + .002
    if not isinstance(mapping, list) or len(mapping) != len(shots) or not shots:
        fail('Provide one continuous-caption context row per visual shot.')
    if not captions:
        fail('Continuous-caption mode requires the actual complete caption track.')
    cues = []
    for cue in captions:
        if not isinstance(cue, dict):
            fail('Caption entries must be objects.')
        start, end = cue.get('start'), cue.get('end')
        text = cue.get('text', cue.get(language, ''))
        if not number(start) or not number(end) or not 0 <= start < end or not isinstance(text, str) or not text.strip():
            fail('Keep finite, nonempty original caption intervals and text.')
        cues.append({'start': start, 'end': end, 'text': text})
    previous = 0
    for shot in shots:
        if not number(shot.get('start')) or not number(shot.get('end')) or not shot['start'] < shot['end']:
            fail('Visual shots require finite positive intervals.')
        if abs(shot['start'] - previous) > 1e-7:
            fail('Visual shots must cover the output continuously, without gaps or overlaps.')
        previous = shot['end']
    if any(c['end'] > previous + 1e-7 for c in cues):
        fail('The visual plan must cover the complete caption track.')
    rows, covered, sentences, findings = [], set(), [], []
    for index, (row, shot) in enumerate(zip(mapping, shots)):
        if not isinstance(row, dict) or row.get('captionBinding') != 'continuous':
            fail('Do not mix whole-cue ownership with continuous-caption context rows.')
        if row.get('shot') != index or any(not number(row.get(k)) or abs(row[k] - shot[k]) > tolerance for k in ('start', 'end')):
            fail('Row indices and visual intervals must match the selected shot plan.')
        purpose = row.get('purpose')
        if purpose not in purposes:
            fail('Invalid narrationMap.purpose '+repr(purpose)+'. Available values: '+', '.join(purposes)+'. Match the actual spoken meaning; see NARRATION-MAP.md for scene restrictions.')
        if shot.get('id') in restricted and purpose not in restricted[shot['id']]:
            fail('The native action does not support this meaning; choose a compatible expression.')
        if shot.get('control') in ('stamp', 'check', 'checklist') and purpose not in ('confirmed-completion', 'user-requested-action'):
            fail('Do not imply that an unfulfilled request is completed.')
        if row.get('timingSource') not in ('provided-captions', 'measured-phrases', 'reviewed-transcript'):
            fail('State the actual timing source.')
        refs = [i for i, cue in enumerate(cues) if overlap(cue, shot)]
        if row.get('captionIndices') != refs:
            fail('captionIndices must include exactly the complete cues intersecting this visual shot.')
        if not isinstance(row.get('spokenText'), str) or normal(row['spokenText']) != normal(''.join(cues[i]['text'] for i in refs)):
            fail('Keep complete overlapping captions as context, including negation, qualifiers and numbers.')
        beats = row.get('beats', [])
        if not isinstance(beats, list):
            fail('beats must be a list.')
        matched, last_at = set(), -1
        for beat in beats:
            if not isinstance(beat, dict) or any(not number(beat.get(k)) for k in ('at', 'until')) or beat['at'] >= beat['until'] or beat['at'] < last_at:
                fail('Use ordered finite measured beat intervals.')
            interval = {'start': beat['at'], 'end': beat['until']}
            if not overlap(interval, shot):
                fail('A beat must intersect the visual shot that references it.')
            if not isinstance(beat.get('target'), str) or not beat['target'].strip():
                fail('Each beat needs a real rendered visual target.')
            timing = beat.get('timing')
            if timing == 'sentence':
                actual = [i for i in refs if abs(beat['at'] - cues[i]['start']) <= tolerance
                          and abs(beat['until'] - cues[i]['end']) <= tolerance
                          and normal(beat.get('spokenText')) == normal(cues[i]['text'])]
                if not actual:
                    fail('A sentence beat retains its whole original text and interval, even across a visual cut.')
                matched.update(actual)
            elif timing == 'measured-word':
                if not any(cues[i]['start'] - tolerance <= beat['at'] < beat['until'] <= cues[i]['end'] + tolerance
                           and normal(beat.get('spokenText', '')) and normal(beat['spokenText']) in normal(cues[i]['text']) for i in refs):
                    fail('Word beats must belong to an actual intersecting caption; verify their word evidence separately.')
                indices = beat.get('wordIndices')
                if not isinstance(indices, list) or not indices or any(type(i) is not int or i < 0 for i in indices) or indices != list(range(indices[0], indices[-1] + 1)):
                    fail('Word accents require contiguous real wordIndices, never a visual-cut-derived clock.')
                if word_evidence_verified is not True:
                    fail('Continuous word accents require source-backed word evidence verified by this renderer; otherwise use complete sentence beats.')
            else:
                fail('Use full sentence timing or actual measured-word evidence.')
            last_at = beat['at']
        if required and matched != set(refs):
            fail('Every intersecting complete sentence needs a rendered target; sparse word accents alone are insufficient.')
        covered.update(refs)
        for i in refs:
            sentences.append({'captionIndex': i, 'shot': index, **cues[i], 'sentenceMapped': i in matched,
                              'visibleRange': {'start': max(cues[i]['start'], shot['start']), 'end': min(cues[i]['end'], shot['end'])}})
        targets = {b.get('target') for b in beats}
        if len(refs) > 1 and len(targets) <= 1:
            findings.append({'code': 'repeated-single-target', 'shot': index,
                             'action': 'Inspect real content development; repeated glow or a static heading is not evidence of new meaning.'})
        rows.append({**row, 'sceneId': shot.get('id'), 'control': shot.get('control'), 'chapter': shot.get('title'),
                     'spokenTextIsContext': True,
                     'semanticReview': 'Full cue references are context; they do not claim the exact words spoken on either side of a visual cut.'})
    if covered != set(range(len(cues))):
        fail('Do not omit any supplied caption.')
    return {'profile': PROFILE, 'timingCoverageVerified': True, 'durationSeconds': previous, 'rows': rows,
            'meaningReview': 'Review action meaning and the final encoding; timing validation is not semantic acceptance.',
            'visualCoverage': {'profile': 'motiongit.narration-visual-coverage/2', 'captionCount': len(cues),
                               'mappedSentenceCount': len({s['captionIndex'] for s in sentences if s['sentenceMapped']}),
                               'allSentencesMapped': all(s['sentenceMapped'] for s in sentences),
                               'sentences': sentences, 'findings': findings,
                               'semanticAcceptance': False, 'renderedMotionAcceptance': False}}
