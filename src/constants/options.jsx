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
  Generate a travel plan for the destination: {location} for {totalDays} days. 
  Traveler type: {traveler}, with a {budget} budget. 
  Provide a list of hotel options including the name, address, and the most recent image URL (ensure the URL is working), geo coordinates, rating, and descriptions and price per night in INR as well. 
  Suggest a daily itinerary with place names, details, image URLs, geo coordinates, ticket pricing, ratings, time to travel and travel time for each location for {totalDays} days, including the best time to visit. 
  
  IMPORTANT: Return ONLY valid JSON format. Do not include any markdown code blocks, explanations, or additional text. The response must be a valid JSON object that can be parsed directly.
  
  Expected JSON structure:
  {
    "hotels": [
      {
        "hotelName": "string",
        "hotelAddress": "string", 
        "price": "string",
        "hotelImageUrl": "string",
        "geoCoordinates": {"latitude": number, "longitude": number},
        "rating": "string",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "string",
        "plan": [
          {
            "placeName": "string",
            "placeDetails": "string",
            "placeImageUrl": "string", 
            "geoCoordinates": {"latitude": number, "longitude": number},
            "ticketPricing": "string",
            "rating": "string",
            "timeTravel": "string"
          }
        ],
        "bestTimeVisit": "string"
      }
    ]
  }
`;