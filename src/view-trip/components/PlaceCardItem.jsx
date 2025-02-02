import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function PlaceCardItem({ place }) {
  const handleImageError = (e) => {
    e.target.src = "/placeholder.jpg"; // Fallback image
  };

  return (
    <div className="border rounded-xl p-3 mt-2 flex gap-5 items-start">
      {/* Left - Image */}
      <img
        src={place.placeImageUrl || "/placeholder.jpg"}
        className="w-[130px] h-[130px] rounded-xl flex-shrink-0"
        alt={place.placeName}
        onError={handleImageError} // Handle image loading errors
      />

      {/* Middle - Text Content (Expands Fully) */}
      <div className="flex-1">
        <h2 className="font-bold text-lg">{place.placeName}</h2>
        <p className="text-sm text-gray-500 w-full">{place.placeDetails}</p>
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
  );
}

export default PlaceCardItem;
