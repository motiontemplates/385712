"""Compile new narrated productions and bind explicit per-shot visual media."""
import copy
import math
from pathlib import Path

PROFILE = 'narrated-story/1'
BASIC = {'B1': 'explanation', 'B2': 'heading', 'B3': 'heading', 'B4': 'action'}


def fail(message):
    raise ValueError('NARRATED_STORY: ' + message)


def number(value):
    return type(value) in (int, float) and math.isfinite(value)


def compile_input(data, catalog, root=None):
    """No ASR, text rewriting, timing estimation or media generation.

Optional exact phrase targets read the existing word evidence. The normal
evidence validator still checks its hash and bound original audio identity.
"""
    data = copy.deepcopy(data)
    if data.get('creationProfile') != PROFILE:
        return data
    data.setdefault('narrationVisualMode', 'follow-speech')
    data.setdefault('narrationLayout', 'balanced')
    captions = data.get('captions')
    if not isinstance(captions, list) or not captions:
        fail('New narrated productions need real captions and their unchanged timing evidence.')
    groups = {g['id']: g for g in catalog['groups']}
    mapping, cursor = [], 0
    for index, scene in enumerate(data.get('scenes', [])):
        if not isinstance(scene, dict) or scene.get('id') not in BASIC:
            fail('This simple production route supports B1–B4. Native groups retain their existing explicit input route.')
        group = groups[scene['id']]
        duration = scene.get('duration', (round(group['end'] * 60) - round(group['start'] * 60)) / 60)
        if not number(duration) or duration <= 0:
            fail('Use a valid scene duration; normal planning still checks the native motion window.')
        end = cursor + duration
        refs = [i for i, c in enumerate(captions) if isinstance(c, dict) and number(c.get('start')) and number(c.get('end'))
                and min(end, c['end']) > max(cursor, c['start']) + 1e-7]
        explicit = scene.get('captionTargets', {})
        if not isinstance(explicit, dict) or any(k not in [str(i) for i in refs] for k in explicit):
            fail('captionTargets keys must be actual intersecting caption indices.')
        beats = []
        effective = {**data.get('basic', {}), **scene.get('basic', {})}
        for ref in refs:
            default = BASIC[scene['id']]
            if scene['id'] == 'B2' and len(effective.get('points', [])) == len(refs) and not scene.get('phraseTargets'):
                default = 'points.' + str(refs.index(ref))
            targets = explicit.get(str(ref), default)
            targets = targets if isinstance(targets, list) else [targets]
            targets = list(targets) + ['visuals.' + str(i) for i, v in enumerate(scene.get('visuals', [])) if v.get('captionIndex') == ref]
            for target in dict.fromkeys(targets):
                if not isinstance(target, str) or not target:
                    fail('Choose actual visible fields or visuals.N as caption targets.')
                c = captions[ref]
                beats.append({'at': c['start'], 'until': c['end'], 'spokenText': c['text'], 'timing': 'sentence', 'target': target})
        if scene.get('phraseTargets'):
            if root is None or not data.get('narrationTimingEvidence'):
                fail('phraseTargets require the actual word-alignment file; sentence timestamps cannot supply phrase clocks.')
            import json
            from timing_evidence import input_file, load_words, normal
            evidence = data['narrationTimingEvidence']
            words = load_words(json.loads(input_file(root, evidence.get('file')).read_text(encoding='utf-8')), data.get('duration'), 1 / 60 + .002, evidence.get('offsetSeconds', 0))
            for target in scene['phraseTargets']:
                ref = target.get('captionIndex')
                wanted = normal(target.get('text', ''))
                if ref not in refs or not wanted:
                    fail('Each exact phrase target needs an intersecting captionIndex and actual spoken text.')
                cue = captions[ref]; matches = []
                for first, word in enumerate(words):
                    if word['start'] < cue['start'] - .019 or word['end'] > cue['end'] + .019:
                        continue
                    phrase = ''
                    for last in range(first, len(words)):
                        if words[last]['end'] > cue['end'] + .019:
                            break
                        phrase += words[last]['text']
                        value = normal(phrase)
                        if value == wanted:
                            matches.append((first, last, phrase)); break
                        if not wanted.startswith(value):
                            break
                if len(matches) != 1:
                    fail('Exact phrase must occur once in its real word evidence: ' + target['text'])
                first, last, phrase = matches[0]
                if min(end, words[last]['end']) <= max(cursor, words[first]['start']):
                    fail('The measured phrase does not intersect this visual shot.')
                beats.append({'at': words[first]['start'], 'until': words[last]['end'], 'spokenText': phrase,
                              'timing': 'measured-word', 'wordIndices': list(range(first, last + 1)), 'target': target['target']})
        if scene['id'] == 'B2':
            missing = ['points.' + str(i) for i in range(len(effective.get('points', []))) if not any(b['target'] == 'points.' + str(i) for b in beats)]
            if missing:
                fail('Map each visible point to an actual complete cue or exact measured phrase: ' + ', '.join(missing))
        mapping.append({'shot': index, 'start': cursor, 'end': end, 'captionBinding': 'continuous',
                        'spokenText': ''.join(captions[i]['text'] for i in refs), 'captionIndices': refs,
                        'purpose': scene.get('intent', {'B2': 'neutral-list', 'B3': 'real-comparison', 'B4': 'summary'}.get(scene['id'], 'neutral-emphasis')),
                        'timingSource': 'provided-captions', 'beats': sorted(beats, key=lambda b: b['at'])})
        cursor = end
    if not mapping:
        fail('Provide at least one visual scene with current content.')
    # An explicitly supplied map is authoritative and still fully validated.
    data.setdefault('narrationMap', mapping)
    return data


def bind_visuals(data, spans, bind, assets):
    """Use normal adapter validation/copying; source time is explicit and unscaled."""
    used = []
    for index, span in enumerate(spans):
        visual = data['scenes'][index].get('visuals', [])
        if not visual:
            continue
        if span['id'] not in BASIC:
            fail('Per-shot visual windows currently support B1–B4 only.')
        if data.get('media', {}).get('presenter', {}).get('mode') != 'none':
            fail('This media-led layout needs presenter.mode=none; keep the existing presenter layout for a talking head.')
        entries, previous = [], -1
        for i, value in enumerate(visual):
            ref = value.get('captionIndex')
            if type(ref) is not int or not 0 <= ref < len(data.get('captions', [])):
                fail('Each visual uses an actual captionIndex.')
            cue = data['captions'][ref]
            at = max(span['outputStart'], cue['start'])
            if not at < min(cue['end'], span['outputEnd']) or at <= previous:
                fail('Visuals must reference distinct, ordered cues intersecting their scene.')
            previous = at
            entries.append({**value, 'at': at, 'role': 'story-' + str(index) + '-' + str(i), 'sourceStart': value.get('sourceStart', 0), 'fit': value.get('fit', 'contain')})
        for i, entry in enumerate(entries):
            until = entries[i + 1]['at'] if i + 1 < len(entries) else span['outputEnd']
            duration = until - entry['at']
            start = entry['sourceStart']
            if not number(start) or start < 0 or entry.get('mode') == 'image' and start != 0:
                fail('sourceStart is a nonnegative real video offset; images use zero.')
            port = {'kind': 'story', 'fps': 30, 'frameCount': max(1, math.ceil(duration * 30)), 'sourceStart': start}
            bind(entry['role'], entry, port)
            if entry['mode'] == 'video':
                # The ordinary bind checks duration; additionally cover the selected source range.
                from subprocess import check_output
                import json
                meta = json.loads(check_output(['ffprobe', '-v', 'error', '-show_format', '-of', 'json', str(assets[entry['role']][0])]))
                if float(meta['format']['duration']) + 1 / 30 < start + duration:
                    fail('Video is shorter than its visible source range; choose another clip or an explicit shorter visual interval.')
            entry.update(until=until)
            entry.pop('file', None)  # Runtime visuals use copied role bindings only.
            used.append({'role': entry['role'], 'shot': index, 'captionIndex': entry['captionIndex'], 'start': entry['at'], 'end': until,
                         'sourceStart': start, 'mode': entry['mode']})
        span['visuals'] = entries
    return used


def media_usage(data, assets, visual_usage):
    consumed = {k.split('/')[0] for k in assets}
    unused = [key for key, value in data.get('media', {}).items()
              if key not in consumed and key not in ('presenter', 'voice', 'music')
              and (isinstance(value, list) and value or isinstance(value, dict) and value.get('mode') not in (None, 'none'))]
    required = data.get('requiredMediaRoles', [])
    missing = [key for key in required if key not in consumed]
    if missing:
        fail('Required supplied media is not used by selected scenes: ' + ', '.join(missing))
    return {'profile': 'motiongit.media-usage/1', 'visuals': visual_usage, 'unusedRoles': unused,
            'warnings': [{'code': 'supplied-media-unused', 'role': key,
                          'action': 'Use an existing native port or a scenes[].visuals window; supplied files do not become visible automatically.'} for key in unused]}
