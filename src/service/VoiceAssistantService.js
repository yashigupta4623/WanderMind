import { chatSession } from './AIModel';

class VoiceAssistantService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.currentLanguage = 'hi-IN'; // Default to Hindi
  }

  // Initialize speech recognition
  initSpeechRecognition(language = 'hi-IN') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false; // Set to false for better reliability
    this.recognition.interimResults = true; // Show interim results
    this.recognition.lang = language;
    this.recognition.maxAlternatives = 3; // Get multiple alternatives
    this.currentLanguage = language;

    return this.recognition;
  }

  // Start listening
  startListening(onResult, onError, onInterim) {
    if (!this.recognition) {
      this.initSpeechRecognition(this.currentLanguage);
    }

    this.isListening = true;
    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          console.log('Final voice input:', finalTranscript);
          if (onResult) {
            onResult(finalTranscript.trim());
          }
        } else {
          interimTranscript += transcript;
          if (onInterim) {
            onInterim(interimTranscript);
          }
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;

      // Provide helpful error messages
      let errorMessage = 'Voice recognition error';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not found. Please check permissions.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow access.';
      }

      if (onError) {
        onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      console.log('Speech recognition started for language:', this.currentLanguage);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.isListening = false;
      if (onError) {
        onError('Failed to start microphone. Please try again.');
      }
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text to speech with natural voice
  speak(text, language = 'hi-IN') {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Small delay to ensure cancel completes
    setTimeout(() => {
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9; // Natural speaking pace
        utterance.pitch = 1.0; // Natural pitch
        utterance.volume = 1.0; // Full volume

        // Try to find the best voice for the language
        const voices = this.synthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

        // Priority order: Google > Enhanced > Natural > Default
        let voice = voices.find(v =>
          v.lang.startsWith(language.split('-')[0]) &&
          v.name.toLowerCase().includes('google')
        );

        if (!voice) {
          voice = voices.find(v =>
            v.lang.startsWith(language.split('-')[0]) &&
            (v.name.toLowerCase().includes('enhanced') || v.name.toLowerCase().includes('premium'))
          );
        }

        if (!voice) {
          voice = voices.find(v =>
            v.lang.startsWith(language.split('-')[0]) &&
            v.name.toLowerCase().includes('natural')
          );
        }

        // Fallback to any voice for the language
        if (!voice) {
          voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
        }

        // Last fallback to any voice
        if (!voice && voices.length > 0) {
          voice = voices[0];
        }

        if (voice) {
          utterance.voice = voice;
          console.log('Using voice:', voice.name, voice.lang);
        }

        // Add event listeners for better control
        utterance.onstart = () => {
          console.log('Speech started');
        };

        utterance.onend = () => {
          console.log('Speech ended');
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event);
        };

        this.synthesis.speak(utterance);
      };

      // Ensure voices are loaded
      if (this.synthesis.getVoices().length === 0) {
        this.synthesis.onvoiceschanged = () => {
          speakWithVoice();
        };
      } else {
        speakWithVoice();
      }
    }, 100);
  }

  // Process voice command with AI
  async processVoiceCommand(voiceInput, language = 'hi') {
    const prompt = `
You are a helpful Indian travel assistant. Process this voice command and extract trip details.

Voice Input: "${voiceInput}"
Language: ${language}

Extract and return JSON with:
{
  "destination": "city name",
  "days": number,
  "budget": "budget/moderate/luxury",
  "traveler": "Solo Traveler/Couple/Family/Friends",
  "preferences": ["heritage", "food", etc],
  "language": "${language}",
  "understood": true/false,
  "response": "Friendly confirmation in ${language === 'hi' ? 'Hindi' : 'English'}"
}

Examples:
- "Mujhe 3 din ka budget friendly trip chahiye Jaipur, heritage + street food, Hindi mein batao"
  → destination: Jaipur, days: 3, budget: budget, traveler: Solo Traveler, preferences: [heritage, street food]
- "I want a 5 day luxury trip to Goa with beaches and nightlife for my family"
  → destination: Goa, days: 5, budget: luxury, traveler: Family, preferences: [beaches, nightlife]
`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();

      // Try to parse JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback parsing
      return this.fallbackParsing(voiceInput, language);
    } catch (error) {
      console.error('Voice command processing error:', error);
      return this.fallbackParsing(voiceInput, language);
    }
  }

  fallbackParsing(input, language) {
    const lowerInput = input.toLowerCase();

    // Extract destination
    const cities = ['jaipur', 'delhi', 'goa', 'mumbai', 'bangalore', 'kerala', 'agra', 'udaipur'];
    const destination = cities.find(city => lowerInput.includes(city)) || 'Delhi';

    // Extract days
    const daysMatch = lowerInput.match(/(\d+)\s*(din|day)/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;

    // Extract budget
    let budget = 'moderate';
    if (lowerInput.includes('budget') || lowerInput.includes('sasta')) {
      budget = 'budget';
    } else if (lowerInput.includes('luxury') || lowerInput.includes('luxury')) {
      budget = 'luxury';
    }

    // Extract traveler type
    let traveler = 'Solo Traveler';
    if (lowerInput.includes('family') || lowerInput.includes('parivar') || lowerInput.includes('bachchon')) {
      traveler = 'Family';
    } else if (lowerInput.includes('couple') || lowerInput.includes('partner') || lowerInput.includes('girlfriend') || lowerInput.includes('boyfriend')) {
      traveler = 'Couple';
    } else if (lowerInput.includes('friends') || lowerInput.includes('dost') || lowerInput.includes('group')) {
      traveler = 'Friends';
    }

    // Extract preferences
    const preferences = [];
    if (lowerInput.includes('heritage') || lowerInput.includes('itihas')) preferences.push('heritage');
    if (lowerInput.includes('food') || lowerInput.includes('khana')) preferences.push('food');
    if (lowerInput.includes('beach') || lowerInput.includes('samundar')) preferences.push('beach');
    if (lowerInput.includes('adventure')) preferences.push('adventure');

    return {
      destination: destination.charAt(0).toUpperCase() + destination.slice(1),
      days,
      budget,
      traveler,
      preferences,
      language,
      understood: true,
      response: language === 'hi'
        ? `Samajh gaya! ${destination} ke liye ${days} din ka ${budget} trip plan kar raha hoon.`
        : `Got it! Planning a ${days} day ${budget} trip to ${destination}.`
    };
  }

  // Change language
  setLanguage(language) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
