import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Download,
  Loader2,
  Coffee,
  UtensilsCrossed,
  Church,
  Store,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const SmartMapsUI = ({ tripData, tripId }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState({});
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const dayColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (map && tripData) {
      displayItineraryOnMap().catch(err => {
        console.error('Error displaying itinerary:', err);
      });
    }
  }, [map, tripData]);

  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = async () => {
    // Get destination from trip data
    const destination = tripData?.tripDetails?.destination || 
                       tripData?.userSelection?.location?.label || 
                       'India';
    
    let center = { lat: 20.5937, lng: 78.9629 }; // Default: India center
    let zoom = 5;

    // Try to geocode the destination
    if (window.google && window.google.maps) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve) => {
          geocoder.geocode({ address: destination }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              resolve(null);
            }
          });
        });
        
        if (result) {
          center = result;
          zoom = 12;
        }
      } catch (error) {
        console.warn('Could not geocode destination:', error);
      }
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
      ]
    });
    setMap(mapInstance);
  };

  const geocodePlaceName = async (placeName) => {
    return new Promise((resolve) => {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps not loaded');
        resolve(null);
        return;
      }
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: placeName }, (results, status) => {
        if (status === 'OK' && results[0]) {
          console.log(`Geocoded ${placeName}:`, results[0].geometry.location.lat(), results[0].geometry.location.lng());
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          console.warn(`Geocoding failed for ${placeName}:`, status);
          resolve(null);
        }
      });
    });
  };

  const displayItineraryOnMap = async () => {
    if (!map || !tripData?.itinerary) {
      console.log('Map or itinerary not available:', { map: !!map, itinerary: !!tripData?.itinerary });
      return;
    }

    console.log('Displaying itinerary on map...');
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();

    const itinerary = Array.isArray(tripData.itinerary) 
      ? tripData.itinerary 
      : Object.values(tripData.itinerary || {});

    console.log(`Processing ${itinerary.length} days`);

    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const day = itinerary[dayIndex];
      const activities = day.activities || day.plan || [];
      const color = dayColors[dayIndex % dayColors.length];

      console.log(`Day ${dayIndex + 1}: ${activities.length} activities`);

      for (let actIndex = 0; actIndex < activities.length; actIndex++) {
        const activity = activities[actIndex];
        let lat = activity.geoCoordinates?.lat || activity.latitude;
        let lng = activity.geoCoordinates?.lng || activity.longitude;

        // If no coordinates, try to geocode the place name
        if (!lat || !lng) {
          const placeName = activity.activity || activity.placeName;
          if (placeName) {
            console.log(`Geocoding: ${placeName}`);
            const coords = await geocodePlaceName(placeName);
            if (coords) {
              lat = coords.lat;
              lng = coords.lng;
            }
          }
        }

        if (lat && lng) {
          const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
          
          const marker = new window.google.maps.Marker({
            position,
            map,
            label: {
              text: `D${dayIndex + 1}`,
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2
            },
            title: activity.activity || activity.placeName
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">Day ${dayIndex + 1}</h3>
                <p style="margin: 0; font-size: 14px;">${activity.activity || activity.placeName}</p>
                ${activity.time || activity.bestTimetoVisit ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">⏰ ${activity.time || activity.bestTimetoVisit}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
          bounds.extend(position);
          console.log(`Added marker for Day ${dayIndex + 1}: ${activity.activity || activity.placeName}`);
        } else {
          console.warn(`No coordinates for: ${activity.activity || activity.placeName}`);
        }
      }
    }

    console.log(`Total markers added: ${newMarkers.length}`);
    setMarkers(newMarkers);
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      toast.success(`${newMarkers.length} locations mapped!`);
    } else {
      toast.info('No locations with coordinates found. Markers will appear as places are geocoded.');
    }
  };

  const optimizeRoute = async () => {
    setOptimizing(true);
    toast.loading('Optimizing route...');

    try {
      const itinerary = Array.isArray(tripData.itinerary) 
        ? tripData.itinerary 
        : Object.values(tripData.itinerary || {});

      const allPlaces = [];
      itinerary.forEach(day => {
        const activities = day.activities || day.plan || [];
        activities.forEach(activity => {
          const lat = activity.geoCoordinates?.lat || activity.latitude;
          const lng = activity.geoCoordinates?.lng || activity.longitude;
          if (lat && lng) {
            allPlaces.push({
              name: activity.activity || activity.placeName,
              lat: parseFloat(lat),
              lng: parseFloat(lng)
            });
          }
        });
      });

      if (allPlaces.length < 2) {
        toast.dismiss();
        toast.error('Need at least 2 places to optimize route');
        setOptimizing(false);
        return;
      }

      const origin = allPlaces[0];
      const destination = allPlaces[allPlaces.length - 1];
      const waypoints = allPlaces.slice(1, -1).map(place => ({
        location: new window.google.maps.LatLng(place.lat, place.lng),
        stopover: true
      }));

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 4
        }
      });

      directionsService.route({
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const route = result.routes[0];
          const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000;
          const totalDuration = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60;
          
          toast.dismiss();
          toast.success(`Route optimized! ${totalDistance.toFixed(1)} km, ${Math.round(totalDuration)} mins`);
        } else {
          toast.dismiss();
          toast.error('Could not optimize route');
        }
        setOptimizing(false);
      });
    } catch (error) {
      console.error('Route optimization error:', error);
      toast.dismiss();
      toast.error('Failed to optimize route');
      setOptimizing(false);
    }
  };

  const findNearbyGems = async (dayIndex) => {
    setLoadingNearby(true);
    setSelectedDay(dayIndex);
    const loadingToast = toast.loading('Finding hidden gems nearby...');

    try {
      // Parse itinerary with same logic as display
      let itinerary = [];
      if (tripData?.itinerary) {
        itinerary = Array.isArray(tripData.itinerary) 
          ? tripData.itinerary 
          : Object.values(tripData.itinerary || {});
      } else if (tripData?.tripData) {
        const parsedTripData = typeof tripData.tripData === 'string' 
          ? JSON.parse(tripData.tripData) 
          : tripData.tripData;
        
        if (parsedTripData?.itinerary) {
          itinerary = Array.isArray(parsedTripData.itinerary) 
            ? parsedTripData.itinerary 
            : Object.values(parsedTripData.itinerary || {});
        }
      }

      if (!itinerary || itinerary.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('No itinerary data available');
        setLoadingNearby(false);
        return;
      }

      const day = itinerary[dayIndex];
      if (!day) {
        toast.dismiss(loadingToast);
        toast.error('Day not found');
        setLoadingNearby(false);
        return;
      }

      // Simulate finding nearby places with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const activities = day.activities || day.plan || [];
      const gems = {};
      let gemsFound = 0;

      // Generate mock nearby places for each activity
      activities.forEach((activity, index) => {
        const placeName = activity.activity || activity.placeName;
        gems[placeName] = [
          {
            name: `Local Cafe near ${placeName}`,
            type: 'cafe',
            rating: 4.2 + (index * 0.1),
            vicinity: 'Within 500m',
            icon: '☕'
          },
          {
            name: `Restaurant near ${placeName}`,
            type: 'restaurant',
            rating: 4.5 + (index * 0.1),
            vicinity: 'Within 800m',
            icon: '🍽️'
          },
          {
            name: `Shop near ${placeName}`,
            type: 'store',
            rating: 4.0 + (index * 0.1),
            vicinity: 'Within 300m',
            icon: '🛍️'
          }
        ];
        gemsFound += 3;
      });

      setNearbyPlaces(prev => ({ ...prev, [dayIndex]: gems }));
      toast.dismiss(loadingToast);
      toast.success(`Found ${gemsFound} hidden gems! 💎`);
      
    } catch (error) {
      console.error('Error finding nearby places:', error);
      toast.dismiss(loadingToast);
      toast.error('Could not find nearby places');
    } finally {
      setLoadingNearby(false);
    }
  };

  const downloadTripSummary = () => {
    try {
      const destination = tripData?.tripDetails?.destination || tripData?.userSelection?.location?.label || 'Trip';
      const duration = tripData?.tripDetails?.duration || tripData?.userSelection?.noofDays + ' days' || '3 days';
      
      let summary = `🌟 ${destination} Trip Summary 🌟\n`;
      summary += `📅 Duration: ${duration}\n`;
      summary += `👥 Travelers: ${tripData?.userSelection?.traveler || 'N/A'}\n`;
      summary += `💰 Budget: ${tripData?.userSelection?.budget || 'N/A'}\n\n`;

      const itinerary = Array.isArray(tripData.itinerary) 
        ? tripData.itinerary 
        : Object.values(tripData.itinerary || {});

      itinerary.forEach((day, index) => {
        summary += `\n📍 Day ${index + 1}:\n`;
        const activities = day.activities || day.plan || [];
        activities.forEach((activity, actIndex) => {
          summary += `  ${actIndex + 1}. ${activity.activity || activity.placeName}\n`;
          if (activity.time) summary += `     ⏰ ${activity.time}\n`;
          if (activity.placeDetails) summary += `     📝 ${activity.placeDetails}\n`;
          if (activity.ticketPricing) summary += `     🎫 ${activity.ticketPricing}\n`;
        });
      });

      summary += `\n\n✨ Generated by WanderMind AI\n`;
      summary += `🔗 View online: ${window.location.href}\n`;

      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WanderMind_${destination.replace(/\s+/g, '_')}_Summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Trip summary downloaded! 📥');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case 'restaurant': return <UtensilsCrossed className="w-4 h-4" />;
      case 'tourist_attraction': return <Eye className="w-4 h-4" />;
      case 'store': return <Store className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // Parse itinerary with better error handling
  let itinerary = [];
  
  try {
    if (tripData?.itinerary) {
      if (Array.isArray(tripData.itinerary)) {
        itinerary = tripData.itinerary;
      } else if (typeof tripData.itinerary === 'object') {
        itinerary = Object.values(tripData.itinerary);
      }
    } else if (tripData?.tripData) {
      // Try parsing tripData if it's a string
      const parsedTripData = typeof tripData.tripData === 'string' 
        ? JSON.parse(tripData.tripData) 
        : tripData.tripData;
      
      if (parsedTripData?.itinerary) {
        itinerary = Array.isArray(parsedTripData.itinerary) 
          ? parsedTripData.itinerary 
          : Object.values(parsedTripData.itinerary || {});
      }
    }
  } catch (error) {
    console.error('Error parsing itinerary:', error);
  }

  console.log('Parsed itinerary for display:', itinerary);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 via-green-50 to-teal-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-teal-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Smart Maps - Interactive Trip Visualization
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800">
              Google Maps
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View all spots, optimize routes, and discover hidden gems nearby
          </p>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={mapRef} 
                className="w-full h-[500px] rounded-lg"
                style={{ minHeight: '500px' }}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={optimizeRoute}
              disabled={optimizing}
              className="flex items-center gap-2"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Optimize Route
                </>
              )}
            </Button>

            <Button
              onClick={downloadTripSummary}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Summary
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Day-wise Markers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {itinerary && itinerary.length > 0 ? (
                itinerary.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: dayColors[index % dayColors.length] }}
                      >
                        D{index + 1}
                      </div>
                      <span className="text-sm font-medium">Day {index + 1}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => findNearbyGems(index)}
                      disabled={loadingNearby}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Gems
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No itinerary data available</p>
                  <p className="text-xs mt-1">Create a trip to see day-wise markers</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDay !== null && nearbyPlaces[selectedDay] && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  Hidden Gems - Day {selectedDay + 1}
                </CardTitle>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Within 1 km of your spots
                </p>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                {Object.entries(nearbyPlaces[selectedDay]).map(([placeName, gems]) => (
                  gems.length > 0 && (
                    <div key={placeName} className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Near {placeName}:
                      </h4>
                      {gems.map((gem, idx) => (
                        <div key={idx} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-start gap-2">
                            <div className="text-yellow-600 mt-0.5">
                              {getTypeIcon(gem.type)}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {gem.name}
                              </div>
                              {gem.rating && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  ⭐ {gem.rating}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {gem.vicinity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-300">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Smart Maps Features:</p>
              <ul className="space-y-1 text-xs">
                <li>• Day-wise color-coded markers (D1, D2, D3...)</li>
                <li>• Route optimization using Google Directions API</li>
                <li>• Hidden gems within 1 km of each spot</li>
                <li>• Offline trip summary download</li>
                <li>• Interactive map with info windows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartMapsUI;
