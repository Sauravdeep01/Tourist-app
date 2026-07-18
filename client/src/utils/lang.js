/**
 * Helper to select the correct language variant for bilingual database fields.
 * If the selected language variant is empty or missing, it falls back to English,
 * then Simplified Chinese, and finally an empty string.
 * 
 * @param {Object} field - Bilingual object of type { en: string, zh: string }
 * @param {string} lang - Currently active language code ('zh' or 'en')
 * @returns {string} - The translated text
 */
export function L(field, lang) {
  if (!field) return '';
  return field[lang] || field.en || field.zh || '';
}
