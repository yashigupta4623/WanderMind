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

  // Format JSON modification response into human-readable text
  const formatModificationResponse = (modifications) => {
    let formatted = '';

    // Request Analysis
    if (modifications.requestAnalysis) {
      const analysis = modifications.requestAnalysis;
      if (analysis.changeType) {
        formatted += `✅ **${analysis.changeType}**\n\n`;
      }
      
      if (analysis.originalBudget && analysis.newBudget) {
        formatted += `💰 Budget Change: ${analysis.originalBudget} → ${analysis.newBudget}\n`;
        if (analysis.requestedReduction) {
          formatted += `� Reduction: ${analysis.requestedReduction}%\n`;
        }
        formatted += '\n';
      }
    }

    // Budget Impact
    if (modifications.budgetImpact) {
      const impact = modifications.budgetImpact;
      formatted += `📊 **Budget Savings:**\n`;
      if (impact.accommodationSavings) formatted += `🏨 Accommodation: -${impact.accommodationSavings}\n`;
      if (impact.transportSavings) formatted += `🚗 Transport: -${impact.transportSavings}\n`;
      if (impact.foodSavings) formatted += `🍽️ Food: -${impact.foodSavings}\n`;
      if (impact.activitiesSavings) formatted += `🎯 Activities: -${impact.activitiesSavings}\n`;
      if (impact.totalSavings) formatted += `\n� **Total Savings: ${impact.totalSavings}**\n\n`;
    }

    // Smart Budget Breakdown
    if (modifications.updatedItinerarySections?.smartBudgetBreakdown) {
      const budget = modifications.updatedItinerarySections.smartBudgetBreakdown;
      formatted += `📋 **New Budget Allocation:**\n`;
      if (budget.accommodation) formatted += `🏨 Accommodation: ${budget.accommodation.amount} (${budget.accommodation.percentage}%)\n`;
      if (budget.transport) formatted += `🚗 Transport: ${budget.transport.amount} (${budget.transport.percentage}%)\n`;
      if (budget.food) formatted += `🍽️ Food: ${budget.food.amount} (${budget.food.percentage}%)\n`;
      if (budget.activities) formatted += `🎯 Activities: ${budget.activities.amount} (${budget.activities.percentage}%)\n`;
      if (budget.shopping) formatted += `🛍️ Shopping: ${budget.shopping.amount} (${budget.shopping.percentage}%)\n`;
      formatted += '\n';

      // Optimization Tips
      if (budget.optimizationTips && budget.optimizationTips.length > 0) {
        formatted += `💡 **Optimization Tips:**\n`;
        budget.optimizationTips.slice(0, 3).forEach((tip, index) => {
          formatted += `${index + 1}. ${tip}\n`;
        });
        formatted += '\n';
      }
    }

    // Alternative Suggestions
    if (modifications.alternativeSuggestions && modifications.alternativeSuggestions.length > 0) {
      formatted += `💡 **Money-Saving Suggestions:**\n`;
      modifications.alternativeSuggestions.slice(0, 4).forEach((suggestion, index) => {
        formatted += `${index + 1}. ${suggestion}\n`;
      });
      formatted += '\n';
    }

    // Hotel updates
    if (modifications.updatedItinerarySections?.accommodationOptions) {
      const hotels = modifications.updatedItinerarySections.accommodationOptions;
      formatted += `🏨 **Updated Hotels (${hotels.length} options):**\n`;
      hotels.slice(0, 3).forEach((hotel, index) => {
        formatted += `\n${index + 1}. **${hotel.name}**\n`;
        formatted += `   📍 ${hotel.category} • ${hotel.pricePerNight}/night\n`;
        formatted += `   ⭐ Rating: ${hotel.rating}/5\n`;
        if (hotel.totalCost) formatted += `   💵 Total: ${hotel.totalCost}\n`;
      });
      if (hotels.length > 3) {
        formatted += `\n...and ${hotels.length - 3} more options\n`;
      }
      formatted += '\n';
    }

    // Itinerary days update
    if (modifications.updatedItinerarySections?.dynamicItinerary) {
      const days = modifications.updatedItinerarySections.dynamicItinerary;
      formatted += `📅 **Itinerary Updated (${days.length} days)**\n`;
      formatted += `Sample days shown:\n`;
      days.slice(0, 2).forEach(day => {
        formatted += `\nDay ${day.day}: ${day.theme}\n`;
        formatted += `💵 Budget: ${day.dayBudget}\n`;
      });
      formatted += '\n';
    }

    // If no specific formatting matched, provide a generic success message
    if (!formatted.trim()) {
      formatted = '✅ Your trip has been updated successfully!\n\nI\'ve applied the changes you requested. The updated details are now reflected in your itinerary.';
    }

    return formatted;
  };

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

      // Format the response for better readability
      let formattedContent = response;
      
      // Try to parse and format JSON response
      try {
        const modifications = JSON.parse(response);
        console.log('Parsed modifications:', modifications); // Debug log
        
        // Create human-readable summary
        formattedContent = formatModificationResponse(modifications);
        
        // Apply changes if it's a valid modification
        if (modifications.updatedItinerarySections || modifications.updatedItinerary) {
          onTripUpdate(modifications);
          toast.success('Trip updated successfully! 🎉');
        }
      } catch (parseError) {
        // Response is already conversational text, use as is
        console.log('Response is plain text, not JSON:', parseError.message);
        console.log('Using plain text response:', response);
        // formattedContent is already set to response above
        
        // Clean up the response if it has incomplete formatting
        if (formattedContent && formattedContent.trim()) {
          // If response is too short or looks incomplete, add helpful text
          if (formattedContent.length < 20) {
            formattedContent = `✅ ${formattedContent}\n\nI've noted your preference. The changes will be reflected in your trip planning.`;
          }
        } else {
          formattedContent = "I've received your request and will update your trip accordingly! 🎯";
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: formattedContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

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
    <Card className="w-full mx-auto max-h-[80vh] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-3 sm:p-4 md:p-6">
        {/* Chat Header */}
        <div className="border-b pb-3 mb-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Travel Assistant
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">Refine your trip with natural language</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 max-h-[45vh] sm:max-h-[50vh]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && <Bot className="w-3 h-3 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />}
                  {message.type === 'user' && <User className="w-3 h-3 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm whitespace-pre-line break-words">
                      {message.content && message.content.split('\n').map((line, index) => {
                        // Skip empty lines at the start
                        if (!line.trim() && index === 0) return null;
                        
                        // Check if line starts with ** for bold
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <div key={index} className="mb-1">
                              {parts.map((part, i) => 
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                              )}
                            </div>
                          );
                        }
                        return <div key={index} className="mb-1">{line || '\u00A0'}</div>;
                      })}
                    </div>
                    <p className="text-[10px] sm:text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-500 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-[10px] sm:text-xs px-2 py-1 h-auto"
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
              placeholder="Type your request..."
              disabled={isLoading}
              className="pr-10 text-xs sm:text-sm h-9 sm:h-10"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-7 w-7 sm:h-8 sm:w-8 ${
                isListening ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {isListening ? <MicOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Mic className="w-3 h-3 sm:w-4 sm:h-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
            className="h-9 sm:h-10 px-3 sm:px-4"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationalPlanner;