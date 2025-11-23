import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, Accessibility, Baby, Share2 } from 'lucide-react';
import { toast } from 'sonner';

function Infosection({ trip }) {

  const [photoUrl, setPhotoUrl] = useState();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Get city tagline/nickname
  const getCityTagline = (cityName) => {
    if (!cityName) return null;
    
    const taglines = {
      'Bangalore': 'Silicon Valley of India',
      'Bengaluru': 'Silicon Valley of India',
      'Mumbai': 'City of Dreams',
      'Bombay': 'City of Dreams',
      'Delhi': 'Heart of India',
      'New Delhi': 'Heart of India',
      'Kolkata': 'City of Joy',
      'Calcutta': 'City of Joy',
      'Chennai': 'Gateway to South India',
      'Madras': 'Gateway to South India',
      'Hyderabad': 'City of Pearls',
      'Pune': 'Oxford of the East',
      'Ahmedabad': 'Manchester of India',
      'Jaipur': 'Pink City',
      'Lucknow': 'City of Nawabs',
      'Varanasi': 'Spiritual Capital of India',
      'Goa': 'Pearl of the Orient',
      'Kochi': 'Queen of Arabian Sea',
      'Cochin': 'Queen of Arabian Sea',
      'Mysore': 'City of Palaces',
      'Mysuru': 'City of Palaces',
      'Udaipur': 'City of Lakes',
      'Jodhpur': 'Blue City',
      'Amritsar': 'Holy City',
      'Agra': 'City of Taj',
      'Shimla': 'Queen of Hills',
      'Darjeeling': 'Queen of the Himalayas',
      'Manali': 'Valley of Gods',
      'Rishikesh': 'Yoga Capital of the World',
      'Haridwar': 'Gateway to Gods'
    };
    
    // Try to match city name
    const normalizedCity = cityName.toLowerCase().trim();
    for (const [city, tagline] of Object.entries(taglines)) {
      if (normalizedCity.includes(city.toLowerCase()) || city.toLowerCase().includes(normalizedCity)) {
        return tagline;
      }
    }
    
    return null;
  };

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  // Function to format budget display with amount
  const formatBudgetDisplay = (trip) => {
    const budgetAmount = trip?.userSelection?.budgetAmount;
    console.log('Infosection budget data:', { budgetAmount, budget: trip?.userSelection?.budget, userSelection: trip?.userSelection });
    
    // Return default if no trip data
    if (!trip?.userSelection) {
      return '₹25,000';
    }
    
    // Try to show actual budget amount first
    if (budgetAmount && budgetAmount > 0) {
      return `₹${parseInt(budgetAmount).toLocaleString()}`;
    }
    
    // Try to extract amount from trip data or generate realistic amount based on budget type
    const budget = trip?.userSelection?.budget || 'moderate';
    const days = parseInt(trip?.userSelection?.noofDays) || 3;
    const travelers = trip?.userSelection?.traveler || '2 People';
    
    // Extract number of people
    const peopleCount = travelers.includes('2') ? 2 : 
                      travelers.includes('3') ? 3 : 
                      travelers.includes('4') ? 4 : 
                      travelers.includes('Group') ? 4 : 2;
    
    // Generate realistic budget amounts based on type
    let estimatedAmount = 0;
    switch(budget) {
      case 'budget':
        estimatedAmount = days * peopleCount * 2500; // ₹2,500 per person per day
        break;
      case 'moderate':
        estimatedAmount = days * peopleCount * 4500; // ₹4,500 per person per day
        break;
      case 'luxury':
        estimatedAmount = days * peopleCount * 8000; // ₹8,000 per person per day
        break;
      default:
        estimatedAmount = days * peopleCount * 4000; // Default moderate
    }
    
    return `₹${estimatedAmount.toLocaleString()}`;
  };

  const GetPlacePhoto = async () => {
    try {
      const locationLabel = trip?.userSelection?.location?.label;
      
      // Don't make API call if location is not available
      if (!locationLabel || locationLabel.trim() === '') {
        console.log("No location available for photo fetch");
        return;
      }

      const data = {
        textQuery: locationLabel,
      };

      const resp = await GetPlaceDetails(data);

      if (resp?.data?.places?.[0]?.photos?.length > 0) {
        // Use the first available photo, or fallback to index 3 or 8 if they exist
        const photos = resp.data.places[0].photos;
        const photoIndex = photos.length > 8 ? 8 : photos.length > 3 ? 3 : 0;

        console.log(`Using photo at index ${photoIndex}:`, photos[photoIndex].name);
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photos[photoIndex].name);
        setPhotoUrl(PhotoUrl);
      } else {
        console.log("No photos available for this location");
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
      // photoUrl will remain undefined, so fallback image will be used
    }
  }

  const getSafetyBadges = () => {
    const safetyFilters = trip?.userSelection?.safetyFilters;
    console.log('Safety Filters:', safetyFilters); // Debug log
    
    if (!safetyFilters) return [];

    const badges = [];
    
    if (safetyFilters.safeForWomen || safetyFilters.safeForSolo) {
      badges.push({
        icon: <ShieldCheck className="w-3 h-3" />,
        label: 'Women/Solo Safe',
        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
      });
    }
    
    if (safetyFilters.wheelchairFriendly) {
      badges.push({
        icon: <Accessibility className="w-3 h-3" />,
        label: 'Wheelchair Friendly',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      });
    }
    
    if (safetyFilters.familyWithKids) {
      badges.push({
        icon: <Baby className="w-3 h-3" />,
        label: 'Family Friendly',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      });
    }

    if (safetyFilters.preferDaytime) {
      badges.push({
        icon: <Shield className="w-3 h-3" />,
        label: 'Daytime Activities',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      });
    }

    console.log('Safety Badges:', badges); // Debug log
    return badges;
  };

  return (
    <div>
      <div className="relative">
        <img
          src={imageError ? "/header.png" : (photoUrl ? photoUrl : "/header.png")}
          alt="Background"
          className="h-[400px] w-full object-cover rounded-xl"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              // Try the placeholder image as final fallback
              e.target.src = "/header.png";
            }
            setImageLoading(false);
          }}
        />
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-[400px] flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">Loading image...</div>
          </div>
        )}
      </div>
      <div className="my-5 flex flex-col gap-3">
        <h2 className="font-bold text-2xl">
          📍 {trip?.userSelection?.location?.label || 'Your Destination'}
          {getCityTagline(trip?.userSelection?.location?.label) && (
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400 ml-2">
              : {getCityTagline(trip?.userSelection?.location?.label)}
            </span>
          )}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="p-1 px-3 bg-secondary text-secondary-foreground border border-border">📆 {trip?.userSelection?.noofDays || '3'} Days</Badge>
          <Badge className="p-1 px-3 bg-secondary text-secondary-foreground border border-border">💸 {formatBudgetDisplay(trip)}</Badge>
          <Badge className="p-1 px-3 bg-secondary text-secondary-foreground border border-border">🏕️ {trip?.userSelection?.traveler || '2 People'} People</Badge>
        </div>
        
        {/* Safety Badges */}
        {(() => {
          const badges = getSafetyBadges();
          return badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="w-full text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                🛡️ Safety Features
              </div>
              {badges.map((badge, idx) => (
                <Badge key={idx} className={`${badge.color} flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium`}>
                  {badge.icon}
                  {badge.label}
                </Badge>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default Infosection;
