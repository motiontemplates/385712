"""Additive visual coverage audit. It never edits speech or certifies semantics.

Run after the template's existing timing/ownership validation. Older projects
remain renderable; incomplete coverage is an actionable planning warning.
"""
import math
import re


def normal(value):
    return re.sub(r'[\s,，.。!！?？;；:：、]+', '', str(value)).casefold()


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def audit(rows, captions=(), language='zh', fps=60):
    tolerance = 1 / fps + .002
    cues = [{'start': c.get('start', c.get('s', c.get('t0'))),
             'end': c.get('end', c.get('e', c.get('t1'))),
             'text': c.get('text', c.get(language, c.get('zh', c.get('en', ''))))}
            for c in captions]
    findings, sentences = [], []
    for index, row in enumerate(rows):
        beats = row.get('beats', [])
        refs = row.get('captionIndices', [])
        if not cues:
            findings.append({'code': 'measured-cues-unavailable', 'shot': index,
                             'action': 'Review actual source phrases before claiming sentence coverage.'})
        for ref in refs:
            if type(ref) is not int or not 0 <= ref < len(cues):
                continue  # The ownership validator reports malformed references.
            cue = cues[ref]
            if not all(finite(cue[k]) for k in ('start', 'end')):
                continue
            # Full sentence text + interval is necessary. A short word beat does
            # not prove that the rest of its sentence has a visual expression.
            matching = [b for b in beats if b.get('timing') == 'sentence'
                        and normal(b.get('spokenText', '')) == normal(cue['text'])
                        and all(finite(b.get(k)) for k in ('at', 'until'))
                        and abs(b['at'] - cue['start']) <= tolerance
                        and abs(b['until'] - cue['end']) <= tolerance
                        and isinstance(b.get('target'), str) and b['target'].strip()]
            words = [b for b in beats if b.get('timing') == 'measured-word'
                     and all(finite(b.get(k)) for k in ('at', 'until'))
                     and cue['start'] - tolerance <= b['at'] < b['until'] <= cue['end'] + tolerance]
            # Word measurements stay distinct: sparse keyword accents are not
            # a replacement for the complete sentence's visual plan.
            entry = {'captionIndex': ref, 'shot': index, **cue,
                     'sentenceMapped': bool(matching),
                     'targets': list(dict.fromkeys(b['target'] for b in matching)),
                     'measuredWordAccents': len(words)}
            sentences.append(entry)
            if not matching:
                findings.append({'code': 'sentence-visual-unmapped', 'shot': index,
                                 'captionIndex': ref, 'text': cue['text'],
                                 'action': 'Add a complete-sentence visual target; retain measured word accents if useful. Do not invent word timing.'})
        unique = list(dict.fromkeys(b.get('target') for b in beats if b.get('target')))
        start, end = row.get('start', 0), row.get('end', 0)
        if len(refs) > 1 and len(unique) <= 1:
            findings.append({'code': 'repeated-single-target', 'shot': index,
                             'action': 'Inspect whether the same picture develops the next idea. Use compatible state changes or another shot when meaning changes.'})
        if finite(start) and finite(end) and end - start > 9:
            findings.append({'code': 'long-shot-review', 'shot': index, 'seconds': end-start,
                             'action': 'Review content progression during the hold. A long shot is allowed when the picture meaningfully develops; duration alone is not failure.'})
    represented = {s['captionIndex'] for s in sentences}
    for ref, cue in enumerate(cues):
        if ref not in represented:
            findings.append({'code': 'caption-without-shot', 'captionIndex': ref, 'text': cue['text'],
                             'action': 'Keep this sentence and assign a compatible shot.'})
    return {'profile': 'motiongit.narration-visual-coverage/1',
            'mode': 'advisory-preserve-existing-rendering',
            'captionCount': len(cues), 'mappedSentenceCount': sum(s['sentenceMapped'] for s in sentences),
            'allSentencesMapped': bool(cues) and len(sentences) == len(cues)
                                  and len(represented) == len(cues) and all(s['sentenceMapped'] for s in sentences),
            'sentences': sentences, 'findings': findings,
            'semanticAcceptance': False, 'renderedMotionAcceptance': False,
            'review': 'Inspect actual picture/action meaning, reveal times and complete narration in the final encoding. Metadata coverage is not artistic acceptance.'}
