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
    try {
      const data = {
        textQuery: place.placeName,
      };
      const result = await GetPlaceDetails(data);
      if (result?.data?.places?.[0]?.photos?.[8]?.name) {
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", result.data.places[0].photos[8].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      // Photo fetch failed, using fallback image
      // Use place image from data if available
      if (place?.placeImageUrl) {
        setPhotoUrl(place.placeImageUrl);
      }
    }
  }

  return (
    <div className="h-full w-full">
      <div className="h-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow flex flex-col">
        
        {/* Upper Half - Image + Name & Description */}
        <div className="p-3 pb-2 flex gap-3 items-start">
          {/* Left - Image */}
          <img
            src={photoUrl ? photoUrl : "/header.png"}
            className="w-[120px] h-[120px] rounded-xl object-cover flex-shrink-0"
            alt={place.placeName}
            onError={(e) => {
              e.target.src = "/header.png";
            }}
          />

          {/* Right - Name, Description & Map Button */}
          <div className="flex-1 flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 line-clamp-2 flex-1 leading-tight">{place.placeName}</h2>
              <Link
                to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  place.placeName
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="text-white shadow-md bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                  <FaMapMarkedAlt />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-snug">{place.placeDetails}</p>
          </div>
        </div>

        {/* Lower Half - Details */}
        <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {place.bestTimetoVisit && (
              <div className="flex items-center gap-1.5">
                <span className="text-base flex-shrink-0">🕒</span>
                <span className="text-orange-600 dark:text-orange-400 font-medium text-xs">{place.bestTimetoVisit}</span>
              </div>
            )}
            
            {place.travelTime && (
              <div className="flex items-center gap-1.5">
                <span className="text-base flex-shrink-0">🚗</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">{place.travelTime}</span>
              </div>
            )}
            
            {place.ticketPricing && (
              <div className="flex items-center gap-1.5">
                <span className="text-base flex-shrink-0">🎫</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">{place.ticketPricing}</span>
              </div>
            )}
            
            {place.rating && (
              <div className="flex items-center gap-1.5">
                <span className="text-base flex-shrink-0">⭐</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">{place.rating}</span>
              </div>
            )}
            
            {place.duration && (
              <div className="flex items-center gap-1.5">
                <span className="text-base flex-shrink-0">⏱️</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">{place.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;
