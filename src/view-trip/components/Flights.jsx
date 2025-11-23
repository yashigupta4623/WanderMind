import React from 'react';
import FlightCardItem from './FlightCardItem';

function Flights({ trip }) {
  // Parse the tripData JSON string with error handling
  let tripData = {};
  
  try {
    if (trip?.tripData) {
      if (typeof trip.tripData === 'string') {
        tripData = JSON.parse(trip.tripData);
      } else {
        tripData = trip.tripData;
      }
    }
  } catch (error) {
    console.error("Error parsing trip data:", error);
  }

  // Generate budget-appropriate flight options
  const generateFlightOptions = (destination, budget, userBudgetAmount, days) => {
    const budgetRanges = {
      budget: { 
        airlines: ['IndiGo', 'SpiceJet', 'GoFirst'],
        priceRange: [2500, 6000],
        class: 'Economy'
      },
      moderate: { 
        airlines: ['Air India', 'Vistara', 'IndiGo'],
        priceRange: [4000, 12000],
        class: 'Economy/Premium Economy'
      },
      luxury: { 
        airlines: ['Vistara', 'Air India', 'Emirates'],
        priceRange: [8000, 25000],
        class: 'Business/First Class'
      }
    };

    // Adjust based on user budget if provided
    let selectedRange = budgetRanges[budget] || budgetRanges.moderate;
    if (userBudgetAmount && userBudgetAmount > 0) {
      const flightBudget = userBudgetAmount * 0.3; // 30% for flights
      
      if (flightBudget < 8000) {
        selectedRange = budgetRanges.budget;
      } else if (flightBudget < 20000) {
        selectedRange = budgetRanges.moderate;
      } else {
        selectedRange = budgetRanges.luxury;
      }
    }

    const flightTimes = [
      { departure: '06:00', arrival: '08:30', type: 'Morning' },
      { departure: '12:00', arrival: '14:30', type: 'Afternoon' },
      { departure: '18:00', arrival: '20:30', type: 'Evening' }
    ];

    return selectedRange.airlines.map((airline, index) => {
      const basePrice = Math.floor(Math.random() * (selectedRange.priceRange[1] - selectedRange.priceRange[0]) + selectedRange.priceRange[0]);
      const flightTime = flightTimes[index % flightTimes.length];
      
      return {
        airline: airline,
        flightNumber: `${getAirlineCode(airline)}${Math.floor(Math.random() * 9000) + 1000}`,
        price: `₹${basePrice.toLocaleString()}`,
        class: selectedRange.class,
        departure: flightTime.departure,
        arrival: flightTime.arrival,
        duration: '2h 30m',
        type: flightTime.type,
        description: `${flightTime.type} flight to ${destination || 'your destination'} with ${airline}`,
        features: getFlightFeatures(selectedRange.class, airline),
        bookingUrl: `https://www.easemytrip.com/flights/${destination?.toLowerCase().replace(/\s+/g, '-') || 'destination'}`,
        rating: (4.0 + Math.random() * 0.8).toFixed(1),
        baggage: getBaggageInfo(selectedRange.class),
        stops: index === 2 ? '1 Stop' : 'Non-stop'
      };
    });
  };

  // Helper functions
  const getAirlineCode = (airline) => {
    const codes = {
      'IndiGo': '6E',
      'SpiceJet': 'SG',
      'GoFirst': 'G8',
      'Air India': 'AI',
      'Vistara': 'UK',
      'Emirates': 'EK'
    };
    return codes[airline] || 'XX';
  };

  const getFlightFeatures = (flightClass, airline) => {
    const baseFeatures = ['In-flight entertainment', 'Meals included'];
    
    if (flightClass.includes('Business') || flightClass.includes('First')) {
      return [...baseFeatures, 'Priority boarding', 'Lounge access', 'Extra legroom', 'Premium meals'];
    } else if (flightClass.includes('Premium')) {
      return [...baseFeatures, 'Extra legroom', 'Priority boarding', 'Premium snacks'];
    } else {
      return [...baseFeatures, 'Comfortable seating'];
    }
  };

  const getBaggageInfo = (flightClass) => {
    if (flightClass.includes('Business') || flightClass.includes('First')) {
      return '30kg + Cabin bag';
    } else if (flightClass.includes('Premium')) {
      return '25kg + Cabin bag';
    } else {
      return '15kg + Cabin bag';
    }
  };

  const destination = trip?.userSelection?.location?.label || 'Destination';
  const budget = trip?.userSelection?.budget || 'moderate';
  const userBudgetAmount = trip?.userSelection?.budgetAmount || 0;
  const days = parseInt(trip?.userSelection?.noofDays) || 7;

  const flightOptions = generateFlightOptions(destination, budget, userBudgetAmount, days);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">✈️ Flight Options</h2>
        {/* <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
          {flightOptions.length} flights • {budget} budget
        </div> */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flightOptions.map((flight, index) => (
          <div key={index} className="relative">
            <FlightCardItem flight={flight} />
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Best Price
              </div>
            )}
            {index === 1 && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Recommended
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          ✈️ <strong>Tip:</strong> Book flights 2-3 weeks in advance for better deals. Check baggage policies before booking.
        </p>
      </div>
    </div>
  );
}

export default Flights;