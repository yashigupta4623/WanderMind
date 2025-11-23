import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const isDemoMode = !apiKey || apiKey === 'AIzaSyDemoKey123456789';

// Track if we should use demo mode due to rate limits
let forceDemo = false;

// Debug: Log API key status (without exposing the actual key)
console.log("API Key status:", apiKey ? (isDemoMode ? "Demo Mode" : "Valid") : "Missing");

let genAI, model;

if (!isDemoMode) {
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


// Enhanced chat session with rate limit handling
export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      if (isDemoMode) {
        throw new Error("API key not configured. Please configure a valid Google Gemini API key.");
      }

      const session = model.startChat({
        generationConfig,
        history: [],
      });
      return await session.sendMessage(prompt);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
