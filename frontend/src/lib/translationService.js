// Translation Service for English to Hindi and Tamil

// Using a free translation service (you can replace with Google Translate API)
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';

/**
 * Translate text from English to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code ('hi' for Hindi, 'ta' for Tamil)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLang) => {
  try {
    // Clean the text and limit length
    const cleanText = text.substring(0, 500); // Limit to prevent API issues
    
    const url = `${TRANSLATION_API_URL}?q=${encodeURIComponent(cleanText)}&langpair=en|${targetLang}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

/**
 * Translate text to multiple languages
 * @param {string} text - Text to translate
 * @returns {Promise<Object>} - Object with translations
 */
export const translateToMultipleLanguages = async (text) => {
  try {
    const [hindiTranslation, tamilTranslation] = await Promise.all([
      translateText(text, 'hi'),
      translateText(text, 'ta')
    ]);

    return {
      english: text,
      hindi: hindiTranslation,
      tamil: tamilTranslation
    };
  } catch (error) {
    console.error('Multi-language translation error:', error);
    return {
      english: text,
      hindi: text,
      tamil: text
    };
  }
};

/**
 * Translate long text by breaking it into chunks
 * @param {string} text - Long text to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
export const translateLongText = async (text, targetLang) => {
  const chunks = text.match(/.{1,400}/g) || [text];
  const translatedChunks = [];

  for (const chunk of chunks) {
    const translated = await translateText(chunk, targetLang);
    translatedChunks.push(translated);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return translatedChunks.join(' ');
};

// Language options for UI
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' }
];