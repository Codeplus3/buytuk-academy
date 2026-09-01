# Scoring Model

The final reading score (0-100) is a weighted average of four metrics:

1. **Accuracy (40%)**: Word Error Rate (WER) and Phoneme Error Rate (PER).
2. **Pronunciation (30%)**: Quality of phoneme articulation based on confidence scores and phonetic distance.
3. **Fluency (20%)**: Words Per Minute (WPM) and pause analysis.
4. **Prosody (10%)**: Pitch variance and stress patterns (advanced feature).

## Mastery Levels
- **Mastered**: Score >= 85 for 3 consecutive attempts.
- **Progressing**: Score 70-84.
- **Developing**: Score 50-69.
- **Needs Support**: Score < 50.