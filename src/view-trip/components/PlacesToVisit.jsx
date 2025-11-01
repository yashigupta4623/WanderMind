import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  // Parse the tripData JSON string with error handling
  let tripData = {};
  
  try {
    if (trip?.tripData) {
      // Check if tripData is already an object or a string
      if (typeof trip.tripData === 'string') {
        tripData = JSON.parse(trip.tripData);
      } else {
        tripData = trip.tripData;
      }
    }
  } catch (error) {
    console.error("Error parsing trip data:", error);
    console.log("Raw tripData:", trip?.tripData);
  }

  // Debug logs removed - everything working correctly

  return (
    <div>
    <h2 className="font-bold text-2xl mt-5 mb-6 text-center">
  Places to Visit
</h2>


      <div>
        {/* Handle both old and new data structures */}
        {(tripData?.itinerary?.length > 0 || tripData?.dynamicItinerary?.length > 0) ? (
          (tripData?.itinerary || tripData?.dynamicItinerary || []).map((item, index) => (
            <div key={index}>
              <h2 className='font-medium text-lg my-2 text-blue-600'>
                Itinerary for Day {item.day || index + 1}
              </h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {/* Handle both plan and timeline structures */}
                {(item.plan || item.timeline || []).map((place, placeIndex) => {
                  // Adapt new structure to old structure
                  const adaptedPlace = {
                    placeName: place.placeName || place.activity || place.location,
                    placeDetails: place.placeDetails || place.description,
                    ticketPricing: place.ticketPricing || place.cost,
                    rating: place.rating,
                    travelTime: place.travelTime || place.duration || place.timeTravel,
                    bestTimetoVisit: place.bestTimetoVisit || place.time,
                    placeImageUrl: place.placeImageUrl || place.imageUrl
                  };
                  return (
                    <div key={placeIndex}>
                      <PlaceCardItem place={adaptedPlace} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              {trip?.tripData ? 'No itinerary found in trip data' : 'Trip data is loading...'}
            </div>
            {/* Debug info */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>Trip Data Type: {typeof trip?.tripData}</p>
              <p>Parsed Data Keys: {Object.keys(tripData || {}).join(', ')}</p>
              <p>Itinerary Array: {tripData?.itinerary ? `${tripData.itinerary.length} days` : 'undefined'}</p>
              <p>Dynamic Itinerary: {tripData?.dynamicItinerary ? `${tripData.dynamicItinerary.length} days` : 'undefined'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;
