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
