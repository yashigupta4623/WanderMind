import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const GooglePlacesWrapper = ({ apiKey, selectProps, onPlaceSelect }) => {
  const [manualInput, setManualInput] = useState('');
  const [useManualInput, setUseManualInput] = useState(!apiKey || apiKey === 'AIzaSyDemoKey123456789');

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      const mockPlace = {
        label: manualInput,
        value: manualInput,
        place_id: `manual_${Date.now()}`
      };
      if (selectProps?.onChange) {
        selectProps.onChange(mockPlace);
      }
      if (onPlaceSelect) {
        onPlaceSelect(mockPlace);
      }
    }
  };

  // If no valid API key, show manual input
  if (useManualInput) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Google Places API key not configured. Using manual input mode.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter destination manually (e.g., 'Paris, France' or 'Mumbai, India')"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleManualSubmit}
            disabled={!manualInput.trim()}
          >
            Select
          </Button>
        </div>

        {apiKey && apiKey !== 'AIzaSyDemoKey123456789' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setUseManualInput(false)}
          >
            Use Google Places Search
          </Button>
        )}
      </div>
    );
  }

  // Try to use Google Places if API key is available
  try {
    return (
      <div className="space-y-2">
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          selectProps={{
            ...selectProps,
            placeholder: selectProps?.placeholder || "Search for places...",
          }}
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setUseManualInput(true)}
        >
          Enter destination manually
        </Button>
      </div>
    );
  } catch (error) {
    console.error('Google Places error:', error);
    toast.error('Google Places failed to load. Switching to manual input.');
    setUseManualInput(true);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-800">
            Google Places failed to load. Using manual input mode.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter destination manually (e.g., 'Paris, France' or 'Mumbai, India')"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleManualSubmit}
            disabled={!manualInput.trim()}
          >
            Select
          </Button>
        </div>
      </div>
    );
  }
};

export default GooglePlacesWrapper;