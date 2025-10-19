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

export const AI_PROMPT = `
  Generate a comprehensive, personalized travel plan for destination: {location} for {totalDays} days.
  Traveler profile: {traveler}, Budget: {budget}, Travel persona: {persona}, Themes: {themes}
  User preferences: {userPreferences}
  
  Create an AI-powered, end-to-end itinerary with:
  - Dynamic route optimization for minimal travel time and maximum experience
  - Smart budget allocation across accommodation, transport, food, activities
  - Real-time adaptable recommendations for weather/delays
  - Hidden gems and authentic local experiences
  - Cultural heritage insights and multilingual support
  - Seamless booking integration readiness
  
  CRITICAL: Focus on India destinations with authentic experiences, local culture, and budget optimization.
  
  Return comprehensive JSON with booking-ready information:
  {
    "tripMetadata": {
      "tripId": "string",
      "destination": "string",
      "duration": "{totalDays} days",
      "totalBudget": "₹{amount}",
      "budgetCategory": "{budget}",
      "travelPersona": "{persona}",
      "themes": ["{themes}"],
      "generatedAt": "timestamp",
      "adaptiveScore": number,
      "bookingReadiness": boolean
    },
    "smartBudgetBreakdown": {
      "accommodation": {"amount": "₹string", "percentage": number, "bookingOptions": ["string"]},
      "transport": {"amount": "₹string", "percentage": number, "modes": ["string"]},
      "food": {"amount": "₹string", "percentage": number, "categories": ["string"]},
      "activities": {"amount": "₹string", "percentage": number, "experiences": ["string"]},
      "shopping": {"amount": "₹string", "percentage": number},
      "emergency": {"amount": "₹string", "percentage": number},
      "optimizationTips": ["string"]
    },
    "accommodationOptions": [
      {
        "hotelId": "string",
        "name": "string",
        "category": "budget|moderate|luxury",
        "address": "string",
        "pricePerNight": "₹string",
        "totalCost": "₹string",
        "rating": number,
        "amenities": ["string"],
        "geoCoordinates": {"lat": number, "lng": number},
        "imageUrl": "string",
        "bookingUrl": "string",
        "cancellationPolicy": "string",
        "nearbyAttractions": ["string"],
        "localTransport": ["string"]
      }
    ],
    "dynamicItinerary": [
      {
        "day": number,
        "date": "string",
        "theme": "string",
        "weatherConsideration": "string",
        "timeline": [
          {
            "time": "string",
            "activity": "string",
            "location": "string",
            "description": "string",
            "duration": "string",
            "cost": "₹string",
            "category": "heritage|adventure|culture|food|shopping|nature",
            "geoCoordinates": {"lat": number, "lng": number},
            "imageUrl": "string",
            "rating": number,
            "isHiddenGem": boolean,
            "bookingRequired": boolean,
            "bookingUrl": "string",
            "weatherDependent": boolean,
            "alternatives": ["string"],
            "localTips": ["string"],
            "culturalSignificance": "string"
          }
        ],
        "transportPlan": {
          "mode": "string",
          "cost": "₹string",
          "duration": "string",
          "bookingDetails": "string"
        },
        "mealRecommendations": [
          {
            "meal": "breakfast|lunch|dinner|snacks",
            "restaurant": "string",
            "cuisine": "string",
            "cost": "₹string",
            "location": "string",
            "speciality": "string"
          }
        ],
        "dayBudget": "₹string",
        "emergencyContacts": ["string"]
      }
    ],
    "hiddenGems": [
      {
        "name": "string",
        "type": "string",
        "description": "string",
        "location": "string",
        "bestTime": "string",
        "cost": "₹string",
        "localSecret": "string",
        "geoCoordinates": {"lat": number, "lng": number}
      }
    ],
    "culturalInsights": [
      {
        "aspect": "string",
        "description": "string",
        "dosDonts": ["string"],
        "localCustoms": ["string"],
        "languageTips": ["string"],
        "festivalInfo": "string"
      }
    ],
    "realTimeAdaptations": {
      "weatherAlternatives": [
        {
          "condition": "string",
          "alternatives": ["string"],
          "indoorOptions": ["string"]
        }
      ],
      "trafficOptimizations": ["string"],
      "lastMinuteDeals": ["string"],
      "emergencyPlans": ["string"]
    },
    "bookingSummary": {
      "totalCost": "₹string",
      "bookableItems": [
        {
          "type": "accommodation|transport|activity",
          "name": "string",
          "cost": "₹string",
          "bookingUrl": "string",
          "priority": "high|medium|low"
        }
      ],
      "paymentBreakdown": {
        "immediate": "₹string",
        "onArrival": "₹string",
        "flexible": "₹string"
      }
    },
    "shareableContent": {
      "title": "string",
      "summary": "string",
      "highlights": ["string"],
      "hashtags": ["string"],
      "qrCode": "string"
    }
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