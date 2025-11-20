import { chatSession } from './AIModel';

class TranslationService {
  constructor() {
    this.supportedLanguages = {
      en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
      hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
      ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
      te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
      bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
      mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
      gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
      kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
      ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
      pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
    };

    this.localTips = {
      en: {
        auto: "Ask the auto driver to use the meter",
        cash: "Keep cash handy, cards may not work everywhere",
        bargain: "Bargaining is common in local markets",
        water: "Carry bottled water",
        timing: "Visit popular spots early morning to avoid crowds"
      },
      hi: {
        auto: "Auto mein meter chalao bolna",
        cash: "Yahan cash rakhna better hai",
        bargain: "Local market mein bhav-tol kar sakte ho",
        water: "Bottled paani saath rakhna",
        timing: "Bheed se bachne ke liye subah jaldi jaana"
      }
    };
  }

  // Translate trip plan
  async translateTripPlan(tripData, targetLanguage) {
    if (targetLanguage === 'en') {
      return tripData; // Already in English
    }

    const prompt = `
Translate this travel itinerary to ${this.supportedLanguages[targetLanguage]?.name || 'Hindi'}.

Keep:
- Place names in original (e.g., "Hawa Mahal" stays "Hawa Mahal")
- Numbers and prices as is
- Translate descriptions and details naturally

Original Trip Data:
${JSON.stringify(tripData, null, 2)}

Return translated JSON in same structure.
`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return tripData; // Fallback to original
    } catch (error) {
      console.error('Translation error:', error);
      return tripData;
    }
  }

  // Translate single text
  async translateText(text, targetLanguage) {
    if (targetLanguage === 'en') {
      return text;
    }

    const prompt = `Translate this to ${this.supportedLanguages[targetLanguage]?.name || 'Hindi'}: "${text}"
    
Return only the translation, nothing else.`;

    try {
      const result = await chatSession.sendMessage(prompt);
      return result?.response?.text()?.trim() || text;
    } catch (error) {
      console.error('Text translation error:', error);
      return text;
    }
  }

  // Get local tips for language
  getLocalTips(language = 'en') {
    return this.localTips[language] || this.localTips.en;
  }

  // Get language info
  getLanguageInfo(code) {
    return this.supportedLanguages[code] || this.supportedLanguages.en;
  }

  // Get all supported languages
  getAllLanguages() {
    return Object.entries(this.supportedLanguages).map(([code, info]) => ({
      code,
      ...info
    }));
  }

  // Generate India-specific local tips for destination
  generateLocalTips(destination, language = 'en') {
    const tips = {
      en: [
        `In ${destination}, auto drivers may not use meters - negotiate fare beforehand`,
        `Keep cash handy as many local shops don't accept cards`,
        `Try local street food but stick to busy, popular stalls`,
        `Dress modestly when visiting religious places`,
        `Download offline maps as internet can be spotty`
      ],
      hi: [
        `${destination} mein auto waale meter nahi chalate - pehle bhada tay kar lena`,
        `Cash saath rakhna, bahut jagah card nahi chalte`,
        `Local street food try karo par busy stalls pe hi jaana`,
        `Dharmik jagah pe jaate waqt sahi kapde pehenna`,
        `Offline maps download kar lena, internet problem ho sakti hai`
      ]
    };

    return tips[language] || tips.en;
  }
}

export const translationService = new TranslationService();
