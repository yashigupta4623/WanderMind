import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, UtensilsCrossed, Landmark, ShoppingBag, Users, BookOpen } from 'lucide-react';
import { GetCityInsights } from '@/service/AIModel';

function LocalInsights({ trip }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const destination = trip?.userSelection?.location?.label || trip?.tripDetails?.destination || '';

  useEffect(() => {
    console.log('LocalInsights - trip data:', trip);
    console.log('LocalInsights - destination:', destination);
    
    if (destination) {
      fetchLocalInsights();
    } else {
      console.log('No destination found, skipping insights fetch');
      // Set default insights anyway
      setInsights(getCuratedInsights('Bangalore'));
      setLoading(false);
    }
  }, [destination]);

  const fetchLocalInsights = async () => {
    setLoading(true);
    console.log('Fetching insights for:', destination);
    
    try {
      // Try to get AI-generated insights
      const aiInsights = await GetCityInsights(destination);
      console.log('AI insights result:', aiInsights);
      
      if (aiInsights) {
        setInsights(aiInsights);
      } else {
        // Fallback to curated data
        console.log('Using curated data');
        const curatedData = getCuratedInsights(destination);
        console.log('Curated data:', curatedData);
        setInsights(curatedData);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      const curatedData = getCuratedInsights(destination);
      console.log('Error fallback - curated data:', curatedData);
      setInsights(curatedData);
    } finally {
      setLoading(false);
    }
  };

  const getCuratedInsights = (city) => {
    console.log('Getting insights for city:', city);
    
    // Curated database of Indian cities
    const cityData = {
      'Moradabad': {
        famousFor: 'Brass Handicrafts & Locks',
        icon: '🔒',
        description: 'Known as the "Brass City of India", Moradabad is world-famous for its exquisite brass handicrafts, locks, and metalware exported globally.',
        mustTry: ['Seekh Kebab', 'Biryani', 'Petha'],
        traditions: ['Brass craftsmanship passed down generations', 'Traditional metalwork techniques', 'Export hub for handicrafts'],
        history: 'Founded in 1625 by Rustam Khan, Moradabad has been a center of brass industry for over 400 years.',
        shopping: ['Brass utensils', 'Decorative items', 'Locks and hardware', 'Metal sculptures']
      },
      'Delhi': {
        famousFor: 'Mughal Heritage & Street Food',
        icon: '🏛️',
        description: 'India\'s capital, Delhi is a blend of ancient history and modern culture, famous for its Mughal monuments and incredible street food.',
        mustTry: ['Chole Bhature', 'Butter Chicken', 'Parathas', 'Chaat', 'Kebabs'],
        traditions: ['Diwali celebrations', 'Holi festival', 'Qawwali nights', 'Traditional crafts'],
        history: 'Over 5000 years old, Delhi has been the capital of several empires including the Mughals and British.',
        shopping: ['Chandni Chowk markets', 'Dilli Haat handicrafts', 'Sarojini Nagar', 'Connaught Place']
      },
      'Mumbai': {
        famousFor: 'Bollywood & Vada Pav',
        icon: '🎬',
        description: 'The financial capital and entertainment hub of India, Mumbai is known for its fast-paced life, Bollywood, and street food.',
        mustTry: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Misal Pav', 'Bombay Sandwich'],
        traditions: ['Ganesh Chaturthi celebrations', 'Dahi Handi', 'Marine Drive evening walks'],
        history: 'Originally seven islands, Mumbai was developed by the British and became India\'s commercial capital.',
        shopping: ['Colaba Causeway', 'Crawford Market', 'Fashion Street', 'Linking Road']
      },
      'Bangalore': {
        famousFor: 'IT Hub & Garden City',
        icon: '💻',
        description: '<strong>Bangalore Silicon Valley of India</strong>. Known for its pleasant weather, gardens, and thriving tech industry.',
        mustTry: ['Masala Dosa', 'Filter Coffee', 'Bisi Bele Bath', 'Ragi Mudde', 'Mysore Pak'],
        traditions: ['Karaga festival', 'Dasara celebrations', 'Pub culture', 'Startup ecosystem'],
        history: 'Founded in 1537 by Kempe Gowda, Bangalore became the IT capital of India in the 1990s.',
        shopping: ['Commercial Street', 'Brigade Road', 'Chickpet Market', 'UB City']
      },
      'Jaipur': {
        famousFor: 'Pink City & Royal Heritage',
        icon: '👑',
        description: 'The Pink City of India, Jaipur is famous for its royal palaces, forts, and traditional handicrafts.',
        mustTry: ['Dal Baati Churma', 'Ghewar', 'Laal Maas', 'Pyaaz Kachori', 'Rajasthani Thali'],
        traditions: ['Block printing', 'Blue pottery', 'Puppet shows', 'Folk music and dance'],
        history: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is part of the Golden Triangle tourist circuit.',
        shopping: ['Johari Bazaar (jewelry)', 'Bapu Bazaar (textiles)', 'Blue pottery', 'Gemstones']
      },
      'Kolkata': {
        famousFor: 'Cultural Capital & Sweets',
        icon: '🎭',
        description: 'The cultural capital of India, Kolkata is known for its literature, art, music, and delicious Bengali sweets.',
        mustTry: ['Rosogolla', 'Mishti Doi', 'Fish Curry', 'Kathi Rolls', 'Sandesh'],
        traditions: ['Durga Puja', 'Rabindra Sangeet', 'Adda (intellectual discussions)', 'Tram rides'],
        history: 'Former capital of British India, Kolkata was the center of the Bengal Renaissance.',
        shopping: ['New Market', 'College Street (books)', 'Gariahat', 'Dakshinapan']
      },
      'Agra': {
        famousFor: 'Taj Mahal & Marble Inlay',
        icon: '🕌',
        description: 'Home to the iconic Taj Mahal, Agra is famous for Mughal architecture and marble inlay work.',
        mustTry: ['Petha', 'Bedai', 'Dalmoth', 'Mughlai Cuisine', 'Tandoori Chicken'],
        traditions: ['Marble inlay craftsmanship', 'Leather goods', 'Carpet weaving'],
        history: 'Capital of the Mughal Empire from 1556 to 1658, Agra houses three UNESCO World Heritage Sites.',
        shopping: ['Marble handicrafts', 'Leather goods', 'Carpets', 'Petha (sweet)']
      },
      'Varanasi': {
        famousFor: 'Spiritual Capital & Silk',
        icon: '🕉️',
        description: 'One of the oldest living cities, Varanasi is the spiritual heart of India and famous for Banarasi silk.',
        mustTry: ['Banarasi Paan', 'Kachori Sabzi', 'Lassi', 'Chaat', 'Malaiyo'],
        traditions: ['Ganga Aarti', 'Classical music', 'Silk weaving', 'Spiritual rituals'],
        history: 'Over 3000 years old, Varanasi is considered one of the seven sacred cities in Hinduism.',
        shopping: ['Banarasi silk sarees', 'Brass items', 'Wooden toys', 'Rudraksha beads']
      }
    };

    // Normalize city name for better matching
    const normalizedCity = city.toLowerCase().trim();
    console.log('Normalized city:', normalizedCity);
    
    // Try to match the city (check both ways - city includes key OR key includes city)
    let cityKey = Object.keys(cityData).find(key => {
      const normalizedKey = key.toLowerCase();
      const matches = normalizedCity.includes(normalizedKey) || normalizedKey.includes(normalizedCity);
      if (matches) console.log('Matched key:', key);
      return matches;
    });

    // Also check for common alternate names
    const alternateNames = {
      'bengaluru': 'Bangalore',
      'bangalore': 'Bangalore',
      'blr': 'Bangalore',
      'bombay': 'Mumbai',
      'calcutta': 'Kolkata',
      'new delhi': 'Delhi',
      'delhi': 'Delhi'
    };

    if (!cityKey) {
      // Check alternate names
      for (const [alt, main] of Object.entries(alternateNames)) {
        if (normalizedCity.includes(alt) || alt.includes(normalizedCity)) {
          cityKey = main;
          console.log('Matched via alternate name:', alt, '->', main);
          break;
        }
      }
    }

    console.log('Final matched key:', cityKey);
    
    if (cityKey && cityData[cityKey]) {
      console.log('Returning data for:', cityKey);
      return cityData[cityKey];
    }
    
    console.log('No match found, returning default');

    // Default generic insights
    return {
      famousFor: 'Local Culture & Heritage',
      icon: '🌟',
      description: `${city} is a unique destination with its own rich culture, traditions, and local specialties waiting to be discovered.`,
      mustTry: ['Local cuisine', 'Street food', 'Regional specialties', 'Traditional sweets'],
      traditions: ['Local festivals', 'Traditional crafts', 'Cultural performances', 'Regional customs'],
      history: `${city} has a rich historical background that has shaped its unique character and culture.`,
      shopping: ['Local markets', 'Handicrafts', 'Traditional items', 'Souvenirs']
    };
  };

  if (loading) {
    return (
      <Card className="my-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading local insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Local Insights</h2>
        <Badge variant="secondary">Discover {destination}</Badge>
      </div>

      {/* Main Famous For Card */}
      <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{insights.icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                Famous For: {insights.famousFor}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg" dangerouslySetInnerHTML={{ __html: insights.description }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Must Try Food */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-red-600" />
              Must Try Food
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.mustTry && insights.mustTry.length > 0 ? (
                insights.mustTry.map((food, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl">🍽️</span>
                    <span className="font-medium">{food}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No food recommendations available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Local Traditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Local Traditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.traditions && insights.traditions.length > 0 ? (
                insights.traditions.map((tradition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl">🎭</span>
                    <span className="font-medium">{tradition}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No traditions information available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historical Background */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              Historical Background
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700 dark:text-gray-300">
                {insights.history || 'No historical information available'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shopping & Souvenirs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Shopping & Souvenirs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.shopping && insights.shopping.length > 0 ? (
                insights.shopping.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-2xl">🛍️</span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No shopping information available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tip */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Engage with locals to discover hidden gems and authentic experiences. Don't hesitate to try street food from busy stalls - they're usually the best!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LocalInsights;
