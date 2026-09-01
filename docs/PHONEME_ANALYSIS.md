# Arabic Phoneme Analysis

## IPA Mapping
We use a custom mapping from Arabic letters (with diacritics) to IPA symbols.
- Emphatic letters (تفخيم): /sˤ/, /dˤ/, /tˤ/, /zˤ/.
- Interdentals: /θ/ (ث), /ð/ (ذ).

## Phonetic Distance Matrix
A 2D matrix used in DTW to calculate the cost of substituting one phoneme for another.
- Distance 0: Identical phonemes.
- Distance 0.2-0.4: Similar place/manner of articulation (e.g., /t/ vs /d/).
- Distance 0.8-1.0: Completely different (e.g., /a/ vs /k/).