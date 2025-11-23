import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hotel, Plane, Car, MapPin, Star, ExternalLink } from 'lucide-react';

function QuickSuggestions({ trip }) {
  const destination = trip?.userSelection?.location?.label || trip?.tripDetails?.destination || 'your destination';
  const budget = trip?.userSelection?.budget || 'moderate';
  
  // Generate suggestions based on destination and budget
  const suggestions = {
    hotels: [
      {
        name: budget === 'luxury' ? 'Premium Hotel' : budget === 'budget' ? 'Budget Inn' : 'Comfort Hotel',
        rating: budget === 'luxury' ? 4.8 : budget === 'budget' ? 4.0 : 4.5,
        price: budget === 'luxury' ? '₹8,000/night' : budget === 'budget' ? '₹1,500/night' : '₹3,500/night',
        features: budget === 'luxury' ? 'Pool, Spa, Fine Dining' : budget === 'budget' ? 'WiFi, Breakfast' : 'WiFi, Restaurant, Gym'
      },
      {
        name: budget === 'luxury' ? 'Luxury Resort' : budget === 'budget' ? 'Hostel Stay' : 'Business Hotel',
        rating: budget === 'luxury' ? 4.9 : budget === 'budget' ? 3.8 : 4.3,
        price: budget === 'luxury' ? '₹12,000/night' : budget === 'budget' ? '₹800/night' : '₹2,800/night',
        features: budget === 'luxury' ? 'Beach View, Butler Service' : budget === 'budget' ? 'Shared Kitchen, WiFi' : 'Meeting Rooms, WiFi'
      },
      {
        name: budget === 'luxury' ? 'Boutique Hotel' : budget === 'budget' ? 'Guest House' : 'City Hotel',
        rating: budget === 'luxury' ? 4.7 : budget === 'budget' ? 4.1 : 4.4,
        price: budget === 'luxury' ? '₹10,000/night' : budget === 'budget' ? '₹1,200/night' : '₹3,000/night',
        features: budget === 'luxury' ? 'Rooftop Bar, Concierge' : budget === 'budget' ? 'Clean Rooms, AC' : 'Central Location, Parking'
      }
    ],
    transport: [
      {
        name: 'Flight',
        provider: 'IndiGo / Air India',
        price: budget === 'luxury' ? '₹8,500' : budget === 'budget' ? '₹3,500' : '₹5,500',
        duration: '2-3 hours',
        icon: '✈️'
      },
      {
        name: 'Train',
        provider: 'Indian Railways',
        price: budget === 'luxury' ? '₹2,500 (AC 1st)' : budget === 'budget' ? '₹500 (Sleeper)' : '₹1,200 (AC 3-tier)',
        duration: '8-12 hours',
        icon: '🚂'
      },
      {
        name: 'Bus',
        provider: 'State Transport / Private',
        price: budget === 'luxury' ? '₹1,800 (Volvo AC)' : budget === 'budget' ? '₹400 (Regular)' : '₹900 (Semi-Sleeper)',
        duration: '10-14 hours',
        icon: '🚌'
      }
    ],
    activities: [
      {
        name: 'City Tour',
        description: 'Guided tour of major attractions',
        price: budget === 'luxury' ? '₹3,500' : budget === 'budget' ? '₹800' : '₹1,500',
        duration: 'Full Day',
        icon: '🏛️'
      },
      {
        name: 'Food Walk',
        description: 'Local cuisine tasting experience',
        price: budget === 'luxury' ? '₹2,500' : budget === 'budget' ? '₹500' : '₹1,200',
        duration: '3-4 hours',
        icon: '🍽️'
      },
      {
        name: 'Adventure Activity',
        description: 'Trekking, water sports, or local experiences',
        price: budget === 'luxury' ? '₹4,000' : budget === 'budget' ? '₹1,000' : '₹2,000',
        duration: 'Half Day',
        icon: '🎯'
      }
    ]
  };

  return (
    <div className="my-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Booking Options</h2>
      </div>

      {/* Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-blue-600" />
            Recommended Hotels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.hotels.map((hotel, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{hotel.features}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{hotel.price}</span>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-purple-600" />
            Transport Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.transport.map((transport, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{transport.icon}</span>
                  <h3 className="font-semibold text-lg">{transport.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{transport.provider}</p>
                <p className="text-xs text-gray-500 mb-2">⏱️ {transport.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{transport.price}</span>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Popular Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.activities.map((activity, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activity.icon}</span>
                  <h3 className="font-semibold text-lg">{activity.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
                <p className="text-xs text-gray-500 mb-2">⏱️ {activity.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{activity.price}</span>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flight Deals */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Flight Deals to {destination}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">IndiGo</span>
                <Badge variant="secondary">Best Price</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Non-stop • 2h 30m</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-600 text-xl">₹3,499</span>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Air India</span>
                <Badge variant="secondary">Fastest</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Non-stop • 2h 15m</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-600 text-xl">₹4,299</span>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">SpiceJet</span>
                <Badge variant="secondary">Economy</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 Stop • 4h 45m</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-600 text-xl">₹2,899</span>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuickSuggestions;
