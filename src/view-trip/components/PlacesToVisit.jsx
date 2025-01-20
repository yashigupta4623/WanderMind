import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  // Parse the tripData JSON string
  const tripData = trip?.tripData ? JSON.parse(trip.tripData) : {};

  console.log("Parsed tripData:", tripData); // Debug: Check parsed tripData
  console.log("Itinerary array:", tripData?.itinerary); // Debug: Check itinerary array

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Places to Visit</h2>
      <div className="flex overflow-x-auto space-x-4">
        {Array.isArray(tripData?.itinerary) && tripData.itinerary.length > 0 ? (
          tripData.itinerary.map((item, index) => (
            <div key={index} className="min-w-[300px] bg-white rounded-lg shadow-md p-4">
              <h2 className="font-medium text-lg">{item.day}</h2>
              <div className="grid gap-5">
                {console.log("Day:", item.day, "Plan:", item.plan)} {/* Debug: Check each day's plan */}
                {Array.isArray(item.plan) && item.plan.length > 0 ? (
                  item.plan.map((place, placeIndex) => (
                    <div key={placeIndex} className="h-full">
                      <PlaceCardItem place={place} />
                    </div>
                  ))
                ) : (
                  <div>No places available for this day</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No itinerary available</div>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;