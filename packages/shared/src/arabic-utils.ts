// =============================================================================
// BuyTuk Academy - Arabic Language Utilities
// =============================================================================

/**
 * Check if text contains Arabic characters
 */
export function isArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Count Arabic letters in text
 */
export function countArabicLetters(text: string): number {
  const arabicLetters = text.match(/[\u0621-\u064A\u0671-\u06D3]/g);
  return arabicLetters ? arabicLetters.length : 0;
}

/**
 * Remove Arabic diacritics (tashkeel)
 */
export function removeTashkeel(text: string): string {
  return text.replace(/[\u064B-\u0652\u0670\u0640]/g, "");
}

/**
 * Get Arabic letter name
 */
export function getArabicLetterName(letter: string): string {
  const letterNames: Record<string, string> = {
    ا: "ألف", ب: "باء", ت: "تاء", ث: "ثاء", ج: "جيم",
    ح: "حاء", خ: "خاء", د: "دال", ذ: "ذال", ر: "راء",
    ز: "زاي", س: "سين", ش: "شين", ص: "صاد", ض: "ضاد",
    ط: "طاء", ظ: "ظاء", ع: "عين", غ: "غين", ف: "فاء",
    ق: "قاف", ك: "كاف", ل: "لام", م: "ميم", ن: "نون",
    ه: "هاء", و: "واو", ي: "ياء", ء: "همزة", : "تاء مربوطة",
    ى: "ألف مقصورة",
  };
  return letterNames[letter] || letter;
}

/**
 * Get Arabic letter phoneme (IPA)
 */
export function getArabicLetterPhoneme(letter: string): string {
  const phonemes: Record<string, string> = {
    ا: "aː", ب: "b", ت: "t", ث: "θ", ج: "dʒ",
    ح: "ħ", خ: "x", د: "d", ذ: "ð", ر: "r",
    ز: "z", س: "s", ش: "", ص: "sˤ", ض: "dˤ",
    ط: "tˤ", ظ: "zˤ", ع: "ʕ", غ: "ɣ", ف: "f",
    ق: "q", ك: "k", ل: "l", م: "m", ن: "n",
    ه: "h", و: "w", ي: "j", ء: "ʔ",
  };
  return phonemes[letter] || letter;
}

/**
 * Check if letter is emphatic (mufakhkham)
 */
export function isEmphatic(letter: string): boolean {
  return ["ص", "ض", "ط", "ظ"].includes(letter);
}

/**
 * Check if letter is a sun letter (حرف شمسي)
 */
export function isSunLetter(letter: string): boolean {
  const sunLetters = ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"];
  return sunLetters.includes(letter);
}

/**
 * Check if letter is a moon letter (حرف قمري)
 */
export function isMoonLetter(letter: string): boolean {
  return !isSunLetter(letter) && isArabicLetter(letter);
}

/**
 * Check if character is an Arabic letter
 */
export function isArabicLetter(char: string): boolean {
  return /[\u0621-\u064A\u0671-\u06D3]/.test(char);
}

/**
 * Get word syllables (simplified)
 */
export function getSyllables(word: string): string[] {
  const cleanWord = removeTashkeel(word);
  const vowels = ["َ", "ِ", "ُ", "ا", "و", "ي"];
  const syllables: string[] = [];
  let currentSyllable = "";

  for (const char of cleanWord) {
    currentSyllable += char;
    if (vowels.includes(char)) {
      syllables.push(currentSyllable);
      currentSyllable = "";
    }
  }

  if (currentSyllable) {
    syllables[syllables.length - 1] += currentSyllable;
  }

  return syllables;
}

/**
 * Calculate reading difficulty score for Arabic text
 */
export function calculateArabicDifficulty(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;

  let difficulty = 0;

  for (const word of words) {
    // Longer words are harder
    if (word.length > 6) difficulty += 2;
    else if (word.length > 4) difficulty += 1;

    // Emphatic letters add difficulty
    for (const char of word) {
      if (isEmphatic(char)) difficulty += 0.5;
    }
  }

  return Math.min(10, difficulty / words.length);
}