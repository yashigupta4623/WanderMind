// AI-Powered ChatBot Component
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Debug: Log component mount
    useEffect(() => {
        console.log('ChatBot component mounted');
    }, []);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: "Hi! I'm WanderBot, your AI travel assistant. How can I help you plan your perfect trip today?",
            timestamp: new Date(),
            suggestions: [
                "Plan a weekend getaway",
                "Find cheap flights",
                "Recommend destinations",
                "Help with bookings"
            ]
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Predefined responses for common queries
    const predefinedResponses = {
        greetings: [
            "Hello! Ready to explore the world?",
            "Hi there! Where would you like to travel?",
            "Welcome! I'm here to help with your travel plans."
        ],
        destinations: [
            "I'd recommend checking out Goa for beaches, Himachal for mountains, or Rajasthan for culture. What type of experience are you looking for?",
            "Popular destinations include Kerala backwaters, Ladakh adventures, or Golden Triangle tours. What's your travel style?",
            "For international trips, consider Dubai, Thailand, or Singapore. What's your budget range?"
        ],
        booking: [
            "I can help you find the best deals! What type of booking do you need - flights, hotels, or complete packages?",
            "Let me connect you with our booking system. Are you looking for domestic or international travel?",
            "I'll help you compare prices across different options. When are you planning to travel?"
        ],
        budget: [
            "Budget travel tips: Book in advance, travel during off-season, consider homestays, and use public transport.",
            "For budget-friendly destinations, try Rishikesh, Pushkar, Hampi, or McLeod Ganj. All offer great value!",
            "I can help you plan within your budget. What's your approximate budget range per person?"
        ]
    };

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    // Analyze message intent
    const analyzeIntent = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'greetings';
        }
        if (lowerMessage.includes('destination') || lowerMessage.includes('place') || lowerMessage.includes('where')) {
            return 'destinations';
        }
        if (lowerMessage.includes('book') || lowerMessage.includes('reservation') || lowerMessage.includes('ticket')) {
            return 'booking';
        }
        if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
            return 'budget';
        }
        if (lowerMessage.includes('flight') || lowerMessage.includes('hotel') || lowerMessage.includes('train')) {
            return 'booking';
        }

        return 'general';
    };

    // Get AI response
    const getAIResponse = async (userMessage) => {

        const intent = analyzeIntent(userMessage);
        let response;
        let suggestions = [];

        switch (intent) {
            case 'greetings':
                response = predefinedResponses.greetings[Math.floor(Math.random() * predefinedResponses.greetings.length)];
                suggestions = ["Plan a trip", "Find destinations", "Check prices", "Travel tips"];
                break;

            case 'destinations':
                response = predefinedResponses.destinations[Math.floor(Math.random() * predefinedResponses.destinations.length)];
                suggestions = ["Beach destinations", "Mountain retreats", "Cultural tours", "Adventure trips"];
                break;

            case 'booking':
                response = predefinedResponses.booking[Math.floor(Math.random() * predefinedResponses.booking.length)];
                suggestions = ["Search flights", "Find hotels", "Book packages", "Compare prices"];
                break;

            case 'budget':
                response = predefinedResponses.budget[Math.floor(Math.random() * predefinedResponses.budget.length)];
                suggestions = ["Budget destinations", "Money-saving tips", "Cheap flights", "Affordable hotels"];
                break;

            default:
                response = "I'd be happy to help you with that! Could you tell me more about what you're looking for? I can assist with trip planning, bookings, destination recommendations, and travel tips.";
                suggestions = ["Plan a trip", "Find flights", "Hotel booking", "Travel advice"];
        }

        const aiResponse = { response, suggestions };

        return aiResponse;
    };

    // Handle sending message
    const handleSendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: messageText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setIsLoading(true);

        try {
            // Simulate typing delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const { response, suggestions } = await getAIResponse(messageText);

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                message: response,
                timestamp: new Date(),
                suggestions: suggestions
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                message: "I'm sorry, I'm having trouble responding right now. Please try again or contact our support team.",
                timestamp: new Date(),
                suggestions: ["Try again", "Contact support", "Browse destinations"]
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            setIsLoading(false);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-[9999]">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                    size="lg"
                >
                    <MessageCircle className="w-6 h-6" />
                </Button>
                <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Chat with WanderBot
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-96 sm:h-[500px]'
            }`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">WanderBot</h3>
                            <p className="text-xs opacity-90">AI Travel Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-white hover:bg-white/20 p-1"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-1"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${message.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-r-2xl rounded-tl-2xl'
                                        } p-3`}>
                                        <div className="flex items-start gap-2">
                                            {message.type === 'bot' && (
                                                <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            {message.type === 'user' && (
                                                <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm">{message.message}</p>
                                                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {formatTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Suggestions */}
                                        {message.suggestions && message.suggestions.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {message.suggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="text-xs bg-white/20 hover:bg-white/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full transition-colors"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-r-2xl rounded-tl-2xl p-3 max-w-[80%]">
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-4 h-4" />
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputMessage.trim() || isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatBot;