import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const isDemoMode = !apiKey || apiKey === 'AIzaSyDemoKey123456789';

// Track if we should use demo mode due to rate limits
let forceDemo = false;

// Debug: Log API key status (without exposing the actual key)
console.log("API Key status:", apiKey ? (isDemoMode ? "Demo Mode" : "Valid") : "Missing");

let genAI, model;

if (!isDemoMode) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  } catch (error) {
    console.error("Failed to initialize Google AI:", error);
  }
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


// Demo trip generator for when API is not available
const generateDemoTrip = (location, days, traveler, budget) => {
  const destinations = {
    'mumbai': 'Mumbai',
    'delhi': 'Delhi',
    'goa': 'Goa',
    'jaipur': 'Jaipur',
    'kerala': 'Kerala',
    'manali': 'Manali',
    'agra': 'Agra',
    'udaipur': 'Udaipur'
  };

  const locationKey = location.toLowerCase();
  const destinationName = Object.keys(destinations).find(key =>
    locationKey.includes(key)
  ) ? destinations[Object.keys(destinations).find(key => locationKey.includes(key))] : location;

  return {
    hotels: [
      {
        hotelName: `${destinationName} Grand Hotel`,
        hotelAddress: `123 Main Street, ${destinationName}`,
        price: budget === 'Cheap' ? '₹2,000 - ₹3,500 per night' : budget === 'Moderate' ? '₹4,000 - ₹7,000 per night' : '₹8,000 - ₹15,000 per night',
        hotelImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        geoCoordinates: { latitude: 28.6139, longitude: 77.2090 },
        rating: '4.2 stars',
        description: `A comfortable hotel in the heart of ${destinationName} with modern amenities.`
      },
      {
        hotelName: `${destinationName} Palace`,
        hotelAddress: `456 Heritage Road, ${destinationName}`,
        price: budget === 'Cheap' ? '₹1,800 - ₹3,000 per night' : budget === 'Moderate' ? '₹3,500 - ₹6,000 per night' : '₹7,000 - ₹12,000 per night',
        hotelImageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        geoCoordinates: { latitude: 28.6129, longitude: 77.2095 },
        rating: '4.0 stars',
        description: `Traditional architecture meets modern comfort at this ${destinationName} hotel.`
      }
    ],
    itinerary: Array.from({ length: parseInt(days) }, (_, i) => ({
      day: `Day ${i + 1}`,
      plan: [
        {
          placeName: `${destinationName} Historic Center`,
          placeDetails: `Explore the rich history and culture of ${destinationName} with guided tours and local experiences.`,
          placeImageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
          geoCoordinates: { latitude: 28.6139, longitude: 77.2090 },
          ticketPricing: budget === 'Cheap' ? '₹200 per person' : budget === 'Moderate' ? '₹500 per person' : '₹1,000 per person',
          timeTravel: 'Morning (9:00 AM - 12:00 PM)',
          rating: '4.5'
        },
        {
          placeName: `${destinationName} Local Market`,
          placeDetails: `Experience local shopping, street food, and cultural interactions in the bustling markets.`,
          placeImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          geoCoordinates: { latitude: 28.6149, longitude: 77.2100 },
          ticketPricing: 'Free',
          timeTravel: 'Afternoon (2:00 PM - 5:00 PM)',
          rating: '4.3'
        },
        {
          placeName: `${destinationName} Sunset Point`,
          placeDetails: `Enjoy breathtaking sunset views and local cuisine at this popular evening destination.`,
          placeImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          geoCoordinates: { latitude: 28.6159, longitude: 77.2110 },
          ticketPricing: budget === 'Cheap' ? '₹300 per person' : budget === 'Moderate' ? '₹600 per person' : '₹1,200 per person',
          timeTravel: 'Evening (6:00 PM - 8:00 PM)',
          rating: '4.7'
        }
      ],
      bestTimeVisit: i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Evening'
    }))
  };
};

// Create chat session with fallback to demo mode
const createChatSession = () => {
  if (isDemoMode || forceDemo) {
    return {
      sendMessage: async (prompt) => {
        console.log('Demo mode: Generating sample trip data');

        // Extract location, days, traveler, and budget from prompt
        const locationMatch = prompt.match(/Location:\s*([^,]+)/i);
        const daysMatch = prompt.match(/(\d+)\s*Days?/i);
        const travelerMatch = prompt.match(/for\s+([^,]+?)\s+with/i);
        const budgetMatch = prompt.match(/with\s+a?\s*(\w+)\s+budget/i);

        const location = locationMatch ? locationMatch[1].trim() : 'Mumbai';
        const days = daysMatch ? daysMatch[1] : '3';
        const traveler = travelerMatch ? travelerMatch[1].trim() : 'Solo';
        const budget = budgetMatch ? budgetMatch[1].trim() : 'Moderate';

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const demoData = generateDemoTrip(location, days, traveler, budget);

        return {
          response: {
            text: () => JSON.stringify(demoData)
          }
        };
      }
    };
  }

  return model?.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for a Couple with a Cheap budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place image URL, Geo Coordinates, ticket Pricing, rating. Time travel each of the locations 3 days with each day plan with the best time to visit in JSON format. " },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "```json\n{\"hotels\": [{\"hotelName\": \"The D Las Vegas\", \"hotelAddress\": \"301 Fremont Street, Las Vegas, NV 89101\", \"price\": \"$50 - $100 per night\", \"hotelImageUrl\": \"https://www.thedorleans.com/images/default-source/hotel-images/hotel-exterior-day.jpg?sfvrsn=8c5540f_2\", \"geoCoordinates\": {\"latitude\": 36.1699, \"longitude\": -115.1421}, \"rating\": \"4 stars\", \"description\": \"A budget-friendly hotel located in the heart of Fremont Street. It features a casino, several dining options, and a rooftop pool.\"}, {\"hotelName\": \"Golden Nugget Las Vegas\", \"hotelAddress\": \"129 E Fremont St, Las Vegas, NV 89101\", \"price\": \"$75 - $150 per night\", \"hotelImageUrl\": \"https://www.goldennugget.com/las-vegas/images/hero-images/gn-lv-exterior-hero-desktop.jpg\", \"geoCoordinates\": {\"latitude\": 36.1698, \"longitude\": -115.1415}, \"rating\": \"4.5 stars\", \"description\": \"A historic hotel with a modern twist, featuring a casino, several restaurants, a pool complex, and a shark tank.\"}, {\"hotelName\": \"Circus Circus Hotel & Casino\", \"hotelAddress\": \"2880 S Las Vegas Blvd, Las Vegas, NV 89109\", \"price\": \"$40 - $80 per night\", \"hotelImageUrl\": \"https://media.tacdn.com/media/attractions-splice-spp-674x446/06/7c/1f/62.jpg\", \"geoCoordinates\": {\"latitude\": 36.1116, \"longitude\": -115.1722}, \"rating\": \"3.5 stars\", \"description\": \"A family-friendly hotel with a circus theme, offering a variety of entertainment, dining options, and a midway.\"}, {\"hotelName\": \"The Strat Hotel, Casino & SkyPod\", \"hotelAddress\": \"2000 S Las Vegas Blvd, Las Vegas, NV 89104\", \"price\": \"$60 - $120 per night\", \"hotelImageUrl\": \"https://www.thestrat.com/media/images/hero-images/strat-exterior-hero.jpg\", \"geoCoordinates\": {\"latitude\": 36.1204, \"longitude\": -115.1653}, \"rating\": \"4 stars\", \"description\": \"A hotel located on the Strip, offering a casino, dining options, a pool, and an observation tower with panoramic views.\"}, {\"hotelName\": \"Main Street Station Casino, Brewery & Hotel\", \"hotelAddress\": \"200 N 3rd St, Las Vegas, NV 89101\", \"price\": \"$55 - $110 per night\", \"hotelImageUrl\": \"https://www.mainstreetstationcasino.com/media/images/hero-images/hero-exterior-day.jpg\", \"geoCoordinates\": {\"latitude\": 36.1706, \"longitude\": -115.1388}, \"rating\": \"4 stars\", \"description\": \"A historic hotel located downtown, featuring a casino, brewery, several dining options, and a pool.\"}], \"itinerary\": [{\"day\": \"Day 1\", \"plan\": [{\"placeName\": \"Fremont Street Experience\", \"placeDetails\": \"A pedestrian mall featuring a canopy of lights and free entertainment. Enjoy live music, street performers, and the Viva Vision light show.\", \"placeImageUrl\": \"https://www.visitlasvegas.com/media/5127/freemont-street-experience-viva-vision.jpg\", \"geoCoordinates\": {\"latitude\": 36.1699, \"longitude\": -115.1421}, \"ticketPricing\": \"Free\", \"timeTravel\": \"Evening (7:00 PM - 10:00 PM)\"}, {\"placeName\": \"Neon Museum\", \"placeDetails\": \"A museum showcasing historic neon signs from Las Vegas's past. Take a guided tour or stroll through the 'Neon Boneyard'.\", \"placeImageUrl\": \"https://www.neonmuseum.org/wp-content/uploads/2017/08/Neon-Museum-Sign-Photo-1.jpg\", \"geoCoordinates\": {\"latitude\": 36.1756, \"longitude\": -115.1368}, \"ticketPricing\": \"$20 per person\", \"timeTravel\": \"Afternoon (2:00 PM - 4:00 PM)\"}, {\"placeName\": \"Heart Bar at the Plaza\", \"placeDetails\": \"Enjoy live music and a casual atmosphere at this iconic downtown bar. It's a great spot to people-watch and soak up the local vibe.\", \"placeImageUrl\": \"https://www.plazahotelcasino.com/wp-content/uploads/2019/01/Heart-Bar-at-the-Plaza-Las-Vegas-1-1.jpg\", \"geoCoordinates\": {\"latitude\": 36.1692, \"longitude\": -115.1404}, \"ticketPricing\": \"No entry fee\", \"timeTravel\": \"Late night (10:00 PM - 12:00 AM)\"}], \"bestTimeVisit\": \"Evening\"}, {\"day\": \"Day 2\", \"plan\": [{\"placeName\": \"Hoover Dam\", \"placeDetails\": \"A massive dam and engineering marvel located just outside Las Vegas. Take a tour to learn about its history and significance.\", \"placeImageUrl\": \"https://www.nps.gov/hoov/planyourvisit/images/hooverdam-1_30.jpg\", \"geoCoordinates\": {\"latitude\": 36.0017, \"longitude\": -114.9714}, \"ticketPricing\": \"$30 per person\", \"timeTravel\": \"Morning (9:00 AM - 12:00 PM)\"}, {\"placeName\": \"Red Rock Canyon National Conservation Area\", \"placeDetails\": \"A scenic area offering hiking trails, rock formations, and stunning views. Take a drive through the scenic loop or hike to one of the many overlooks.\", \"placeImageUrl\": \"https://www.blm.gov/sites/default/files/styles/720x480/public/2019-09/red-rock-canyon-national-conservation-area.jpg?itok=jV-1e7L0\", \"geoCoordinates\": {\"latitude\": 36.1794, \"longitude\": -115.3046}, \"ticketPricing\": \"$15 per vehicle\", \"timeTravel\": \"Afternoon (1:00 PM - 4:00 PM)\"}, {\"placeName\": \"In-N-Out Burger\", \"placeDetails\": \"A popular fast-food chain known for its fresh ingredients and classic burgers. Enjoy a casual dinner with your partner.\", \"placeImageUrl\": \"https://www.in-n-out.com/images/media/hamburger-and-fries.jpg\", \"geoCoordinates\": {\"latitude\": 36.1701, \"longitude\": -115.1435}, \"ticketPricing\": \"No entry fee\", \"timeTravel\": \"Evening (6:00 PM - 8:00 PM)\"}], \"bestTimeVisit\": \"Morning\"}, {\"day\": \"Day 3\", \"plan\": [{\"placeName\": \"Bellagio Conservatory & Botanical Garden\", \"placeDetails\": \"A stunning botanical garden featuring seasonal displays of flowers, plants, and sculptures. It's a beautiful and free attraction on the Strip.\", \"placeImageUrl\": \"https://www.bellagio.com/content/dam/mgmresorts/bellagio/images/gallery/conservatory-botanical-garden/conservatory-botanical-garden-hero.jpg\", \"geoCoordinates\": {\"latitude\": 36.1115, \"longitude\": -115.1744}, \"ticketPricing\": \"Free\", \"timeTravel\": \"Morning (10:00 AM - 12:00 PM)\"}, {\"placeName\": \"The LINQ Promenade\", \"placeDetails\": \"An outdoor shopping and entertainment district with a variety of restaurants, shops, and attractions. Ride the High Roller observation wheel for panoramic views.\", \"placeImageUrl\": \"https://www.caesars.com/content/dam/caesars/linq/images/hero-images/linq-promenade-day-hero.jpg\", \"geoCoordinates\": {\"latitude\": 36.1130, \"longitude\": -115.1702}, \"ticketPricing\": \"$30 per person\", \"timeTravel\": \"Afternoon (1:00 PM - 4:00 PM)\"}, {\"placeName\": \"The Cosmopolitan of Las Vegas\", \"placeDetails\": \"A luxurious hotel with a stylish atmosphere. Enjoy a happy hour drink at Chandelier Bar for a sophisticated evening.\", \"placeImageUrl\": \"https://www.cosmopolitanlasvegas.com/content/dam/mgmresorts/cosmopolitan/images/gallery/cosmopolitan-exterior-hero.jpg\", \"geoCoordinates\": {\"latitude\": 36.1102, \"longitude\": -115.1733}, \"ticketPricing\": \"No entry fee\", \"timeTravel\": \"Evening (7:00 PM - 9:00 PM)\"}], \"bestTimeVisit\": \"Morning\"}]}\n\n```" },
        ],
      },
    ],
  });
};

// Enhanced chat session with rate limit handling
export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      const session = createChatSession();
      return await session.sendMessage(prompt);
    } catch (error) {
      console.error('API Error:', error);

      // Check if it's a rate limit error (429)
      if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
        console.log('Rate limit hit, switching to demo mode');
        forceDemo = true;

        // Use demo mode for this request
        const demoSession = createChatSession();
        return await demoSession.sendMessage(prompt);
      }

      // Re-throw other errors
      throw error;
    }
  }
};
