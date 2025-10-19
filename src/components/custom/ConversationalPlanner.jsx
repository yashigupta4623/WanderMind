import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { chatSession } from '@/service/AIModel';
import { CHAT_REFINEMENT_PROMPT } from '@/constants/options';
import { toast } from 'sonner';

const ConversationalPlanner = ({ currentTrip, onTripUpdate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your travel assistant. You can ask me to modify your trip like 'Add a day in Manali' or 'Reduce budget to ₹20K'. How can I help you refine your travel plan?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    if (!recognition.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = CHAT_REFINEMENT_PROMPT
        .replace('{currentTrip}', JSON.stringify(currentTrip))
        .replace('{userMessage}', inputMessage);

      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Try to parse and apply changes if it's a valid modification
      try {
        const modifications = JSON.parse(response);
        if (modifications.updatedItinerary) {
          onTripUpdate(modifications);
        }
      } catch (e) {
        // Response is conversational, not a modification
      }

    } catch (error) {
      console.error('Error in conversation:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I couldn't process that request. Could you please rephrase it?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Add a day in the mountains",
    "Reduce budget by 20%",
    "Make it more adventurous",
    "Find cheaper hotels",
    "Add local food experiences",
    "Remove expensive activities"
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Chat Header */}
        <div className="border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            Travel Assistant
          </h3>
          <p className="text-sm text-gray-500">Refine your trip with natural language</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                  {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your request... (e.g., 'Add a day in Goa' or 'Reduce budget to ₹15K')"
              disabled={isLoading}
              className="pr-12"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 ${
                isListening ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationalPlanner;