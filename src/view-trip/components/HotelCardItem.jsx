import React from 'react'
import {Link} from 'react-router-dom'
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function HotelCardItem({hotel}) {

      const [photoUrl, setPhotoUrl] = useState();
      useEffect(() => {
        if (hotel) {
          GetPlacePhoto();
        }
      }, [hotel]);
    
      const GetPlacePhoto = async () => {
        const data = {
          textQuery: hotel?.hotelName,
        };
        const result = await GetPlaceDetails(data).then(resp=>{
          console.log(resp.data.places[0].photos[3].name)
          const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", resp.data.places[0].photos[1].name);
          setPhotoUrl(PhotoUrl);
        });
    
      }

  return (
      <div className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white">
              <img
                src={photoUrl?photoUrl: "/placeholder.jpg"}
                className="h-40 w-full object-cover rounded-t-xl"
                alt={hotel.hotelName}
                
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg my-2 font-bold">{hotel.hotelName}</h2>
                  <Link to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName}`}>
                    <Button className="text-white">
                      <FaMapMarkedAlt />
                    </Button>
                  </Link>
                </div>
                <h2 className="text-xs text-gray-500 my-1">📍 {hotel.hotelAddress || "Address not available"}</h2>
                <div className="mt-2 text-sm">
                  <h2>💰 {hotel.pricePerNight || hotel.price || "Price not available"} per night</h2>
                  <h2>⭐ {hotel.rating || "Rating not available"}</h2>
                </div>
              </div>
            </div>

  )
}

export default HotelCardItem;