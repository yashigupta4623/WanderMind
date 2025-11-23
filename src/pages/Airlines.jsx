import React, { useState } from 'react';
import { Plane, Star, DollarSign, MapPin, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Airlines() {
  const [searchTerm, setSearchTerm] = useState('');

  const airlines = [
    {
      name: 'Emirates',
      rating: 4.8,
      reviews: 2500,
      routes: 'Global',
      specialties: ['Luxury', 'Long-haul', 'Premium service'],
      avgPrice: '$$$'
    },
    {
      name: 'Singapore Airlines',
      rating: 4.7,
      reviews: 2200,
      routes: 'Asia-Pacific',
      specialties: ['Service', 'Comfort', 'Reliability'],
      avgPrice: '$$$'
    },
    {
      name: 'Cathay Pacific',
      rating: 4.6,
      reviews: 1800,
      routes: 'Asia-Pacific',
      specialties: ['Efficiency', 'Service', 'Connectivity'],
      avgPrice: '$$'
    },
    {
      name: 'Turkish Airlines',
      rating: 4.5,
      reviews: 1600,
      routes: 'Global',
      specialties: ['Connectivity', 'Value', 'Network'],
      avgPrice: '$$'
    },
    {
      name: 'Lufthansa',
      rating: 4.4,
      reviews: 2100,
      routes: 'Europe & Global',
      specialties: ['Reliability', 'Network', 'Service'],
      avgPrice: '$$'
    },
    {
      name: 'ANA (All Nippon Airways)',
      rating: 4.7,
      reviews: 1400,
      routes: 'Asia-Pacific',
      specialties: ['Service', 'Punctuality', 'Comfort'],
      avgPrice: '$$$'
    },
    {
      name: 'Southwest Airlines',
      rating: 4.2,
      reviews: 3200,
      routes: 'North America',
      specialties: ['Budget', 'Domestic', 'Friendly'],
      avgPrice: '$'
    },
    {
      name: 'Ryanair',
      rating: 3.8,
      reviews: 2800,
      routes: 'Europe',
      specialties: ['Budget', 'Frequent routes', 'Value'],
      avgPrice: '$'
    },
  ];

  const filteredAirlines = airlines.filter(airline =>
    airline.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Airline Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Compare airlines, read reviews, and find the best option for your trip.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search airlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Airlines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredAirlines.map((airline, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {airline.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(airline.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {airline.rating} ({airline.reviews} reviews)
                    </span>
                  </div>
                </div>
                <Plane className="w-8 h-8 text-blue-600 flex-shrink-0" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{airline.routes}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Average Price: {airline.avgPrice}</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Specialties:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {airline.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tips for Choosing an Airline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">✈️ Consider Your Route</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Different airlines excel on different routes. Check which airlines fly your specific route and compare their service quality.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">💰 Compare Prices</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Use flight comparison tools to find the best prices. Budget airlines can save money, but check baggage policies.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">⭐ Read Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Check recent reviews to understand current service quality, punctuality, and customer satisfaction.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎫 Check Baggage Policies</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Different airlines have different baggage allowances. Factor in baggage costs when comparing prices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
