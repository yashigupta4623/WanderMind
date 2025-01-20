import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '../../service/GlobalApi';

const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function Infosection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/bg.jpg');

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip.userSelection.location.label,
    };

    try {
      const resp = await GetPlaceDetails(data);
      const photoName = resp.data.places[0].photos[3].name;
      const newPhotoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      setPhotoUrl(newPhotoUrl);
      console.log(newPhotoUrl);
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  return (
    <div>
      <img
        src={photoUrl}
        alt="Background"
        className="h-[340px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center">
        return (
    <div className="flex justify-between items-center mt-12 md:mx-16 lg:mx-48 p-6 rounded-lg shadow-lg">
      <img
        className="h-40 w-40 rounded-full object-cover"
        src={photoUrl}
        alt="Trip Image"
      />
      <div className="flex flex-col ml-6 items-end">
        <div className="text-4xl font-bold mb-2 flex items-center">
          🗺️ {trip?.userChoice?.location?.label}
        </div>
        <div className="text-xl mb-1 flex items-center">
          📅 <span className="font-semibold ml-2">Duration:</span>
          {trip?.userChoice?.noOfDays} days
        </div>
        <div className="text-xl mb-1 flex items-center">
          💰 <span className="font-semibold ml-2">Budget:</span>
          {trip?.userChoice?.budget}
        </div>
        <div className="text-xl flex items-center">
          👥 <span className="font-semibold ml-2">Traveling with:</span>
          {trip?.userChoice?.noOfPeople}
        </div>
      </div>
    </div>
  );
      </div>
    </div>
  );
}

export default Infosection;
