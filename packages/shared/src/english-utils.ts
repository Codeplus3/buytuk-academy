// =============================================================================
// BuyTuk Academy - English Language Utilities
// =============================================================================

/**
 * Check if text contains English characters
 */
export function isEnglish(text: string): boolean {
  const englishRegex = /[a-zA-Z]/;
  return englishRegex.test(text);
}

/**
 * Count English words
 */
export function countEnglishWords(text: string): number {
  const words = text.match(/\b[a-zA-Z]+\b/g);
  return words ? words.length : 0;
}

/**
 * Get phoneme for English letter (simplified)
 */
export function getEnglishLetterPhoneme(letter: string): string {
  const phonemes: Record<string, string> = {
    a: "æ", b: "b", c: "k", d: "d", e: "ɛ",
    f: "f", g: "ɡ", h: "h", i: "ɪ", j: "dʒ",
    k: "k", l: "l", m: "m", n: "n", o: "",
    p: "p", q: "kw", r: "ɹ", s: "s", t: "t",
    u: "ʌ", v: "v", w: "w", x: "ks", y: "j", z: "z",
  };
  return phonemes[letter.toLowerCase()] || letter;
}

/**
 * Check if word is a vowel
 */
export function isVowel(letter: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(letter.toLowerCase());
}

/**
 * Check if word is a consonant
 */
export function isConsonant(letter: string): boolean {
  return isEnglishLetter(letter) && !isVowel(letter);
}

/**
 * Check if character is an English letter
 */
export function isEnglishLetter(char: string): boolean {
  return /[a-zA-Z]/.test(char);
}

/**
 * Count syllables in English word (simplified)
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length === 0) return 0;

  let count = 0;
  let prevVowel = false;

  for (const char of word) {
    const isV = isVowel(char);
    if (isV && !prevVowel) count++;
    prevVowel = isV;
  }

  // Adjust for silent e
  if (word.endsWith("e") && count > 1) count--;

  return Math.max(1, count);
}

/**
 * Calculate Flesch-Kincaid readability score
 */
export function calculateFleschKincaid(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  if (words.length === 0 || sentences.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
}

/**
 * Get reading level from Flesch-Kincaid score
 */
export function getReadingLevel(score: number): string {
  if (score >= 90) return "Very Easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly Difficult";
  if (score >= 30) return "Difficult";
  return "Very Difficult";
}