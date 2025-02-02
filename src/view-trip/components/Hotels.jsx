import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function Hotels({ trip }) {
  // Parse the tripData JSON string
  const tripData = trip?.tripData ? JSON.parse(trip.tripData) : {};

  console.log("Parsed tripData:", tripData); // Debug: Log the parsed tripData
  console.log("Hotels array:", tripData?.hotels); // Debug: Log the hotels array

  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg"; // Fallback image
  };

  const getGridClass = (length) => {
    if (length === 1) return 'grid-cols-1';
    if (length === 2) return 'grid-cols-2';
    if (length === 3) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div>
      <h2 className="font-bold text-xl mt-5 my-4">Hotel Recommendations</h2>
      <div className={`grid ${getGridClass(tripData?.hotels?.length)} gap-5`}>
        {tripData?.hotels?.length > 0 ? (
          tripData.hotels.map((hotel, index) => (
            <div key={index} className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md">
              <img
                src={hotel.hotelImageUrl || "/placeholder.jpg"}
                className="h-40 w-full object-cover rounded-t-xl"
                alt={hotel.hotelName}
                onError={handleImageError} // Handle image loading errors
              />
              <div className="p-4 bg-white rounded-b-xl">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg my-2 font-bold">{hotel.hotelName}</h2>
                  <Link to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName}`} key={index}>
                    <Button className="text-white">
                      <FaMapMarkedAlt />
                    </Button>
                  </Link>
                </div>
                <h2 className="text-xs text-gray-500 my-1">📍 {hotel.hotelAddress || "Address not available"}</h2>
                <div className="mt-2 text-sm">
                  <h2>💰 {hotel.pricePerNight || hotel.price || "Price not available"} per night</h2>
                  <h2>⭐ {hotel.rating || "Rating not available"}</h2>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No hotels available</div>
        )}
      </div>
    </div>
  );
}

export default Hotels;