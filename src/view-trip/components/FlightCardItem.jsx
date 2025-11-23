import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Plane, Star, Luggage } from 'lucide-react';

function FlightCardItem({ flight }) {
  const getAirlineLogo = (airline) => {
    const logos = {
      'IndiGo': '🔵',
      'SpiceJet': '🔴',
      'GoFirst': '🟡',
      'Air India': '🇮🇳',
      'Vistara': '💜',
      'Emirates': '🏆'
    };
    return logos[airline] || '✈️';
  };

  const getClassColor = (flightClass) => {
    if (flightClass.includes('Business') || flightClass.includes('First')) {
      return 'bg-purple-100 text-purple-700';
    } else if (flightClass.includes('Premium')) {
      return 'bg-blue-100 text-blue-700';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Morning': 'bg-orange-100 text-orange-700',
      'Afternoon': 'bg-yellow-100 text-yellow-700',
      'Evening': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="h-full flex flex-col hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="text-xl">{getAirlineLogo(flight.airline)}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {flight.airline}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {flight.flightNumber}
              </p>
            </div>
          </div>
          <Link to={flight.bookingUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${getClassColor(flight.class)}`}>
            {flight.class}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(flight.type)}`}>
            {flight.type}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            {flight.stops}
          </span>
        </div>

        <div className="space-y-2 mb-3 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg">{flight.price}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{flight.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{flight.departure}</span>
              <span className="text-gray-500 dark:text-gray-400">→</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{flight.arrival}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300">{flight.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Luggage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{flight.baggage}</span>
          </div>
        </div>

        {flight.features && flight.features.length > 0 && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1">
              {flight.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {flight.features.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">+{flight.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightCardItem;