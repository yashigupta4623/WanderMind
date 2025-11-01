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

  // Generate fallback hotels if less than 3 are available
  const generateFallbackHotels = (existingHotels, destination, budget) => {
    const fallbackHotels = [];
    const budgetRanges = {
      budget: { min: 1500, max: 3000 },
      moderate: { min: 3000, max: 6000 },
      luxury: { min: 6000, max: 15000 }
    };
    
    const range = budgetRanges[budget] || budgetRanges.moderate;
    const hotelTypes = ['Hotel', 'Resort', 'Inn', 'Lodge', 'Boutique Hotel'];
    
    for (let i = existingHotels.length; i < 3; i++) {
      const price = Math.floor(Math.random() * (range.max - range.min) + range.min);
      const rating = (3.5 + Math.random() * 1.5).toFixed(1);
      
      fallbackHotels.push({
        hotelName: `${hotelTypes[i % hotelTypes.length]} ${destination || 'Central'}`,
        hotelAddress: `${destination || 'City'} Center, Near Main Attractions`,
        price: `₹${price.toLocaleString()}`,
        rating: rating,
        hotelImageUrl: null
      });
    }
    
    return [...existingHotels, ...fallbackHotels];
  };

  // Get hotels and ensure minimum 3
  let hotels = tripData?.hotels || tripData?.accommodationOptions || [];
  const destination = trip?.userSelection?.location?.label || 'Destination';
  const budget = trip?.userSelection?.budget || 'moderate';
  
  // Adapt hotel structure and ensure minimum 3 hotels
  const adaptedHotels = hotels.map(hotel => ({
    hotelName: hotel.hotelName || hotel.name,
    hotelAddress: hotel.hotelAddress || hotel.address,
    price: hotel.price || hotel.pricePerNight || hotel.totalCost,
    rating: hotel.rating,
    hotelImageUrl: hotel.hotelImageUrl || hotel.imageUrl
  }));

  const finalHotels = generateFallbackHotels(adaptedHotels, destination, budget);

  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 mb-6 text-center">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {finalHotels.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;