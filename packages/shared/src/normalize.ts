// =============================================================================
// BuyTuk Academy - Text Normalization Utilities
// =============================================================================

/**
 * Normalize Arabic text for comparison and processing
 */
export function normalizeArabicText(text: string): string {
  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    // Normalize alef forms
    .replace(/[إأآا]/g, "ا")
    // Normalize yaa forms
    .replace(/[ىي]/g, "ي")
    // Normalize ta marbuta
    .replace(/ة/g, "ه")
    // Normalize waw
    .replace(/ؤ/g, "و")
    // Normalize hamza on yaa
    .replace(/ئ/g, "ي")
    // Remove extra whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalize English text for comparison
 */
export function normalizeEnglishText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove punctuation from text
 */
export function removePunctuation(text: string): string {
  return text.replace(/[.,!?;:،؛؟!]/g, "").trim();
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Split text into words
 */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Escape special characters for regex
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Normalize email address
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Normalize phone number
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").trim();
}