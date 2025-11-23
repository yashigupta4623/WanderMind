import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Users, Star } from 'lucide-react';

function TransportCardItem({ transport }) {
  const getTransportIcon = (type) => {
    const icons = {
      'Public Bus': '🚌',
      'Shared Taxi': '🚕',
      'Local Train': '🚂',
      'AC Bus': '🚌',
      'Private Taxi': '🚗',
      'Train (AC)': '🚄',
      'Private Car': '🚙',
      'Flight': '✈️',
      'Luxury Bus': '🚐'
    };
    return icons[type] || '🚗';
  };

  const getComfortColor = (comfort) => {
    const colors = {
      'Basic': 'bg-gray-100 text-gray-700',
      'Standard': 'bg-blue-100 text-blue-700',
      'Comfortable': 'bg-green-100 text-green-700',
      'Premium': 'bg-purple-100 text-purple-700',
      'Luxury': 'bg-yellow-100 text-yellow-700'
    };
    return colors[comfort] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="h-full flex flex-col hover:scale-105 cursor-pointer transition-all rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTransportIcon(transport.transportType)}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {transport.transportType}
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${getComfortColor(transport.comfort)}`}>
                {transport.comfort}
              </span>
            </div>
          </div>
          <Link to={transport.bookingUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="text-white bg-green-600 hover:bg-green-700">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {transport.description}
        </p>

        <div className="space-y-2 text-sm mb-3 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{transport.price}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{transport.rating}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{transport.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{transport.availability}</span>
            </div>
          </div>
        </div>

        {transport.features && transport.features.length > 0 && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1">
              {transport.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {transport.features.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">+{transport.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransportCardItem;