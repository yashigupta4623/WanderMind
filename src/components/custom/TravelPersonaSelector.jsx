import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TravelPersonas, TravelThemes } from '@/constants/options';
import { Sparkles, Check } from 'lucide-react';

const TravelPersonaSelector = ({ onPersonaSelect, selectedPersona, selectedThemes = [], onDestinationSelect }) => {
  const [localSelectedPersona, setLocalSelectedPersona] = useState(selectedPersona);
  const [localSelectedThemes, setLocalSelectedThemes] = useState(selectedThemes);

  const handlePersonaSelect = (persona) => {
    setLocalSelectedPersona(persona);
    if (onPersonaSelect) {
      onPersonaSelect(persona, localSelectedThemes);
    }
  };

  const handleThemeToggle = (theme) => {
    const updatedThemes = localSelectedThemes.includes(theme.id)
      ? localSelectedThemes.filter(id => id !== theme.id)
      : [...localSelectedThemes, theme.id];
    
    setLocalSelectedThemes(updatedThemes);
    if (onPersonaSelect) {
      onPersonaSelect(localSelectedPersona, updatedThemes);
    }
  };

  const getPersonaDescription = (persona) => {
    switch (persona.title) {
      case 'Heritage Explorer':
        return 'Perfect for history buffs who love museums, monuments, and cultural experiences';
      case 'Adventure Seeker':
        return 'Ideal for thrill-seekers who enjoy outdoor activities and adrenaline-pumping experiences';
      case 'Luxury Nomad':
        return 'Designed for travelers who prefer premium experiences and high-end accommodations';
      case 'Nightlife Enthusiast':
        return 'Great for those who love vibrant nightlife, bars, and entertainment scenes';
      case 'Nature Lover':
        return 'Perfect for wildlife enthusiasts and those who enjoy natural landscapes';
      case 'Food Explorer':
        return 'Ideal for culinary adventurers who want to taste authentic local cuisines';
      default:
        return persona.desc;
    }
  };

  return (
    <div className="space-y-6">
      {/* Persona Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2196f3]" />
            Choose Your Travel Persona
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Select a persona that matches your travel style for personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TravelPersonas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700 ${
                  localSelectedPersona?.id === persona.id
                    ? 'ring-2 ring-[#2196f3] bg-[#e3f2fd] dark:bg-[#0b1e3a]'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{persona.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{persona.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {getPersonaDescription(persona)}
                      </p>
                    </div>
                    {localSelectedPersona?.id === persona.id && (
                      <div className="flex justify-center">
                        <Badge variant="default" className="bg-[#2196f3] text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Travel Themes</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Select additional themes to further customize your itinerary (optional)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {TravelThemes.map((theme) => (
              <Button
                key={theme.id}
                variant={localSelectedThemes.includes(theme.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeToggle(theme)}
                className="flex items-center gap-2"
              >
                <span>{theme.icon}</span>
                <span>{theme.name}</span>
                {localSelectedThemes.includes(theme.id) && (
                  <Check className="w-3 h-3" />
                )}
              </Button>
            ))}
          </div>
          
          {localSelectedThemes.length > 0 && (
            <div className="mt-4 p-3 bg-[#e3f2fd] dark:bg-[#0b1e3a] rounded-lg">
              <h4 className="font-medium text-[#0d47a1] dark:text-[#90caf9] mb-2">Selected Themes:</h4>
              <div className="flex flex-wrap gap-2">
                {localSelectedThemes.map((themeId) => {
                  const theme = TravelThemes.find(t => t.id === themeId);
                  return (
                    <Badge key={themeId} variant="secondary" className="bg-[#bbdefb] text-[#0d47a1] dark:bg-[#1565c0] dark:text-white">
                      {theme?.icon} {theme?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Persona Benefits */}
      {localSelectedPersona && (
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{localSelectedPersona.icon}</div>
              <div>
                <h4 className="font-semibold text-[#2196f3] dark:text-[#90caf9]">
                  {localSelectedPersona.title} Benefits
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                  <li>• Personalized recommendations based on your interests</li>
                  <li>• Optimized itinerary for your travel style</li>
                  <li>• Hidden gems and local experiences</li>
                  <li>• Budget allocation suited to your preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Destinations */}
      {localSelectedPersona && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <span className="text-2xl">{localSelectedPersona.icon}</span>
              Recommended Destinations for {localSelectedPersona.title}
            </CardTitle>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Based on your travel style, here are some perfect destinations to explore
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getRecommendedDestinations(localSelectedPersona.title).map((dest, idx) => (
                <button
                  key={idx}
                  onClick={() => onDestinationSelect && onDestinationSelect(dest.name)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{dest.icon}</span>
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">{dest.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{dest.reason}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                        Click to select →
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                💡 <strong>Tip:</strong> Click on any destination to auto-fill it in the Details tab!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to get recommended destinations based on persona
const getRecommendedDestinations = (personaTitle) => {
  const destinations = {
    'Heritage Explorer': [
      { name: 'Jaipur', icon: '🏰', reason: 'Rich Rajput heritage & palaces' },
      { name: 'Agra', icon: '🕌', reason: 'Mughal architecture & Taj Mahal' },
      { name: 'Varanasi', icon: '🕉️', reason: 'Ancient spiritual capital' },
      { name: 'Hampi', icon: '⛰️', reason: 'UNESCO World Heritage ruins' },
      { name: 'Delhi', icon: '🏛️', reason: 'Historical monuments & museums' },
      { name: 'Khajuraho', icon: '🛕', reason: 'Ancient temple architecture' }
    ],
    'Adventure Seeker': [
      { name: 'Manali', icon: '🏔️', reason: 'Trekking & mountain sports' },
      { name: 'Rishikesh', icon: '🌊', reason: 'River rafting & bungee jumping' },
      { name: 'Leh-Ladakh', icon: '🏍️', reason: 'High-altitude biking adventures' },
      { name: 'Goa', icon: '🏄', reason: 'Water sports & beach activities' },
      { name: 'Coorg', icon: '🌲', reason: 'Jungle trekking & camping' },
      { name: 'Andaman', icon: '🤿', reason: 'Scuba diving & snorkeling' }
    ],
    'Luxury Nomad': [
      { name: 'Udaipur', icon: '👑', reason: 'Royal palaces & luxury resorts' },
      { name: 'Goa', icon: '🏖️', reason: 'Premium beach resorts' },
      { name: 'Mumbai', icon: '🌆', reason: 'Luxury hotels & fine dining' },
      { name: 'Jaipur', icon: '🏰', reason: 'Heritage hotels & royal experiences' },
      { name: 'Kerala', icon: '🛥️', reason: 'Luxury houseboats & spas' },
      { name: 'Shimla', icon: '⛰️', reason: 'Colonial luxury & hill stations' }
    ],
    'Nightlife Enthusiast': [
      { name: 'Mumbai', icon: '🌃', reason: 'Vibrant clubs & bars' },
      { name: 'Bangalore', icon: '🍺', reason: 'Pub capital of India' },
      { name: 'Goa', icon: '🎉', reason: 'Beach parties & nightlife' },
      { name: 'Delhi', icon: '🎭', reason: 'Diverse entertainment scene' },
      { name: 'Pune', icon: '🎵', reason: 'Live music & nightclubs' },
      { name: 'Kolkata', icon: '🎪', reason: 'Cultural nightlife & events' }
    ],
    'Nature Lover': [
      { name: 'Munnar', icon: '🌿', reason: 'Tea gardens & hill stations' },
      { name: 'Ooty', icon: '🌺', reason: 'Botanical gardens & nature' },
      { name: 'Jim Corbett', icon: '🐅', reason: 'Wildlife safari & forests' },
      { name: 'Darjeeling', icon: '🏔️', reason: 'Himalayan views & tea estates' },
      { name: 'Wayanad', icon: '🦋', reason: 'Wildlife & waterfalls' },
      { name: 'Kaziranga', icon: '🦏', reason: 'Rhino sanctuary & nature' }
    ],
    'Food Explorer': [
      { name: 'Delhi', icon: '🍛', reason: 'Street food paradise' },
      { name: 'Mumbai', icon: '🥘', reason: 'Diverse culinary scene' },
      { name: 'Kolkata', icon: '🍰', reason: 'Bengali sweets & cuisine' },
      { name: 'Lucknow', icon: '🍖', reason: 'Awadhi & Mughlai cuisine' },
      { name: 'Hyderabad', icon: '🍚', reason: 'Biryani & Nizami food' },
      { name: 'Amritsar', icon: '🫓', reason: 'Punjabi cuisine & langar' }
    ]
  };

  return destinations[personaTitle] || destinations['Heritage Explorer'];
};

export default TravelPersonaSelector;