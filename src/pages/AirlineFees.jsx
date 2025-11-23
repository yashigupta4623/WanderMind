import React, { useState } from 'react';
import { DollarSign, Luggage, Users, AlertCircle, TrendingDown, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AirlineFees() {
  const [selectedAirline, setSelectedAirline] = useState('emirates');

  const airlineFees = {
    emirates: {
      name: 'Emirates',
      logo: '✈️',
      fees: [
        { category: 'Baggage', item: 'First Checked Bag', fee: 'Free', notes: 'Included in ticket' },
        { category: 'Baggage', item: 'Second Checked Bag', fee: '$50-75', notes: 'Per bag' },
        { category: 'Baggage', item: 'Excess Weight (per kg)', fee: '$15-20', notes: 'Over 23kg' },
        { category: 'Baggage', item: 'Oversized Baggage', fee: '$100-150', notes: 'Per bag' },
        { category: 'Seat Selection', item: 'Extra Legroom Seat', fee: '$50-200', notes: 'Depends on route' },
        { category: 'Seat Selection', item: 'Window/Aisle Seat', fee: '$25-75', notes: 'Premium seats' },
        { category: 'Meals', item: 'Special Meal Request', fee: 'Free', notes: 'Advance notice required' },
        { category: 'Changes', item: 'Flight Change', fee: '$50-100', notes: 'Plus fare difference' },
        { category: 'Changes', item: 'Name Change', fee: '$100-200', notes: 'Non-transferable' },
      ]
    },
    ryanair: {
      name: 'Ryanair',
      logo: '🛫',
      fees: [
        { category: 'Baggage', item: 'Carry-on Bag', fee: 'Free', notes: 'Small bag only' },
        { category: 'Baggage', item: 'Priority Boarding', fee: '$8-15', notes: 'Includes 2 bags' },
        { category: 'Baggage', item: 'First Checked Bag', fee: '$15-30', notes: 'Per flight' },
        { category: 'Baggage', item: 'Second Checked Bag', fee: '$20-40', notes: 'Per flight' },
        { category: 'Baggage', item: 'Excess Weight (per kg)', fee: '$10-15', notes: 'Over 20kg' },
        { category: 'Seat Selection', item: 'Seat Selection', fee: '$5-20', notes: 'Varies by route' },
        { category: 'Seat Selection', item: 'Extra Legroom', fee: '$15-50', notes: 'Premium seats' },
        { category: 'Changes', item: 'Flight Change', fee: '$25-50', notes: 'Plus fare difference' },
        { category: 'Payment', item: 'Credit Card Fee', fee: '2%', notes: 'On ticket price' },
      ]
    },
    lufthansa: {
      name: 'Lufthansa',
      logo: '🌍',
      fees: [
        { category: 'Baggage', item: 'First Checked Bag', fee: 'Free', notes: 'Included in ticket' },
        { category: 'Baggage', item: 'Second Checked Bag', fee: '$60-80', notes: 'Per bag' },
        { category: 'Baggage', item: 'Excess Weight (per kg)', fee: '$12-18', notes: 'Over 23kg' },
        { category: 'Baggage', item: 'Oversized Baggage', fee: '$80-120', notes: 'Per bag' },
        { category: 'Seat Selection', item: 'Seat Selection', fee: '$10-30', notes: 'Standard seats' },
        { category: 'Seat Selection', item: 'Extra Legroom', fee: '$50-150', notes: 'Premium seats' },
        { category: 'Meals', item: 'Special Meal Request', fee: 'Free', notes: 'Advance notice' },
        { category: 'Changes', item: 'Flight Change', fee: '$40-80', notes: 'Plus fare difference' },
        { category: 'Services', item: 'Pet in Cabin', fee: '$100-200', notes: 'Per flight' },
      ]
    },
    southwest: {
      name: 'Southwest Airlines',
      logo: '🛩️',
      fees: [
        { category: 'Baggage', item: 'First Checked Bag', fee: 'Free', notes: 'Included' },
        { category: 'Baggage', item: 'Second Checked Bag', fee: 'Free', notes: 'Included' },
        { category: 'Baggage', item: 'Carry-on Bag', fee: 'Free', notes: 'Included' },
        { category: 'Baggage', item: 'Excess Weight (per bag)', fee: '$75-100', notes: 'Over 50 lbs' },
        { category: 'Baggage', item: 'Oversized Baggage', fee: '$75-100', notes: 'Per bag' },
        { category: 'Seat Selection', item: 'Early Bird Check-in', fee: '$15-25', notes: 'Better seat selection' },
        { category: 'Seat Selection', item: 'Premium Seat', fee: '$15-30', notes: 'Extra legroom' },
        { category: 'Changes', item: 'Flight Change', fee: 'Free', notes: 'Unique to Southwest' },
        { category: 'Services', item: 'Pet in Cabin', fee: '$95-125', notes: 'Per flight' },
      ]
    }
  };

  const tips = [
    {
      icon: <Luggage className="w-6 h-6" />,
      title: 'Pack Smart',
      description: 'Know your airline\'s baggage allowance. Pack light to avoid excess baggage fees.'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Compare Total Cost',
      description: 'Don\'t just compare ticket prices. Factor in baggage, seat selection, and other fees.'
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: 'Book Direct',
      description: 'Sometimes booking directly with airlines offers better deals and fee waivers.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Join Loyalty Programs',
      description: 'Frequent flyer programs often waive baggage fees and offer other perks.'
    },
  ];

  const categories = Object.keys(airlineFees).map(key => ({
    id: key,
    name: airlineFees[key].name
  }));

  const currentFees = airlineFees[selectedAirline];
  const feesByCategory = {};
  
  currentFees.fees.forEach(fee => {
    if (!feesByCategory[fee.category]) {
      feesByCategory[fee.category] = [];
    }
    feesByCategory[fee.category].push(fee);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Airline Fees Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Compare baggage fees, seat selection charges, and other airline costs to plan your budget.
          </p>
        </div>

        {/* Airline Selector */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(airline => (
              <button
                key={airline.id}
                onClick={() => setSelectedAirline(airline.id)}
                className={`p-4 rounded-lg transition-all font-medium ${
                  selectedAirline === airline.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">{airlineFees[airline.id].logo}</div>
                {airline.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fees Table */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentFees.name} Fees
              </h2>
            </div>

            {Object.entries(feesByCategory).map(([category, fees]) => (
              <div key={category} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white">{category}</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {fees.map((fee, idx) => (
                    <div key={idx} className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{fee.item}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{fee.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{fee.fee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Money-Saving Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Important Notes</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Fees vary by route, season, and booking class</li>
                  <li>• Premium members often get fee waivers</li>
                  <li>• Fees are subject to change - check airline website for latest rates</li>
                  <li>• Some fees may be waived for elite frequent flyer members</li>
                  <li>• International flights may have different fee structures</li>
                  <li>• Always read the fine print before booking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
