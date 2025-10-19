import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, Camera, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const InteractiveTravelMap = () => {
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();

  const destinations = [
    {
      id: 'goa',
      name: 'Goa',
      position: { top: '65%', left: '15%' },
      type: 'Beach Paradise',
      rating: 4.8,
      price: '₹15K',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200',
      highlights: ['Beaches', 'Nightlife', 'Portuguese Culture']
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      position: { top: '45%', left: '25%' },
      type: 'Royal Heritage',
      rating: 4.9,
      price: '₹25K',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200',
      highlights: ['Palaces', 'Desert Safari', 'Culture']
    },
    {
      id: 'kerala',
      name: 'Kerala',
      position: { top: '75%', left: '20%' },
      type: 'Backwaters',
      rating: 4.7,
      price: '₹20K',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200',
      highlights: ['Houseboats', 'Tea Gardens', 'Ayurveda']
    },
    {
      id: 'himachal',
      name: 'Himachal',
      position: { top: '25%', left: '30%' },
      type: 'Mountain Adventure',
      rating: 4.6,
      price: '₹18K',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      highlights: ['Trekking', 'Paragliding', 'Snow']
    },
    {
      id: 'delhi',
      name: 'Delhi',
      position: { top: '35%', left: '32%' },
      type: 'Capital Heritage',
      rating: 4.5,
      price: '₹12K',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200',
      highlights: ['Red Fort', 'India Gate', 'Street Food']
    },
    {
      id: 'northeast',
      name: 'Northeast',
      position: { top: '30%', left: '70%' },
      type: 'Hidden Gems',
      rating: 4.8,
      price: '₹30K',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200',
      highlights: ['Living Bridges', 'Wildlife', 'Culture']
    }
  ];

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    toast.success(`Selected ${destination.name}! Let's plan your ${destination.type.toLowerCase()} adventure.`);
    
    // Navigate to create trip with pre-selected destination
    setTimeout(() => {
      navigate(`/create-trip?destination=${destination.name}&tab=basic`);
    }, 1000);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 dark:from-blue-900 dark:via-green-900 dark:to-orange-900 rounded-2xl overflow-hidden shadow-lg">
      {/* Background Map Illustration */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* India outline (simplified) */}
          <path
            d="M100 50 L120 40 L140 45 L160 40 L180 50 L200 45 L220 55 L240 60 L250 80 L260 100 L270 120 L275 140 L280 160 L275 180 L270 200 L260 220 L240 240 L220 250 L200 255 L180 250 L160 245 L140 240 L120 230 L100 220 L80 200 L70 180 L65 160 L70 140 L75 120 L80 100 L85 80 L90 60 Z"
            fill="currentColor"
            className="text-blue-300 dark:text-blue-700"
          />
        </svg>
      </div>

      {/* Animated Planes */}
      <div className="absolute top-10 left-10 animate-pulse">
        <Plane className="w-6 h-6 text-blue-500 transform rotate-45" />
      </div>
      <div className="absolute top-20 right-20 animate-bounce">
        <Plane className="w-5 h-5 text-green-500 transform -rotate-12" />
      </div>

      {/* Destination Markers */}
      {destinations.map((destination) => (
        <div
          key={destination.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={destination.position}
          onMouseEnter={() => setHoveredDestination(destination)}
          onMouseLeave={() => setHoveredDestination(null)}
          onClick={() => handleDestinationClick(destination)}
        >
          {/* Marker Pin */}
          <div className="relative">
            <MapPin 
              className={`w-8 h-8 transition-all duration-300 ${
                hoveredDestination?.id === destination.id || selectedDestination?.id === destination.id
                  ? 'text-red-500 scale-125' 
                  : 'text-blue-500 hover:text-red-500'
              }`} 
            />
            
            {/* Pulsing Ring */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Hover Card */}
          {hoveredDestination?.id === destination.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-10 animate-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{destination.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{destination.type}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium">{destination.rating}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      From {destination.price}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {destination.highlights.slice(0, 2).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button size="sm" className="w-full mt-3 text-xs">
                Plan Trip to {destination.name}
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Interactive Elements - Positioned higher to avoid overlap */}
      <div className="absolute bottom-16 left-4 right-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click on any destination to start planning
              </span>
            </div>
            <Badge className="bg-green-500 text-white">
              {destinations.length} Destinations
            </Badge>
          </div>
        </div>
      </div>

      {/* Selected Destination Overlay */}
      {selectedDestination && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 text-center animate-in zoom-in-95">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Great Choice!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've selected {selectedDestination.name}. Redirecting to trip planner...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTravelMap;