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

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[3].name);
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[8].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white my-8">
        <img
          src={photoUrl ? photoUrl : "/placeholder.jpg"}
          alt=""
          className="object-cover rounded-xl h-[220px] w-full"
        />
        <div>
          <h2 className="font-bold text-xl mt-3 mx-4">
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className="text-sm text-gray-600 mx-4 py-4">
            {trip?.userSelection?.noofDays} Days trip with {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
