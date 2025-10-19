import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TravelPersonas, TravelThemes } from '@/constants/options';
import { Sparkles, Check } from 'lucide-react';

const TravelPersonaSelector = ({ onPersonaSelect, selectedPersona, selectedThemes = [] }) => {
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
            <Sparkles className="w-5 h-5 text-purple-500" />
            Choose Your Travel Persona
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select a persona that matches your travel style for personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TravelPersonas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  localSelectedPersona?.id === persona.id
                    ? 'ring-2 ring-purple-500 bg-purple-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{persona.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{persona.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getPersonaDescription(persona)}
                      </p>
                    </div>
                    {localSelectedPersona?.id === persona.id && (
                      <div className="flex justify-center">
                        <Badge variant="default" className="bg-purple-500">
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
          <p className="text-sm text-gray-600">
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Selected Themes:</h4>
              <div className="flex flex-wrap gap-2">
                {localSelectedThemes.map((themeId) => {
                  const theme = TravelThemes.find(t => t.id === themeId);
                  return (
                    <Badge key={themeId} variant="secondary" className="bg-blue-100 text-blue-800">
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
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{localSelectedPersona.icon}</div>
              <div>
                <h4 className="font-semibold text-purple-800">
                  {localSelectedPersona.title} Benefits
                </h4>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
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
    </div>
  );
};

export default TravelPersonaSelector;