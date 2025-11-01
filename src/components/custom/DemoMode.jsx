import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const DemoMode = ({ feature, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const demoScenarios = {
    'ai-planning': {
      title: 'AI-Powered Trip Planning Demo',
      description: 'Watch how AI creates a personalized itinerary for a 3-day Delhi trip',
      steps: [
        { 
          title: 'Input Analysis', 
          description: 'AI analyzes: Delhi, 3 days, ₹15,000 budget, Heritage Explorer persona',
          duration: 2000 
        },
        { 
          title: 'Route Optimization', 
          description: 'Calculating optimal routes between Red Fort, India Gate, and Qutub Minar',
          duration: 1500 
        },
        { 
          title: 'Budget Allocation', 
          description: 'Smart budget: ₹6,000 hotels, ₹4,500 food, ₹3,000 transport, ₹1,500 activities',
          duration: 2000 
        },
        { 
          title: 'Hidden Gems Discovery', 
          description: 'Found: Chandni Chowk food walk, Hauz Khas Village, Lodhi Art District',
          duration: 1800 
        },
        { 
          title: 'Itinerary Generation', 
          description: 'Complete 3-day itinerary with 12 attractions, 9 restaurants, 2 hotels',
          duration: 1000 
        }
      ]
    },
    'realtime': {
      title: 'Real-Time Adaptation Demo',
      description: 'See how the system adapts to live conditions',
      steps: [
        { 
          title: 'Weather Alert', 
          description: '⛈️ Rain detected at 2 PM - Moving outdoor activities to morning',
          duration: 2000 
        },
        { 
          title: 'Traffic Update', 
          description: '🚗 Heavy traffic on Ring Road - Suggesting metro route (saves 25 mins)',
          duration: 1500 
        },
        { 
          title: 'Event Discovery', 
          description: '🎭 Local festival at India Gate - Adding to evening itinerary',
          duration: 2000 
        },
        { 
          title: 'Deal Alert', 
          description: '💰 30% off at Spice Garden restaurant - Updated lunch recommendation',
          duration: 1500 
        },
        { 
          title: 'Itinerary Updated', 
          description: '✅ All changes applied automatically - Trip optimized in real-time',
          duration: 1000 
        }
      ]
    },
    'multilingual': {
      title: 'Multilingual Support Demo',
      description: 'Experience voice assistance in Hindi',
      steps: [
        { 
          title: 'Language Detection', 
          description: 'User speaks: "मुझे दिल्ली में घूमने की जगह बताइए"',
          duration: 2000 
        },
        { 
          title: 'Voice Processing', 
          description: 'AI understands: Request for Delhi sightseeing recommendations',
          duration: 1500 
        },
        { 
          title: 'Response Generation', 
          description: 'Generating response in Hindi with cultural context',
          duration: 2000 
        },
        { 
          title: 'Voice Output', 
          description: '🔊 "लाल किला, इंडिया गेट, और कुतुब मीनार देखने जा सकते हैं"',
          duration: 2000 
        },
        { 
          title: 'Cultural Tips', 
          description: 'Added local etiquette and essential Hindi phrases',
          duration: 1000 
        }
      ]
    },
    'booking': {
      title: 'One-Click Booking Demo',
      description: 'Complete trip booking in seconds',
      steps: [
        { 
          title: 'Trip Selection', 
          description: 'Selected: 3 hotels, 2 cabs, 4 activities - Total: ₹14,750',
          duration: 1500 
        },
        { 
          title: 'Inventory Check', 
          description: 'Checking EaseMyTrip inventory - All items available',
          duration: 2000 
        },
        { 
          title: 'Payment Processing', 
          description: 'Secure payment via UPI - Transaction ID: EMT123456789',
          duration: 2500 
        },
        { 
          title: 'Confirmations', 
          description: 'Booking confirmed - E-tickets sent to email and SMS',
          duration: 1500 
        },
        { 
          title: 'Trip Ready', 
          description: '🎉 Complete trip booked! Saved ₹2,250 with smart recommendations',
          duration: 1000 
        }
      ]
    }
  };

  const currentDemo = demoScenarios[feature] || demoScenarios['ai-planning'];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setIsCompleted(false);
    playStep(0);
  };

  const playStep = (stepIndex) => {
    if (stepIndex >= currentDemo.steps.length) {
      setIsPlaying(false);
      setIsCompleted(true);
      toast.success('Demo completed! Ready to try the real feature?');
      return;
    }

    setCurrentStep(stepIndex);
    
    setTimeout(() => {
      if (stepIndex < currentDemo.steps.length - 1) {
        playStep(stepIndex + 1);
      } else {
        setIsPlaying(false);
        setIsCompleted(true);
        toast.success('Demo completed!');
      }
    }, currentDemo.steps[stepIndex].duration);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {currentDemo.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{currentDemo.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isPlaying && !isCompleted && (
            <Button onClick={startDemo} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Demo
            </Button>
          )}
          
          {isPlaying && (
            <Button variant="outline" onClick={pauseDemo} className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          
          <Button variant="outline" onClick={resetDemo} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentStep + (isCompleted ? 1 : 0)) / currentDemo.steps.length) * 100}%` 
            }}
          />
        </div>

        {/* Demo Steps */}
        <div className="space-y-3">
          {currentDemo.steps.map((step, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border transition-all ${
                index === currentStep && isPlaying
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse'
                  : index < currentStep || isCompleted
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStep && isPlaying
                    ? 'bg-blue-500 text-white'
                    : index < currentStep || isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep || isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index === currentStep && isPlaying && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Demo Results */}
        {isCompleted && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Demo Completed!</h4>
                  <p className="text-sm text-green-700">
                    Ready to experience the real feature? Click below to get started.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={() => onComplete && onComplete(feature)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Try Real Feature
                </Button>
                <Button variant="outline" onClick={resetDemo}>
                  Watch Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Benefits */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm font-medium">Lightning Fast</div>
            <div className="text-xs text-gray-600">Results in seconds</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium">Highly Accurate</div>
            <div className="text-xs text-gray-600">AI-powered precision</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm font-medium">Cost Effective</div>
            <div className="text-xs text-gray-600">Save 15-25% on trips</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-sm font-medium">Personalized</div>
            <div className="text-xs text-gray-600">Tailored to you</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoMode;