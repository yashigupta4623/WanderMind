import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import WhyThisPlanButton from '@/components/custom/WhyThisPlanButton';

function HotelCardItem({ hotel, tripContext }) {

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
    <div className="h-full flex flex-col hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <img
        src={photoUrl ? photoUrl : "/header.png"}
        className="h-40 w-full object-cover rounded-t-xl"
        alt={hotel.hotelName || "Hotel"}
        onError={(e) => {
          e.target.src = "/header.png";
        }}
      />
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate pr-2">
            {hotel.hotelName || "Premium Hotel"}
          </h2>
          <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName || 'hotel')}`}>
            <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700 flex-shrink-0">
              <FaMapMarkedAlt />
            </Button>
          </Link>
        </div>

        <div className="flex items-start gap-1 mb-3">
          <span className="text-gray-500 dark:text-gray-400 mt-0.5">📍</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {hotel.hotelAddress || "Central location with easy access to attractions"}
          </span>
        </div>

        <div className="space-y-2 text-sm flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {hotel.pricePerNight || hotel.price || "Price on request"}
                {(hotel.pricePerNight || hotel.price) && !hotel.price?.includes('per') ? ' per night' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{hotel.rating || "4.0"}</span>
            </div>
          </div>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">+{hotel.amenities.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <WhyThisPlanButton 
            item={{
              name: hotel.hotelName,
              price: hotel.pricePerNight || hotel.price,
              rating: hotel.rating,
              address: hotel.hotelAddress,
              amenities: hotel.amenities
            }}
            type="hotel"
            context={tripContext}
          />
        </div>
      </div>
    </div>

  )
}

export default HotelCardItem;