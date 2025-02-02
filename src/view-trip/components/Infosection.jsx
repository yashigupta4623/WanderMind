import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "../../service/GlobalApi";

const PHOTO_REF_URL =
  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference={PHOTO_REF}&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function Infosection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/bg.jpg");

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    if (!trip?.userSelection?.location?.label) {
      console.error("Location label is missing in trip data.");
      return;
    }

    const data = {
      textQuery: trip.userSelection.location.label,
    };

    try {
      const response = await GetPlaceDetails(data);
      console.log("API Response:", response.data); // Debug: Log the full API response
      if (response?.data?.results?.[0]?.photos?.[0]?.photo_reference) {
        const photoReference =
          response.data.results[0].photos[0].photo_reference;
        const newPhotoUrl = PHOTO_REF_URL.replace(
          "{PHOTO_REF}",
          photoReference
        );
        setPhotoUrl(newPhotoUrl);
        console.log(newPhotoUrl);
      } else {
        console.warn("Photo details are not available in the response.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleImageError = () => {
    setPhotoUrl("/bg.jpg");
  };

  return (
    <div>
      <img
        src={photoUrl}
        alt="Background"
        className="h-[400px] w-full object-cover rounded-xl"
        onError={handleImageError}
      />
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-2xl">
        📍 {trip?.userSelection?.location?.label}
        </h2>
        <div className="flex gap-5">
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">📆 {trip.userSelection?.noofDays} Days</h2>
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">💸 {trip.userSelection?.budget} Budget</h2>
          <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">🏕️ No. of Traveler : {trip.userSelection?.traveler} </h2>
        </div>
      </div>
    </div>
  );
}

export default Infosection;
