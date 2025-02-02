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

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 mb-6 text-center">Hotel Recommendations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {tripData?.hotels?.length > 0 ? (
          tripData.hotels.map((hotel, index) => (
            <div key={index} className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white">
              <img
                src={hotel.hotelImageUrl || "/placeholder.jpg"}
                className="h-40 w-full object-cover rounded-t-xl"
                alt={hotel.hotelName}
                onError={handleImageError} // Handle image loading errors
              />
              <div className="p-4">
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
          <div className="text-center text-gray-500">No hotels available</div>
        )}
      </div>
    </div>
  );
}

export default Hotels;