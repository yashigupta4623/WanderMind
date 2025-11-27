// Vertex AI Service for WanderMind
// Enterprise-grade AI with better rate limits and monitoring

class VertexAIService {
  constructor() {
    this.projectId = import.meta.env.VITE_GCP_PROJECT_ID;
    this.location = import.meta.env.VITE_VERTEX_AI_LOCATION || 'us-central1';
    this.model = import.meta.env.VITE_VERTEX_AI_MODEL || 'gemini-1.5-flash';
    this.apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    this.enabled = import.meta.env.VITE_USE_VERTEX_AI === 'true';
  }

  /**
   * Generate content using Vertex AI
   */
  async generateContent(prompt, config = {}) {
    if (!this.enabled || !this.projectId || !this.apiKey) {
      console.log('Vertex AI not configured, falling back to Gemini');
      return null;
    }

    try {
      const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.model}:generateContent`;

      const requestBody = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: config.temperature || 1,
          topP: config.topP || 0.95,
          topK: config.topK || 40,
          maxOutputTokens: config.maxOutputTokens || 8192,
          responseMimeType: config.responseMimeType || 'application/json'
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Vertex AI error:', error);
        throw new Error(`Vertex AI request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract text from response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No content in Vertex AI response');
      }

      return {
        text: () => text,
        response: data,
        source: 'vertex-ai'
      };

    } catch (error) {
      console.error('Vertex AI generation error:', error);
      throw error;
    }
  }

  /**
   * Generate trip itinerary using Vertex AI
   */
  async generateTripItinerary(prompt) {
    return this.generateContent(prompt, {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    });
  }

  /**
   * Generate hotel recommendations using Vertex AI
   */
  async generateHotelRecommendations(prompt) {
    return this.generateContent(prompt, {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    });
  }

  /**
   * Generate city insights using Vertex AI
   */
  async generateCityInsights(cityName) {
    const prompt = `Provide detailed local insights about ${cityName} in JSON format with the following structure:
    {
      "famousFor": "What the city is most famous for (brief)",
      "icon": "A single emoji that represents the city",
      "description": "A 2-3 sentence description of what makes this city unique",
      "mustTry": ["5 must-try local foods/dishes"],
      "traditions": ["4 local traditions, festivals, or cultural practices"],
      "history": "A 2-3 sentence historical background",
      "shopping": ["4 popular shopping items or markets"],
      "travelTips": ["3 practical travel tips"],
      "bestTime": "Best time to visit (brief)"
    }
    
    Make it informative, engaging, and accurate. Focus on authentic local experiences.`;

    return this.generateContent(prompt, {
      temperature: 0.9,
      responseMimeType: 'application/json'
    });
  }

  /**
   * Check if Vertex AI is available and configured
   */
  isAvailable() {
    return this.enabled && !!this.projectId && !!this.apiKey;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      configured: this.isAvailable(),
      projectId: this.projectId ? '✓' : '✗',
      location: this.location,
      model: this.model,
      apiKey: this.apiKey ? '✓' : '✗'
    };
  }
}

export const vertexAI = new VertexAIService();
export default vertexAI;
