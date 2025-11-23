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

  // Generate additional activity options based on budget
  const generateAdditionalActivities = (existingActivities, destination, budget, dayIndex) => {
    const budgetRanges = {
      budget: { min: 0, max: 500, activities: ['Free Walking Tour', 'Local Market Visit', 'Public Garden', 'Street Food Tour'] },
      moderate: { min: 200, max: 1200, activities: ['Guided Tour', 'Museum Visit', 'Cultural Show', 'Adventure Activity'] },
      luxury: { min: 800, max: 3000, activities: ['Private Tour', 'Fine Dining', 'Spa Experience', 'Helicopter Tour'] }
    };
    
    const range = budgetRanges[budget] || budgetRanges.moderate;
    const targetCount = 3; // Show 3 activities per day
    const allActivities = [...existingActivities];
    
    // Generate additional activities to reach target count
    for (let i = existingActivities.length; i < targetCount; i++) {
      const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);
      const rating = (3.5 + Math.random() * 1.3).toFixed(1);
      const activityType = range.activities[i % range.activities.length];
      
      allActivities.push({
        placeName: `${activityType} - ${destination || 'Local Area'} ${i + 1}`,
        placeDetails: getActivityDescription(activityType, destination, budget),
        ticketPricing: basePrice > 0 ? `₹${basePrice.toLocaleString()}` : 'Free',
        rating: rating,
        travelTime: getRandomTravelTime(),
        bestTimetoVisit: getRandomTimeSlot(dayIndex),
        placeImageUrl: null,
        activityType: activityType,
        duration: getActivityDuration(activityType)
      });
    }
    
    return allActivities.slice(0, targetCount);
  };

  // Helper functions for activity generation
  const getActivityDescription = (activityType, destination, budget) => {
    const descriptions = {
      'Free Walking Tour': `Explore the historic streets and hidden gems of ${destination || 'the city'} with a knowledgeable local guide`,
      'Local Market Visit': `Experience authentic local culture and taste traditional foods at ${destination || 'the city'}'s bustling markets`,
      'Public Garden': `Relax and unwind in beautiful gardens while enjoying nature and local atmosphere`,
      'Street Food Tour': `Discover the best local flavors and culinary traditions through guided food experiences`,
      'Guided Tour': `Professional guided exploration of major attractions and cultural sites with historical insights`,
      'Museum Visit': `Immerse yourself in local history, art, and culture at renowned museums and galleries`,
      'Cultural Show': `Experience traditional performances, music, and dance showcasing local heritage`,
      'Adventure Activity': `Thrilling outdoor experiences including hiking, water sports, or adventure tours`,
      'Private Tour': `Exclusive personalized tour with private guide and luxury transportation`,
      'Fine Dining': `Exceptional culinary experience at premium restaurants with local and international cuisine`,
      'Spa Experience': `Rejuvenating wellness treatments and relaxation at luxury spa facilities`,
      'Helicopter Tour': `Breathtaking aerial views and unique perspective of ${destination || 'the region'}'s landmarks`
    };
    return descriptions[activityType] || `Enjoy ${activityType.toLowerCase()} in ${destination || 'the area'}`;
  };

  const getRandomTravelTime = () => {
    const times = ['15-20 mins', '20-30 mins', '30-45 mins', '45-60 mins'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getRandomTimeSlot = (dayIndex) => {
    const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];
    return timeSlots[dayIndex % timeSlots.length];
  };

  const getActivityDuration = (activityType) => {
    const durations = {
      'Free Walking Tour': '2-3 hours',
      'Local Market Visit': '1-2 hours',
      'Public Garden': '1-2 hours',
      'Street Food Tour': '2-3 hours',
      'Guided Tour': '3-4 hours',
      'Museum Visit': '2-3 hours',
      'Cultural Show': '1.5-2 hours',
      'Adventure Activity': '4-6 hours',
      'Private Tour': '4-8 hours',
      'Fine Dining': '2-3 hours',
      'Spa Experience': '2-4 hours',
      'Helicopter Tour': '1-2 hours'
    };
    return durations[activityType] || '2-3 hours';
  };

  // Check if we have any itinerary data
  const hasArrayItinerary = Array.isArray(tripData?.itinerary) && tripData.itinerary.length > 0;
  const hasDynamicItinerary = Array.isArray(tripData?.dynamicItinerary) && tripData.dynamicItinerary.length > 0;
  const hasObjectItinerary = tripData?.itinerary && typeof tripData.itinerary === 'object' && !Array.isArray(tripData.itinerary) && Object.keys(tripData.itinerary).length > 0;
  
  console.log('Itinerary check:', { hasArrayItinerary, hasDynamicItinerary, hasObjectItinerary, itinerary: tripData?.itinerary });
  
  const tripDestination = trip?.userSelection?.location?.label || 'Destination';
  const tripBudget = trip?.userSelection?.budget || 'moderate';

  // Generate itinerary data
  let itineraryToRender = [];

  if (hasArrayItinerary) {
    itineraryToRender = tripData.itinerary;
  } else if (hasDynamicItinerary) {
    itineraryToRender = tripData.dynamicItinerary;
  } else if (hasObjectItinerary) {
    itineraryToRender = Object.keys(tripData.itinerary).map(key => ({ 
      ...tripData.itinerary[key], 
      day: key 
    }));
  } else {
    // No itinerary data found, generate demo activities
    const days = parseInt(trip?.userSelection?.noofDays) || 3;
    for (let i = 0; i < days; i++) {
      itineraryToRender.push({
        day: i + 1,
        plan: []
      });
    }
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4 text-gray-800 dark:text-gray-100">
        🎯 Places to Visit
      </h2>

      <div>
        {itineraryToRender.map((item, index) => {
          // Get existing activities for this day
          const dayActivities = (item.plan || item.timeline || []).map(place => ({
            placeName: place.placeName || place.activity || place.location,
            placeDetails: place.placeDetails || place.description,
            ticketPricing: place.ticketPricing || place.cost,
            rating: place.rating,
            travelTime: place.travelTime || place.duration || place.timeTravel,
            bestTimetoVisit: place.bestTimetoVisit || place.time,
            placeImageUrl: place.placeImageUrl || place.imageUrl
          }));

          // Generate additional activities to ensure 3 options per day
          const finalActivities = generateAdditionalActivities(dayActivities, tripDestination, tripBudget, index);

          return (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className='font-medium text-xl text-blue-600 dark:text-blue-400'>
                  {typeof item.day === 'string' && item.day.toLowerCase().includes('day') 
                    ? `${item.day} Activities` 
                    : `Day ${item.day || index + 1} Activities`}
                </h2>
                {/* <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {finalActivities.length} activities • {tripBudget} budget
                </div> */}
              </div>
              
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
                {finalActivities.map((place, placeIndex) => (
                  <div key={placeIndex} className="relative flex">
                    <PlaceCardItem place={place} />
                    {placeIndex === 0 && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
                        Must Visit
                      </div>
                    )}
                    {place.activityType && (
                      <div className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full z-10">
                        {place.activityType.split(' ')[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  💡 <strong>{typeof item.day === 'string' && item.day.toLowerCase().includes('day') 
                    ? `${item.day} Tip:` 
                    : `Day ${item.day || index + 1} Tip:`}</strong> Start early to make the most of your day. Consider travel time between activities.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlacesToVisit;