import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
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

  // const handleImageError = (e) => {
  //   e.target.src = "/placeholder.jpg"; // Fallback image
  // };

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 mb-6 text-center">Hotel Recommendations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Handle both old and new data structures */}
        {(tripData?.hotels?.length > 0 || tripData?.accommodationOptions?.length > 0) ? (
          (tripData?.hotels || tripData?.accommodationOptions || []).map((hotel, index) => {
            // Adapt new structure to old structure
            const adaptedHotel = {
              hotelName: hotel.hotelName || hotel.name,
              hotelAddress: hotel.hotelAddress || hotel.address,
              price: hotel.price || hotel.pricePerNight || hotel.totalCost,
              rating: hotel.rating,
              hotelImageUrl: hotel.hotelImageUrl || hotel.imageUrl
            };
            return <HotelCardItem key={index} hotel={adaptedHotel} />;
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500 mb-4">
              {trip?.tripData ? 'No hotels found in trip data' : 'Trip data is loading...'}
            </div>
            {/* Debug info */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>Trip Data Type: {typeof trip?.tripData}</p>
              <p>Parsed Data Keys: {Object.keys(tripData || {}).join(', ')}</p>
              <p>Hotels Array: {tripData?.hotels ? `${tripData.hotels.length} items` : 'undefined'}</p>
              <p>Accommodation Options: {tripData?.accommodationOptions ? `${tripData.accommodationOptions.length} items` : 'undefined'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;