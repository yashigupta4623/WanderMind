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
        try {
          const data = {
            textQuery: hotel?.hotelName,
          };
          const result = await GetPlaceDetails(data);
          if (result?.data?.places?.[0]?.photos?.[1]?.name) {
            const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", result.data.places[0].photos[1].name);
            setPhotoUrl(PhotoUrl);
          }
        } catch (error) {
          // Photo fetch failed, using fallback image
          // Use hotel image from data if available
          if (hotel?.hotelImageUrl) {
            setPhotoUrl(hotel.hotelImageUrl);
          }
        }
      }

  return (
      <div className="hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img
                src={photoUrl ? photoUrl : "/header.png"}
                className="h-40 w-full object-cover rounded-t-xl"
                alt={hotel.hotelName || "Hotel"}
                onError={(e) => {
                  e.target.src = "/header.png";
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg my-2 font-bold text-gray-800 dark:text-gray-100 truncate">
                    {hotel.hotelName || "Premium Hotel"}
                  </h2>
                  <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName || 'hotel')}`}>
                    <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700">
                      <FaMapMarkedAlt />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-start gap-1 my-1">
                  <span className="text-gray-500 mt-0.5">📍</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {hotel.hotelAddress || "Central location with easy access to attractions"}
                  </span>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span className="font-semibold text-green-600">
                      {hotel.pricePerNight || hotel.price || "Price on request"}
                      {(hotel.pricePerNight || hotel.price) && !hotel.price?.includes('per') ? ' per night' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{hotel.rating || "4.0"} rating</span>
                  </div>
                </div>
              </div>
            </div>

  )
}

export default HotelCardItem;