"""
BuyTuk Academy - ML Workers Package

This package contains specialized machine learning workers
that handle different inference tasks.

Workers:
    - whisper_worker: Speech-to-Text transcription using Whisper
    - alignment_worker: Forced phoneme alignment using WhisperX/MMS
    - g2p_worker: Grapheme-to-Phoneme conversion using CAMeL Tools
    - feedback_worker: AI-powered feedback generation using LLMs
"""

from workers.whisper_worker import serve as start_whisper_worker
from workers.alignment_worker import serve as start_alignment_worker
from workers.g2p_worker import serve as start_g2p_worker
from workers.feedback_worker import serve as start_feedback_worker

__version__ = "1.0.0"
__all__ = [
    "start_whisper_worker",
    "start_alignment_worker",
    "start_g2p_worker",
    "start_feedback_worker",
]