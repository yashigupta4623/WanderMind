import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function Infosection({ trip }) {

  const [photoUrl, setPhotoUrl] = useState();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  // Function to format budget display with amount
  const formatBudgetDisplay = (trip) => {
    const budgetAmount = trip?.userSelection?.budgetAmount;
    console.log('Infosection budget data:', { budgetAmount, budget: trip?.userSelection?.budget, userSelection: trip?.userSelection });
    
    if (budgetAmount) {
      return `₹${parseInt(budgetAmount).toLocaleString()} Budget`;
    }
    
    // Fallback to budget type if amount not available
    const budgetMap = {
      'budget': 'Budget Travel',
      'moderate': 'Comfortable',
      'luxury': 'Luxury',
      'custom': 'Custom Budget'
    };
    return budgetMap[trip?.userSelection?.budget] || 'Budget Travel';
  };

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label,
      };

      const resp = await GetPlaceDetails(data);

      if (resp?.data?.places?.[0]?.photos?.length > 0) {
        // Use the first available photo, or fallback to index 3 or 8 if they exist
        const photos = resp.data.places[0].photos;
        const photoIndex = photos.length > 8 ? 8 : photos.length > 3 ? 3 : 0;

        console.log(`Using photo at index ${photoIndex}:`, photos[photoIndex].name);
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photos[photoIndex].name);
        setPhotoUrl(PhotoUrl);
      } else {
        console.log("No photos available for this location");
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      // photoUrl will remain undefined, so fallback image will be used
    }
  }

  return (
    <div>
      <div className="relative">
        <img
          src={imageError ? "/header.png" : (photoUrl ? photoUrl : "/header.png")}
          alt="Background"
          className="h-[400px] w-full object-cover rounded-xl"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              // Try the placeholder image as final fallback
              e.target.src = "/header.png";
            }
            setImageLoading(false);
          }}
        />
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-[400px] flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">Loading image...</div>
          </div>
        )}
      </div>
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-2xl">
          📍 {trip?.userSelection?.location?.label}
        </h2>
        <div className="flex gap-5">
          <h2 className="p-1 px-3 rounded-full bg-secondary text-secondary-foreground border border-border">📆 {trip.userSelection?.noofDays} Days</h2>
          <h2 className="p-1 px-3 rounded-full bg-secondary text-secondary-foreground border border-border">💸 {formatBudgetDisplay(trip)}</h2>
          <h2 className="p-1 px-3 rounded-full bg-secondary text-secondary-foreground border border-border">🏕️ No. of Traveler : {trip.userSelection?.traveler} </h2>
        </div>
      </div>
    </div>
  );
}

export default Infosection;
