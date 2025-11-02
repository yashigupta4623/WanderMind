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
    <div>



      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 mt-2 flex gap-4 items-start bg-white dark:bg-gray-800">
        {/* Left - Image */}
        <img
          src={photoUrl ? photoUrl : "/header.png"}
          className="w-[120px] h-[120px] rounded-xl object-cover flex-shrink-0"
          alt={place.placeName}
          onError={(e) => {
            e.target.src = "/header.png";
          }}
        />

        {/* Middle - Text Content (Expands Fully) */}
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">{place.placeName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 w-full mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{place.placeDetails}</p>
          
          <div className="space-y-1 text-sm">
            {place.bestTimetoVisit && (
              <div className="flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400 font-medium">🕒</span>
                <span className="text-orange-600 dark:text-orange-400 font-medium text-xs">{place.bestTimetoVisit}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {place.travelTime && (
                <div className="flex items-center gap-1">
                  <span>🚗</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{place.travelTime}</span>
                </div>
              )}
              
              {place.ticketPricing && (
                <div className="flex items-center gap-1">
                  <span>🎫</span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">{place.ticketPricing}</span>
                </div>
              )}
              
              {place.rating && (
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{place.rating}</span>
                </div>
              )}
              
              {place.duration && (
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{place.duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Button (Fixed Position) */}
        <div className="self-start flex-shrink-0">
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              place.placeName
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="text-white shadow-lg bg-blue-600 hover:bg-blue-700">
              <FaMapMarkedAlt />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;
