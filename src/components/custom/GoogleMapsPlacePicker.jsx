import React, { useEffect, useRef } from 'react';

const GoogleMapsPlacePicker = ({ onPlaceSelect, defaultCenter = { lat: 28.6139, lng: 77.2090 } }) => {
  const mapRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Load the Extended Component Library script
    if (!document.querySelector('script[src*="extended-component-library"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
      document.head.appendChild(script);
    }

    // Initialize the map and place picker
    const initMap = async () => {
      if (initialized.current) return;
      
      try {
        await customElements.whenDefined('gmp-map');
        
        const map = mapRef.current?.querySelector('gmp-map');
        const marker = mapRef.current?.querySelector('gmp-advanced-marker');
        const placePicker = mapRef.current?.querySelector('gmpx-place-picker');
        
        if (!map || !marker || !placePicker) return;

        // Configure map
        if (map.innerMap) {
          map.innerMap.setOptions({
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        }

        const infowindow = new google.maps.InfoWindow();

        // Listen for place changes
        placePicker.addEventListener('gmpx-placechange', () => {
          const place = placePicker.value;

          if (!place.location) {
            console.warn("No details available for input: '" + place.name + "'");
            infowindow.close();
            marker.position = null;
            return;
          }

          // Update map view
          if (place.viewport) {
            map.innerMap.fitBounds(place.viewport);
          } else {
            map.center = place.location;
            map.zoom = 17;
          }

          // Update marker
          marker.position = place.location;

          // Show info window
          infowindow.setContent(
            `<div style="padding: 8px;">
              <strong style="font-size: 14px;">${place.displayName || place.name}</strong><br>
              <span style="font-size: 12px; color: #666;">${place.formattedAddress || ''}</span>
            </div>`
          );
          infowindow.open(map.innerMap, marker);

          // Callback with place details
          if (onPlaceSelect) {
            onPlaceSelect({
              name: place.displayName || place.name,
              address: place.formattedAddress,
              location: place.location,
              placeId: place.id,
              types: place.types,
              photos: place.photos,
            });
          }
        });

        initialized.current = true;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Wait for DOM and then initialize
    const timer = setTimeout(initMap, 500);
    return () => clearTimeout(timer);
  }, [onPlaceSelect]);

  return (
    <div ref={mapRef} className="w-full h-full">
      {/* API Loader */}
      <gmpx-api-loader 
        key={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
      />
      
      {/* Map */}
      <gmp-map 
        center={`${defaultCenter.lat},${defaultCenter.lng}`}
        zoom="13" 
        map-id="DEMO_MAP_ID"
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        {/* Place Picker Control */}
        <div slot="control-block-start-inline-start" className="p-4">
          <gmpx-place-picker 
            placeholder="Search for a place or address"
            style={{
              width: '300px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          />
        </div>
        
        {/* Marker */}
        <gmp-advanced-marker />
      </gmp-map>
    </div>
  );
};

export default GoogleMapsPlacePicker;
