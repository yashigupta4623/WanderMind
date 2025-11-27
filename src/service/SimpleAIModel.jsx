// Simple AI Model for WanderMind
// Easy-to-use wrapper for Google Gemini AI

class SimpleAIModel {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
    this.model = 'gemini-2.5-flash';
  }

  /**
   * Simple method to ask AI anything
   * @param {string} question - Your question or prompt
   * @returns {Promise<string>} - AI's response as text
   */
  async ask(question) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: question }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`AI Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response from AI');
      }

      return text;
    } catch (error) {
      console.error('Simple AI Model Error:', error);
      throw error;
    }
  }

  /**
   * Ask AI and get JSON response
   * @param {string} question - Your question or prompt
   * @returns {Promise<object>} - AI's response as JSON object
   */
  async askJSON(question) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: question }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`AI Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response from AI');
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('Simple AI Model Error:', error);
      throw error;
    }
  }

  /**
   * Generate travel recommendations
   * @param {string} destination - Where to travel
   * @param {number} days - Number of days
   * @returns {Promise<object>} - Travel plan
   */
  async generateTravelPlan(destination, days) {
    const prompt = `Create a ${days}-day travel plan for ${destination}. 
    Return JSON with this structure:
    {
      "destination": "${destination}",
      "days": ${days},
      "highlights": ["top 3 must-see places"],
      "activities": ["3 recommended activities"],
      "food": ["3 must-try dishes"],
      "tips": ["2 travel tips"]
    }`;

    return this.askJSON(prompt);
  }

  /**
   * Get destination insights
   * @param {string} city - City name
   * @returns {Promise<object>} - City insights
   */
  async getCityInsights(city) {
    const prompt = `Provide insights about ${city}. Return JSON:
    {
      "city": "${city}",
      "famousFor": "what it's famous for",
      "bestTime": "best time to visit",
      "mustTry": ["3 local foods"],
      "culture": "brief cultural note",
      "tip": "one useful travel tip"
    }`;

    return this.askJSON(prompt);
  }

  /**
   * Predict travel budget
   * @param {string} destination - Where to travel
   * @param {number} days - Number of days
   * @param {string} style - Travel style (budget/moderate/luxury)
   * @returns {Promise<object>} - Budget breakdown
   */
  async predictBudget(destination, days, style = 'moderate') {
    const prompt = `Estimate ${style} travel budget for ${days} days in ${destination}.
    Return JSON:
    {
      "destination": "${destination}",
      "days": ${days},
      "style": "${style}",
      "accommodation": "estimated cost",
      "food": "estimated cost",
      "activities": "estimated cost",
      "transport": "estimated cost",
      "total": "total estimated cost",
      "currency": "USD"
    }`;

    return this.askJSON(prompt);
  }

  /**
   * Check if model is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Get model status
   * @returns {object}
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      model: this.model,
      apiKey: this.apiKey ? '✓ Set' : '✗ Missing',
      endpoint: 'Google Gemini AI'
    };
  }
}

// Create and export a single instance
export const simpleAI = new SimpleAIModel();
export default simpleAI;
