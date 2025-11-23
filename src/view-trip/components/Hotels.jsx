import React from "react";
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

  // Generate budget-appropriate hotel options (3-4 hotels)
  const generateBudgetAppropriateHotels = (existingHotels, destination, budget, userBudgetAmount) => {
    const budgetRanges = {
      budget: { min: 1200, max: 2800, types: ['Budget Hotel', 'Hostel', 'Guest House', 'Lodge'] },
      moderate: { min: 2500, max: 5500, types: ['3-Star Hotel', 'Business Hotel', 'Boutique Hotel', 'Resort'] },
      luxury: { min: 5000, max: 12000, types: ['4-Star Hotel', '5-Star Resort', 'Luxury Hotel', 'Premium Resort'] }
    };
    
    // If user provided specific budget amount, adjust ranges accordingly
    let range = budgetRanges[budget] || budgetRanges.moderate;
    if (userBudgetAmount && userBudgetAmount > 0) {
      const dailyBudget = userBudgetAmount / 7; // Assume 7 days average
      const hotelBudget = dailyBudget * 0.35; // 35% for accommodation
      
      if (hotelBudget < 2000) {
        range = budgetRanges.budget;
      } else if (hotelBudget < 4000) {
        range = budgetRanges.moderate;
      } else {
        range = budgetRanges.luxury;
      }
    }
    
    const targetCount = 3; // Show 3 hotel options
    const allHotels = [...existingHotels];
    
    // Generate additional hotels to reach target count
    for (let i = existingHotels.length; i < targetCount; i++) {
      const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);
      const rating = (3.2 + Math.random() * 1.6).toFixed(1);
      const hotelType = range.types[i % range.types.length];
      
      // Add some price variation for different options
      const priceVariation = i === 0 ? 0.8 : i === 1 ? 1.0 : 1.2;
      const finalPrice = Math.floor(basePrice * priceVariation);
      
      allHotels.push({
        hotelName: `${hotelType} ${destination || 'Central'} ${i + 1}`,
        hotelAddress: `${destination || 'City'} - ${getLocationVariant(i)}`,
        price: `₹${finalPrice.toLocaleString()}`,
        pricePerNight: `₹${finalPrice.toLocaleString()}`,
        rating: rating,
        hotelImageUrl: null,
        amenities: getHotelAmenities(budget, i)
      });
    }
    
    return allHotels.slice(0, targetCount);
  };

  // Helper function to get location variants
  const getLocationVariant = (index) => {
    const locations = ['City Center', 'Near Airport', 'Tourist District', 'Business Area'];
    return locations[index % locations.length];
  };

  // Helper function to get hotel amenities based on budget
  const getHotelAmenities = (budget, index) => {
    const amenitiesByBudget = {
      budget: ['Free WiFi', 'AC', '24/7 Reception', 'Room Service'],
      moderate: ['Free WiFi', 'AC', 'Restaurant', 'Gym', 'Room Service', 'Parking'],
      luxury: ['Free WiFi', 'AC', 'Restaurant', 'Spa', 'Pool', 'Gym', 'Concierge', 'Valet Parking']
    };
    
    const baseAmenities = amenitiesByBudget[budget] || amenitiesByBudget.moderate;
    return baseAmenities.slice(0, 3 + index); // Vary amenities by hotel
  };



  // Get hotels and generate budget-appropriate options
  let hotels = tripData?.hotels || tripData?.accommodationOptions || [];
  const destination = trip?.userSelection?.location?.label || 'Destination';
  const budget = trip?.userSelection?.budget || 'moderate';
  const userBudgetAmount = trip?.userSelection?.budgetAmount || 0;
  
  // Adapt existing hotel structure
  const adaptedHotels = hotels.map(hotel => ({
    hotelName: hotel.hotelName || hotel.name,
    hotelAddress: hotel.hotelAddress || hotel.address,
    price: hotel.price || hotel.pricePerNight || hotel.totalCost,
    pricePerNight: hotel.pricePerNight || hotel.price,
    rating: hotel.rating,
    hotelImageUrl: hotel.hotelImageUrl || hotel.imageUrl,
    amenities: hotel.amenities || []
  }));

  const finalHotels = generateBudgetAppropriateHotels(adaptedHotels, destination, budget, userBudgetAmount);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">🏨 Hotel Recommendations</h2>
        {/* <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
          {finalHotels.length} options • {budget.charAt(0).toUpperCase() + budget.slice(1)} Budget
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalHotels.map((hotel, index) => (
          <div key={index} className="relative">
            <HotelCardItem 
              hotel={hotel} 
              tripContext={{
                budget: trip?.userSelection?.budgetAmount || trip?.userSelection?.budget,
                days: trip?.userSelection?.noofDays,
                travelers: trip?.userSelection?.traveler
              }}
            />
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Best Value
              </div>
            )}
            {index === 1 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Recommended
              </div>
            )}
            {index === 2 && budget === 'luxury' && (
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Premium
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          💡 <strong>Tip:</strong> Prices shown are per night. Book early for better rates and availability.
        </p>
      </div>
    </div>
  );
}

export default Hotels;