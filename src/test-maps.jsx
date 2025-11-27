import React, { useState } from 'react';
import GoogleMapsPlacePicker from './components/custom/GoogleMapsPlacePicker';

function TestMapsPage() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    setSelectedPlace(place);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google Maps Place Picker Test</h1>
        
        {/* Selected Place Info */}
        {selectedPlace && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Selected Place:</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedPlace.name}</p>
              <p><strong>Address:</strong> {selectedPlace.address}</p>
              <p><strong>Coordinates:</strong> {selectedPlace.location?.lat}, {selectedPlace.location?.lng}</p>
              <p><strong>Place ID:</strong> {selectedPlace.placeId}</p>
            </div>
          </div>
        )}

        {/* Map Component */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <GoogleMapsPlacePicker 
            onPlaceSelect={handlePlaceSelect}
            defaultCenter={{ lat: 28.6139, lng: 77.2090 }} // Delhi, India
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Type a place name or address in the search box</li>
            <li>Select from the autocomplete suggestions</li>
            <li>The map will center on the selected location</li>
            <li>Place details will appear above the map</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TestMapsPage;
