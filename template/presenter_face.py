# /// script
# requires-python = ">=3.11"
# dependencies = ["opencv-python-headless==4.12.0.88"]
# ///
"""Coarse local framing only: one image or five video samples, no face tracking."""
from pathlib import Path
from statistics import median
import json
import shutil
import subprocess


def _load_cascade(cv2):
    """Keep OpenCV's C++ file loader away from Unicode installation paths."""
    xml = (Path(cv2.data.haarcascades) / 'haarcascade_frontalface_default.xml').read_text(encoding='utf-8')
    storage = cv2.FileStorage(xml, cv2.FILE_STORAGE_READ | cv2.FILE_STORAGE_MEMORY)
    try:
        cascade = cv2.CascadeClassifier()
        if not storage.isOpened() or not cascade.read(storage.getFirstTopLevelNode()) or cascade.empty():
            raise ValueError('Local face detector unavailable')
        return cascade
    finally:
        storage.release()


def approximate_face(file, mode, duration=0):
    fallback = {'cx': .5, 'cy': .5, 'h': .4}
    report = {'method': 'opencv-haar-largest-face', 'sampleCount': 0,
              'detectedSamples': 0, 'status': 'undetected', 'reviewRequired': True}
    try:
        import cv2
        import numpy as np
    except (ImportError, OSError) as error:
        report.update(errorCode='FACE_DEPENDENCY_UNAVAILABLE', errorType=type(error).__name__,
                      reason='Local OpenCV dependency unavailable in the preparation interpreter; use centered cover without extra zoom and review the preview.')
        return fallback, report
    ffmpeg = shutil.which('ffmpeg')
    if ffmpeg is None:
        report.update(errorCode='FACE_FFMPEG_UNAVAILABLE',
                      reason='FFmpeg unavailable in the preparation environment; use centered cover without extra zoom and review the preview.')
        return fallback, report
    try:
        cascade = _load_cascade(cv2)
    except (OSError, ValueError, AttributeError, cv2.error) as error:
        report.update(errorCode='FACE_DETECTOR_UNAVAILABLE', errorType=type(error).__name__,
                      reason='Local face detector could not load; use centered cover without extra zoom and review the preview.')
        return fallback, report
    times = [0] if mode == 'image' else [max(0, duration - .1) * p for p in [.05, .25, .5, .75, .95]]
    rows, errors = [], []
    report['attemptedSamples'] = 0
    for time in times:
        report['attemptedSamples'] += 1
        stage = 'extract'
        try:
            command = [ffmpeg, '-v', 'error', '-nostdin']
            if mode == 'video':
                command += ['-ss', str(round(time, 3))]
            command += ['-i', str(file), '-vf', 'scale=1280:1280:force_original_aspect_ratio=decrease',
                        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1']
            result = subprocess.run(command, capture_output=True, timeout=30, check=True)
            stage = 'decode'
            pixels = cv2.imdecode(np.frombuffer(result.stdout, dtype=np.uint8), cv2.IMREAD_GRAYSCALE)
            if pixels is None:
                raise ValueError('Empty decoded face sample')
            report['sampleCount'] += 1
            height, width = pixels.shape
            stage = 'detect'
            faces = cascade.detectMultiScale(pixels, scaleFactor=1.1, minNeighbors=7, minSize=(24, 24))
            if not len(faces):
                continue
            x, y, w, h = max(faces, key=lambda b: int(b[2]) * int(b[3]))
            rows.append({'time': round(time, 3), 'cx': float((x + w / 2) / width),
                         'cy': float((y + h / 2) / height), 'w': float(w / width), 'h': float(h / height)})
        except (OSError, ValueError, cv2.error, subprocess.SubprocessError) as error:
            errors.append({'time': round(time, 3), 'stage': stage, 'errorType': type(error).__name__})
    report.update(detectedSamples=len(rows), samples=rows)
    if errors:
        report['sampleErrors'] = errors
    if rows:
        face = {key: round(median(row[key] for row in rows), 6) for key in ['cx', 'cy', 'w', 'h']}
        report['status'] = 'approximate'
        return face, report
    report['errorCode'] = 'FACE_SAMPLE_FAILED' if errors else 'FACE_NOT_FOUND'
    report['reason'] = 'No usable frontal face sample; use centered cover without extra zoom. A manual face hint can override it.'
    return fallback, report


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', type=Path)
    parser.add_argument('--video-duration', type=float, default=0)
    args = parser.parse_args()
    face, report = approximate_face(args.file, 'video' if args.video_duration else 'image', args.video_duration)
    print(json.dumps({'face': face, 'framing': report}, ensure_ascii=False, indent=2))
