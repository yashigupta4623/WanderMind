import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
    useEffect(() => {
      if (place) {
        GetPlacePhoto();
      }
    }, [place]);
  
    const GetPlacePhoto = async () => {
      const data = {
        textQuery: place.placeName,
      };
      const result = await GetPlaceDetails(data).then(resp=>{
        console.log(resp.data.places[0].photos[3].name)
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", resp.data.places[0].photos[8].name);
        setPhotoUrl(PhotoUrl);
      });
  
    }

  return (
    <div>
       
   

    <div className="border rounded-xl p-3 mt-2 flex gap-5 items-start">
      {/* Left - Image */}
      <img
        src={photoUrl?photoUrl: "/placeholder.jpg"}
        className="w-[130px] h-[130px] rounded-xl object-cover flex-shrink-0"
        alt={place.placeName}
      />

      {/* Middle - Text Content (Expands Fully) */}
      <div className="flex-1">
        <h2 className="font-bold text-lg">{place.placeName}</h2>
        <p className="text-sm text-gray-500 w-full">{place.placeDetails}</p>
        <h2 className='font-medium text-sm text-orange-600'>{place.bestTimetoVisit}</h2>
        <p className="mt-2 text-sm">🕖 {place.travelTime}</p>
        <p className="text-sm">🏷️ {place.ticketPricing}</p>
        <p className="text-sm">⭐ {place.rating}</p>
      </div>

      {/* Right - Button (Fixed Position) */}
      <div className="self-end flex-shrink-0">
        <Link
          to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            place.placeName
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="text-white shadow-lg p-2">
            <FaMapMarkedAlt />
          </Button>
        </Link>
      </div>
    </div>
    </div>
  );
}

export default PlaceCardItem;
