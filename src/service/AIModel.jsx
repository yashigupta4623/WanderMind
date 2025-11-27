import { GoogleGenerativeAI } from "@google/generative-ai";
import { vertexAI } from "./VertexAIModel";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const useVertexAI = import.meta.env.VITE_USE_VERTEX_AI === 'true';

// Debug: Log API key status (without exposing the actual key)
console.log("Gemini API Key status:", apiKey ? "Configured" : "Missing");
console.log("Vertex AI status:", vertexAI.getStatus());

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

// Enhanced chat session with Vertex AI fallback
export const chatSession = {
  sendMessage: async (prompt) => {
    // Try Vertex AI first if enabled
    if (useVertexAI && vertexAI.isAvailable()) {
      try {
        console.log('Using Vertex AI for generation...');
        const result = await withTimeout(vertexAI.generateContent(prompt, {
          temperature: generationConfig.temperature,
          topP: generationConfig.topP,
          topK: generationConfig.topK,
          maxOutputTokens: generationConfig.maxOutputTokens,
          responseMimeType: generationConfig.responseMimeType
        }), 30000);
        
        if (result) {
          console.log('✓ Vertex AI generation successful');
          return { response: result };
        }
      } catch (error) {
        console.warn('Vertex AI failed, falling back to Gemini:', error.message);
      }
    }

    // Fallback to Gemini AI
    try {
      if (!apiKey) {
        throw new Error("API key not configured. Please configure a valid Google Gemini API key.");
      }

      if (!model) {
        throw new Error("AI model not initialized. Please check your API configuration.");
      }

      console.log('Using Gemini AI for generation...');
      const session = model.startChat({
        generationConfig,
        history: [],
      });

      // Wrap with 30-second timeout
      const result = await withTimeout(session.sendMessage(prompt), 30000);
      console.log('✓ Gemini AI generation successful');
      return result;
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
