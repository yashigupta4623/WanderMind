import React from 'react';
import { Lightbulb, DollarSign, MapPin, Clock, Backpack, Smartphone } from 'lucide-react';

export default function Tips() {
  const tips = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Travel During Off-Season',
      description: 'Visit popular destinations during their off-season to save money on flights and accommodations. You\'ll also enjoy smaller crowds and more authentic experiences.'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Book Flights in Advance',
      description: 'Generally, booking flights 2-3 months in advance offers the best prices. Set price alerts and be flexible with your dates for better deals.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Travel on Weekdays',
      description: 'Flights and hotels are cheaper on weekdays (Tuesday-Thursday) compared to weekends. If possible, avoid peak travel times.'
    },
    {
      icon: <Backpack className="w-8 h-8" />,
      title: 'Pack Light',
      description: 'Avoid baggage fees by packing light. Many budget airlines charge for checked bags. A carry-on is usually sufficient for short trips.'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Use Travel Apps',
      description: 'Download travel apps for flights, hotels, maps, and translation. Apps like Skyscanner, Booking.com, and Google Maps are invaluable.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Stay in Local Neighborhoods',
      description: 'Skip expensive tourist areas. Stay in local neighborhoods where you\'ll find cheaper accommodations, authentic food, and genuine experiences.'
    },
  ];

  const budgetTips = [
    'Eat where locals eat - street food and local markets are cheaper and more authentic',
    'Use public transportation instead of taxis and ride-sharing apps',
    'Walk or bike to explore the city - it\'s free and you\'ll discover hidden gems',
    'Look for free attractions - many cities have free museums, parks, and walking tours',
    'Buy groceries and cook some meals instead of eating out for every meal',
    'Use travel insurance to avoid unexpected medical costs',
    'Book accommodations with kitchens to save on meals',
    'Travel with others to split accommodation and transportation costs',
  ];

  const safetyTips = [
    'Keep copies of important documents separate from originals',
    'Use hotel safes for valuables and extra cash',
    'Avoid displaying expensive items like cameras and jewelry',
    'Use ATMs in well-lit, populated areas during daytime',
    'Keep emergency contacts and embassy information handy',
    'Share your itinerary with someone at home',
    'Trust your instincts - if something feels wrong, leave',
    'Use registered taxis or ride-sharing apps instead of hailing cabs',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Low Fare Travel Tips
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Expert tips to help you travel more, spend less, and have amazing experiences.
          </p>
        </div>

        {/* Main Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {tip.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Budget Tips */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Budget Travel Tips</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgetTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Safety Tips for Budget Travelers</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎯 Use Flight Hacks</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Clear your browser cookies before booking flights, use incognito mode, and check flight prices at different times of day for better deals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">🏨 Negotiate Hotel Rates</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Contact hotels directly for better rates, especially for longer stays. Many hotels offer discounts not available on booking sites.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">🤝 Travel with Friends</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Traveling in groups allows you to split accommodation costs, share transportation, and enjoy group discounts at attractions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">💳 Use Travel Rewards</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Sign up for airline and hotel loyalty programs. Credit card rewards can significantly reduce travel costs over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
