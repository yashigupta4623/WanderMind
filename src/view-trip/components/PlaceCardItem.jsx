import React from 'react';
import { MdOutlineMyLocation } from "react-icons/md";
import { Button } from "@/components/ui/button";

function PlaceCardItem({ place }) {
  const { latitude, longitude } = place.coordinates || {};

  const handleNavigate = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      alert("Location coordinates not available");
    }
  };

  return (
    <div className='border rounded-xl p-3 mt-2 flex flex-col gap-2 hover:scale-105 cursor-pointer transition-all h-full'>
      <img src={place.imageUrl || "/bg.jpg"} className='w-full h-40 object-cover rounded-xl' alt={place.placeName} />
      <div className='flex flex-col justify-between flex-grow'>
        <div>
          <h2 className='font-bold text-md'>{place.placeName}</h2>
          <p className='text-sm text-blue-900 mt-2'>{place.details}</p>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-red-600 mt-2'>🏷️ {place.pricing}</p>
            <p className='text-sm text-yellow-900'>🕣 {place.timings}</p>
            <Button className='ml-2' onClick={handleNavigate}>
              <MdOutlineMyLocation />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;