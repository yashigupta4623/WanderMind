import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DemoMode from './DemoMode';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Globe, 
  CreditCard, 
  Users, 
  Calculator,
  Cloud,
  Leaf,
  BookOpen,
  Wifi,
  ArrowRight,
  Play
} from 'lucide-react';

const FeatureModal = ({ isOpen, onClose, feature }) => {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const featureDetails = {
    'ai-planning': {
      title: 'AI-Powered Trip Planning',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Experience intelligent trip planning that adapts to your preferences, budget, and travel style.',
      benefits: [
        'Personalized itineraries based on your interests',
        'Smart budget optimization and cost predictions',
        'Hidden gems and authentic local experiences',
        'Cultural insights and travel tips'
      ],
      demoAvailable: true,
      navigateTo: '/create-trip?tab=persona'
    },
    'realtime': {
      title: 'Real-Time Adaptation',
      icon: <Zap className="w-6 h-6" />,
      description: 'Smart system that adapts your itinerary based on live conditions like weather, traffic, and events.',
      benefits: [
        'Weather-based activity recommendations',
        'Traffic optimization with alternative routes',
        'Local events and festival integration',
        'Last-minute deals and offers'
      ],
      demoAvailable: true,
      navigateTo: '/create-trip?tab=realtime'
    },
    'multilingual': {
      title: 'Multilingual Support',
      icon: <Globe className="w-6 h-6" />,
      description: 'Comprehensive language support with voice assistance in 12+ Indian languages.',
      benefits: [
        'Voice recognition in regional languages',
        'Text-to-speech for accessibility',
        'Cultural etiquette and local customs',
        'Emergency phrases and contacts'
      ],
      demoAvailable: true,
      navigateTo: '/create-trip?tab=multilingual'
    },
    'booking': {
      title: 'One-Click Booking',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Seamless booking experience with EaseMyTrip integration for complete trip reservations.',
      benefits: [
        'Book entire trip with single payment',
        'Real-time inventory from EaseMyTrip',
        'Multiple payment options (UPI, cards, wallets)',
        'Instant confirmations and e-tickets'
      ],
      demoAvailable: true,
      navigateTo: '/create-trip?tab=advanced'
    },
    'personas': {
      title: 'Travel Personas',
      icon: <Users className="w-6 h-6" />,
      description: 'Choose from 6 distinct travel personas to get recommendations tailored to your style.',
      benefits: [
        'Heritage Explorer for cultural experiences',
        'Adventure Seeker for thrilling activities',
        'Luxury Nomad for premium experiences',
        'Food Explorer for culinary adventures'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=persona'
    },
    'budget': {
      title: 'Smart Budget Planning',
      icon: <Calculator className="w-6 h-6" />,
      description: 'AI-powered budget optimization that maximizes value while staying within your limits.',
      benefits: [
        'Intelligent cost predictions',
        'Budget breakdown by categories',
        'Money-saving recommendations',
        'Flexible payment options'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=budget'
    },
    'group': {
      title: 'Group Travel Planning',
      icon: <Users className="w-6 h-6" />,
      description: 'Collaborative planning that combines multiple travelers\' preferences into one optimized itinerary.',
      benefits: [
        'Multi-user preference consolidation',
        'Group consensus building tools',
        'Shared decision making',
        'Cost splitting and management'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=group'
    },
    'weather': {
      title: 'Weather Adaptation',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Real-time weather monitoring with smart activity recommendations and alternatives.',
      benefits: [
        '7-day weather forecasts',
        'Weather-dependent activity suggestions',
        'Indoor/outdoor alternatives',
        'Seasonal travel optimization'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=advanced'
    },
    'eco': {
      title: 'Eco-Friendly Travel',
      icon: <Leaf className="w-6 h-6" />,
      description: 'Sustainability-focused travel planning with carbon footprint tracking and green alternatives.',
      benefits: [
        'Carbon footprint calculations',
        'Eco-friendly accommodation options',
        'Sustainable transport recommendations',
        'Environmental impact scoring'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=advanced'
    },
    'story': {
      title: 'Trip Story Generator',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'AI-generated travel stories that capture your journey in engaging, shareable narratives.',
      benefits: [
        '6 different story styles',
        'Shareable social media content',
        'Professional travel narratives',
        'Memory preservation'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=advanced'
    },
    'offline': {
      title: 'Offline Mode',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Progressive Web App capabilities that let you access your itinerary without internet.',
      benefits: [
        'Download trips for offline access',
        'Works without internet connection',
        'Cached maps and information',
        'Emergency contact access'
      ],
      demoAvailable: false,
      navigateTo: '/create-trip?tab=advanced'
    }
  };

  const currentFeature = featureDetails[feature] || featureDetails['ai-planning'];

  const handleTryFeature = () => {
    onClose();
    navigate(currentFeature.navigateTo);
  };

  const handleDemoComplete = (featureType) => {
    setShowDemo(false);
    handleTryFeature();
  };

  if (showDemo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentFeature.icon}
              {currentFeature.title} Demo
            </DialogTitle>
          </DialogHeader>
          <DemoMode 
            feature={feature} 
            onComplete={handleDemoComplete}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentFeature.icon}
            {currentFeature.title}
          </DialogTitle>
          <DialogDescription>
            {currentFeature.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feature Benefits */}
          <div>
            <h4 className="font-semibold mb-3">Key Benefits:</h4>
            <div className="space-y-2">
              {currentFeature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Section */}
          {currentFeature.demoAvailable && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-purple-800">Interactive Demo Available</h4>
                  <p className="text-sm text-purple-600">
                    See this feature in action with a guided demonstration
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDemo(true)}
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
          )}

          {/* Feature Status */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              ✅ Available Now
            </Badge>
            <Badge variant="secondary">
              🚀 Production Ready
            </Badge>
            {currentFeature.demoAvailable && (
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                🎬 Demo Available
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleTryFeature} className="flex-1">
              <ArrowRight className="w-4 h-4 mr-2" />
              Try This Feature
            </Button>
            {currentFeature.demoAvailable && (
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(true)}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo First
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal;