# Reading Analysis Pipeline

The core pipeline processes student audio recordings to generate detailed reading reports.

## Stages
1. **Audio Ingestion**: Receive PCM/WebM chunks via WebSocket.
2. **Enhancement**: Noise reduction (DeepFilterNet).
3. **VAD**: Voice Activity Detection (Silero VAD) to trim silence.
4. **STT**: Speech-to-Text (Whisper Large V3) for transcript and word timestamps.
5. **Forced Alignment**: Align transcript to audio at phoneme level (WhisperX / MMS-fa).
6. **G2P**: Grapheme-to-Phoneme conversion for expected text (CAMeL Tools).
7. **DTW Alignment**: Dynamic Time Warping to compare expected vs. actual phoneme sequences.
8. **Scoring**: Calculate Accuracy, Pronunciation, Fluency, and Prosody.
9. **Diagnosis**: Identify specific phoneme errors and generate recommendations.