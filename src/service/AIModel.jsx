import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

// Debug: Log API key status (without exposing the actual key)
console.log("API Key status:", apiKey ? "Configured" : "Missing");

let genAI, model;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  } catch (error) {
    console.error("Failed to initialize Google AI:", error);
  }
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Timeout wrapper for AI requests
const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout - AI service took too long to respond')), timeoutMs)
    )
  ]);
};

// Enhanced chat session with timeout handling
export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      if (!apiKey) {
        throw new Error("API key not configured. Please configure a valid Google Gemini API key.");
      }

      if (!model) {
        throw new Error("AI model not initialized. Please check your API configuration.");
      }

      const session = model.startChat({
        generationConfig,
        history: [],
      });

      // Wrap with 30-second timeout
      return await withTimeout(session.sendMessage(prompt), 30000);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};


// Get city insights (traditions, food, history)
export const GetCityInsights = async (cityName) => {
  try {
    if (isDemoMode || forceDemo) {
      return null; // Will use curated data
    }

    const prompt = `Provide detailed local insights about ${cityName} in JSON format with the following structure:
    {
      "famousFor": "What the city is most famous for (brief)",
      "icon": "A single emoji that represents the city",
      "description": "A 2-3 sentence description of what makes this city unique",
      "mustTry": ["5 must-try local foods/dishes"],
      "traditions": ["4 local traditions, festivals, or cultural practices"],
      "history": "A 2-3 sentence historical background",
      "shopping": ["4 popular shopping items or markets"]
    }
    
    Make it informative, engaging, and accurate. Focus on authentic local experiences.`;

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting city insights:', error);
    return null; // Will fallback to curated data
  }
};
