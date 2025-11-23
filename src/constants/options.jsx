export const SelectTravelsList = [
  {
    id: 1,
    title: 'Solo Traveler',
    desc: 'A sole travels in exploration',
    icon: '🪙',
    people: '1',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travels in tandem',
    icon: '🥂',
    people: '2 People',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun-loving adv',
    icon: '🏠',
    people: '3 to 5 People',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'An adventure to lifelong',
    icon: '🤝',
    people: '5 to 10 People',
  },
];

// Travel Persona Modes
export const TravelPersonas = [
  {
    id: 1,
    title: 'Heritage Explorer',
    desc: 'Discover historical sites, museums, and cultural landmarks',
    icon: '🏛️',
    keywords: 'heritage, history, museums, monuments, cultural sites, temples, forts'
  },
  {
    id: 2,
    title: 'Adventure Seeker',
    desc: 'Thrilling activities, trekking, and outdoor adventures',
    icon: '🏔️',
    keywords: 'adventure, trekking, hiking, rafting, paragliding, rock climbing, camping'
  },
  {
    id: 3,
    title: 'Luxury Nomad',
    desc: 'Premium experiences, fine dining, and luxury stays',
    icon: '💎',
    keywords: 'luxury, premium, fine dining, spa, resort, high-end shopping, exclusive'
  },
  {
    id: 4,
    title: 'Nightlife Enthusiast',
    desc: 'Bars, clubs, live music, and vibrant nightlife',
    icon: '🌃',
    keywords: 'nightlife, bars, clubs, live music, pubs, rooftop, party, entertainment'
  },
  {
    id: 5,
    title: 'Nature Lover',
    desc: 'Wildlife, national parks, and scenic landscapes',
    icon: '🌿',
    keywords: 'nature, wildlife, national parks, forests, lakes, mountains, beaches'
  },
  {
    id: 6,
    title: 'Food Explorer',
    desc: 'Local cuisine, street food, and culinary experiences',
    icon: '🍜',
    keywords: 'food, cuisine, street food, local dishes, restaurants, cooking classes'
  }
];

// Travel Themes for enhanced planning
export const TravelThemes = [
  { id: 1, name: 'Heritage & Culture', icon: '🏛️' },
  { id: 2, name: 'Adventure & Sports', icon: '🏔️' },
  { id: 3, name: 'Relaxation & Wellness', icon: '🧘' },
  { id: 4, name: 'Nightlife & Entertainment', icon: '🌃' },
  { id: 5, name: 'Nature & Wildlife', icon: '🌿' },
  { id: 6, name: 'Food & Culinary', icon: '🍜' },
  { id: 7, name: 'Shopping & Markets', icon: '🛍️' },
  { id: 8, name: 'Photography & Scenic', icon: '📸' }
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Don’t worry about cost',
    icon: '💸',
  },
];

export const AI_ITINERARY_PROMPT = `
  Generate day-by-day itinerary for {location}, {totalDays} days.
  Traveler: {traveler} | Budget: {budget} | Style: {persona} | Interests: {themes}
  {userPreferences}
  
  IMPORTANT: All prices MUST be in Indian Rupees (₹) format. Use ₹ symbol, not $.
  
  Return JSON only:
  {
    "itinerary": [
      {
        "day": number,
        "theme": "string",
        "plan": [
          {
            "placeName": "string",
            "placeDetails": "string (brief)",
            "placeImageUrl": "string",
            "geoCoordinates": {"lat": number, "lng": number},
            "ticketPricing": "string (MUST use ₹ symbol, e.g., ₹200-500 or Free)",
            "timeTravel": "string",
            "rating": number,
            "duration": "string"
          }
        ]
      }
    ]
  }
`;

export const AI_HOTEL_PROMPT = `
  Suggest 5-6 hotels in {location} for {totalDays} days.
  Traveler: {traveler} | Budget: {budget} | Style: {persona}
  
  IMPORTANT: All prices MUST be in Indian Rupees (₹) format. Use ₹ symbol, not $.
  
  Return JSON only:
  {
    "hotels": [
      {
        "hotelName": "string",
        "hotelAddress": "string",
        "price": "string (MUST use ₹ symbol, e.g., ₹3000-5000 per night)",
        "hotelImageUrl": "string",
        "geoCoordinates": {"lat": number, "lng": number},
        "rating": number,
        "description": "string (brief)"
      }
    ]
  }
`;

// Conversational AI Prompt for chat refinements
export const CHAT_REFINEMENT_PROMPT = `
  You are a travel planning assistant. The user has an existing trip plan and wants to make changes.
  
  Current trip: {currentTrip}
  User request: {userMessage}
  
  Analyze the request and provide:
  1. Understanding of what they want to change
  2. Updated itinerary sections affected
  3. Budget impact
  4. Alternative suggestions
  
  Common requests:
  - "Add a day in [location]"
  - "Reduce budget to ₹[amount]"
  - "Remove [activity/place]"
  - "Make it more [adventurous/relaxing/cultural]"
  - "Find cheaper alternatives"
  
  Return JSON with the modifications needed.
`;

// Budget Predictor Prompt
export const BUDGET_PREDICTOR_PROMPT = `
  Predict the ideal budget for a trip to {destination} for {days} days with {travelers} travelers.
  
  Consider:
  - Accommodation costs (budget/moderate/luxury)
  - Food expenses (local/mid-range/fine dining)
  - Transportation (local transport, intercity)
  - Activities and attractions
  - Shopping and miscellaneous
  - Seasonal price variations
  
  Provide budget ranges in INR for different comfort levels.
`;