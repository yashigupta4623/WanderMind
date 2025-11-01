import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  // Function to format budget display with amount
  const formatBudgetDisplay = (trip) => {
    const budgetAmount = trip?.userSelection?.budgetAmount;
    console.log('Budget data:', { budgetAmount, budget: trip?.userSelection?.budget, userSelection: trip?.userSelection });

    // Try to show actual budget amount first
    if (budgetAmount && budgetAmount > 0) {
      return `₹${parseInt(budgetAmount).toLocaleString()}`;
    }
    
    // Try to extract amount from trip data or generate realistic amount based on budget type
    const budget = trip?.userSelection?.budget;
    const days = parseInt(trip?.userSelection?.noofDays) || 3;
    const travelers = trip?.userSelection?.traveler || '1 Person';
    
    // Extract number of people
    const peopleCount = travelers.includes('2') ? 2 : 
                      travelers.includes('3') ? 3 : 
                      travelers.includes('4') ? 4 : 
                      travelers.includes('Group') ? 4 : 1;
    
    // Generate realistic budget amounts based on type
    let estimatedAmount = 0;
    switch(budget) {
      case 'budget':
        estimatedAmount = days * peopleCount * 2500; // ₹2,500 per person per day
        break;
      case 'moderate':
        estimatedAmount = days * peopleCount * 4500; // ₹4,500 per person per day
        break;
      case 'luxury':
        estimatedAmount = days * peopleCount * 8000; // ₹8,000 per person per day
        break;
      default:
        estimatedAmount = days * peopleCount * 4000; // Default moderate
    }
    
    return `₹${estimatedAmount.toLocaleString()}`;
  };

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    try {
      const resp = await GetPlaceDetails(data);
      if (resp?.data?.places?.[0]?.photos?.length > 0) {
        const photos = resp.data.places[0].photos;
        const photoIndex = photos.length > 8 ? 8 : photos.length > 3 ? 3 : 0;
        console.log(`Using photo at index ${photoIndex}:`, photos[photoIndex].name);
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photos[photoIndex].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white dark:bg-gray-800 my-8">
        <img
          src={photoUrl ? photoUrl : "/header.png"}
          alt="Trip destination"
          className="object-cover rounded-xl h-[220px] w-full"
          onError={(e) => {
            e.target.src = "/header.png";
          }}
        />
        <div>
          <h2 className="font-bold text-xl mt-3 mx-4">
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className="text-sm text-gray-600 mx-4 py-4">
            {trip?.userSelection?.noofDays} Days trip with {formatBudgetDisplay(trip)}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
