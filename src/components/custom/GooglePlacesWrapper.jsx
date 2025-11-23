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
      toast.success(`Selected destination: ${manualInput}`);
      setManualInput(''); // Clear input after selection
    }
  };

  // If no valid API key, show manual input
  if (useManualInput) {
    return (
      <div className="space-y-3">        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={selectProps?.placeholder || "Enter destination (e.g., 'Paris, France' or 'Mumbai, India')"}
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

        {/* Popular destinations for quick selection */}
        <div className="flex flex-wrap gap-2">
          <p className="text-xs text-gray-500 w-full mb-1">Quick select:</p>
          {['Mumbai, India', 'Delhi, India', 'Goa, India', 'Jaipur, India', 'Kerala, India', 'Manali, India'].map((destination) => (
            <Button
              key={destination}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setManualInput(destination);
                const mockPlace = {
                  label: destination,
                  value: destination,
                  place_id: `manual_${Date.now()}`
                };
                if (selectProps?.onChange) {
                  selectProps.onChange(mockPlace);
                }
                if (onPlaceSelect) {
                  onPlaceSelect(mockPlace);
                }
                toast.success(`Selected destination: ${destination}`);
              }}
            >
              {destination.split(',')[0]}
            </Button>
          ))}
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
        <style>{`
          .google-places-autocomplete input {
            color: #111827 !important;
          }
          .google-places-autocomplete__input {
            color: #111827 !important;
          }
          .css-1dimb5e-singleValue {
            color: #111827 !important;
          }
          .css-qbdosj-Input {
            color: #111827 !important;
          }
          [class*="singleValue"] {
            color: #111827 !important;
          }
          [class*="Input"] input {
            color: #111827 !important;
          }
        `}</style>
        <div className="google-places-autocomplete">
          <GooglePlacesAutocomplete
            apiKey={apiKey}
            selectProps={{
              ...selectProps,
              placeholder: selectProps?.placeholder || "Search for places...",
              styles: {
                input: (provided) => ({
                  ...provided,
                  color: '#111827 !important',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#111827 !important',
                }),
                control: (provided) => ({
                  ...provided,
                  color: '#111827 !important',
                }),
              },
            }}
          />
        </div>
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