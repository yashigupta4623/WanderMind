import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
  // Parse the tripData JSON string
  const tripData = trip?.tripData ? JSON.parse(trip.tripData) : {};

  console.log("Parsed tripData:", tripData); // Debug: Log the parsed tripData
  console.log("Hotels array:", tripData?.hotels); // Debug: Log the hotels array

  // const handleImageError = (e) => {
  //   e.target.src = "/placeholder.jpg"; // Fallback image
  // };

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 mb-6 text-center">Hotel Recommendations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {tripData?.hotels?.length > 0 ? (
          tripData.hotels.map((hotel, index) => (
            <HotelCardItem hotel={hotel} />
          ))
        ) : (
          <div className="text-center text-gray-500">No hotels available</div>
        )}
      </div>
    </div>
  );
}

export default Hotels;