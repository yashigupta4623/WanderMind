import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function Infosection({ trip }) {

  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then(resp=>{
      console.log(resp.data.places[0].photos[3].name)
      const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", resp.data.places[0].photos[8].name);
      setPhotoUrl(PhotoUrl);
    });

  }

  return (
    <div>
      <img
        src={photoUrl?photoUrl: "/placeholder.jpg"}
        alt="Background"
        className="h-[400px] w-full object-cover rounded-xl"
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
