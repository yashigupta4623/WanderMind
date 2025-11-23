import React, { useState, useEffect } from 'react';
import { X, Sparkles, UtensilsCrossed, Users, Landmark, ShoppingBag } from 'lucide-react';

function LocalInsightsPopup({ trip, onClose }) {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [insights, setInsights] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const destination = trip?.userSelection?.location?.label || '';

  useEffect(() => {
    if (destination) {
      const data = getCuratedInsights(destination);
      setInsights(data);
    }
  }, [destination]);

  useEffect(() => {
    if (!insights) return;

    // Auto-rotate insights every 5 seconds
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % 5); // Cycle through 5 insight types
    }, 5000);

    return () => clearInterval(interval);
  }, [insights]);

  const getCuratedInsights = (city) => {
    const cityData = {
      'Moradabad': {
        famousFor: 'Brass Handicrafts & Locks',
        icon: '🔒',
        description: '<strong>Moradabad Brass City of India</strong>. World-famous for exquisite brass handicrafts, locks, and metalware exported globally.',
        mustTry: ['Seekh Kebab', 'Biryani', 'Petha'],
        traditions: ['Brass craftsmanship passed down generations', 'Traditional metalwork techniques', 'Export hub for handicrafts'],
        history: 'Founded in 1625 by Rustam Khan, Moradabad has been a center of brass industry for over 400 years.',
        shopping: ['Brass utensils', 'Decorative items', 'Locks and hardware', 'Metal sculptures'],
        travelTips: ['Visit brass workshops in the morning', 'Bargain at local markets', 'Try street food at Ganj area'],
        bestTime: 'October to March (pleasant weather)'
      },
      'Delhi': {
        famousFor: 'Mughal Heritage & Street Food',
        icon: '🏛️',
        description: '<strong>Delhi Heart of India</strong>. A blend of ancient history and modern culture, famous for Mughal monuments and incredible street food.',
        mustTry: ['Chole Bhature', 'Butter Chicken', 'Parathas', 'Chaat', 'Kebabs'],
        traditions: ['Diwali celebrations', 'Holi festival', 'Qawwali nights', 'Traditional crafts'],
        history: 'Over 5000 years old, Delhi has been the capital of several empires including the Mughals and British.',
        shopping: ['Chandni Chowk markets', 'Dilli Haat handicrafts', 'Sarojini Nagar', 'Connaught Place'],
        travelTips: ['Use Metro for easy travel', 'Visit monuments early morning', 'Stay hydrated in summer'],
        bestTime: 'October to March (avoid summer heat)'
      },
      'Mumbai': {
        famousFor: 'Bollywood & Vada Pav',
        icon: '🎬',
        description: '<strong>Mumbai City of Dreams</strong>. The financial capital and entertainment hub, known for fast-paced life, Bollywood, and street food.',
        mustTry: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Misal Pav', 'Bombay Sandwich'],
        traditions: ['Ganesh Chaturthi celebrations', 'Dahi Handi', 'Marine Drive evening walks'],
        history: 'Originally seven islands, Mumbai was developed by the British and became India\'s commercial capital.',
        shopping: ['Colaba Causeway', 'Crawford Market', 'Fashion Street', 'Linking Road'],
        travelTips: ['Use local trains during off-peak', 'Book taxis via apps', 'Try street food at Juhu Beach'],
        bestTime: 'November to February (pleasant weather)'
      },
      'Bangalore': {
        famousFor: 'IT Hub & Garden City',
        icon: '💻',
        description: '<strong>Bangalore Silicon Valley of India</strong>. Known for its pleasant weather, gardens, and thriving tech industry.',
        mustTry: ['Masala Dosa', 'Filter Coffee', 'Bisi Bele Bath', 'Ragi Mudde', 'Mysore Pak'],
        traditions: ['Karaga festival', 'Dasara celebrations', 'Pub culture', 'Startup ecosystem'],
        history: 'Founded in 1537 by Kempe Gowda, Bangalore became the IT capital of India in the 1990s.',
        shopping: ['Commercial Street', 'Brigade Road', 'Chickpet Market', 'UB City'],
        travelTips: ['Traffic peaks 9-11 AM & 6-9 PM', 'Explore cafes in Indiranagar', 'Visit Lalbagh early morning'],
        bestTime: 'Year-round (pleasant climate)'
      },
      'Jaipur': {
        famousFor: 'Pink City & Royal Heritage',
        icon: '👑',
        description: '<strong>Jaipur Pink City</strong>. Famous for royal palaces, forts, and traditional handicrafts.',
        mustTry: ['Dal Baati Churma', 'Ghewar', 'Laal Maas', 'Pyaaz Kachori', 'Rajasthani Thali'],
        traditions: ['Block printing', 'Blue pottery', 'Puppet shows', 'Folk music and dance'],
        history: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is part of the Golden Triangle tourist circuit.',
        shopping: ['Johari Bazaar (jewelry)', 'Bapu Bazaar (textiles)', 'Blue pottery', 'Gemstones'],
        travelTips: ['Hire a guide for forts', 'Bargain at bazaars', 'Stay hydrated'],
        bestTime: 'October to March (avoid summer)'
      },
      'Kolkata': {
        famousFor: 'Cultural Capital & Sweets',
        icon: '🎭',
        description: '<strong>Kolkata City of Joy</strong>. The cultural capital known for literature, art, music, and delicious Bengali sweets.',
        mustTry: ['Rosogolla', 'Mishti Doi', 'Fish Curry', 'Kathi Rolls', 'Sandesh'],
        traditions: ['Durga Puja', 'Rabindra Sangeet', 'Adda (intellectual discussions)', 'Tram rides'],
        history: 'Former capital of British India, Kolkata was the center of the Bengal Renaissance.',
        shopping: ['New Market', 'College Street (books)', 'Gariahat', 'Dakshinapan'],
        travelTips: ['Take a tram ride', 'Visit during Durga Puja', 'Try sweets at KC Das'],
        bestTime: 'October to March (pleasant weather)'
      },
      'Agra': {
        famousFor: 'Taj Mahal & Marble Inlay',
        icon: '🕌',
        description: '<strong>Agra City of Taj</strong>. Home to the iconic Taj Mahal, famous for Mughal architecture and marble inlay work.',
        mustTry: ['Petha', 'Bedai', 'Dalmoth', 'Mughlai Cuisine', 'Tandoori Chicken'],
        traditions: ['Marble inlay craftsmanship', 'Leather goods', 'Carpet weaving'],
        history: 'Capital of the Mughal Empire from 1556 to 1658, Agra houses three UNESCO World Heritage Sites.',
        shopping: ['Marble handicrafts', 'Leather goods', 'Carpets', 'Petha (sweet)'],
        travelTips: ['Visit Taj at sunrise', 'Book tickets online', 'Avoid Fridays (closed)'],
        bestTime: 'October to March (cool weather)'
      },
      'Varanasi': {
        famousFor: 'Spiritual Capital & Silk',
        icon: '🕉️',
        description: '<strong>Varanasi Spiritual Capital</strong>. One of the oldest living cities, the spiritual heart of India and famous for Banarasi silk.',
        mustTry: ['Banarasi Paan', 'Kachori Sabzi', 'Lassi', 'Chaat', 'Malaiyo'],
        traditions: ['Ganga Aarti', 'Classical music', 'Silk weaving', 'Spiritual rituals'],
        history: 'Over 3000 years old, Varanasi is considered one of the seven sacred cities in Hinduism.',
        shopping: ['Banarasi silk sarees', 'Brass items', 'Wooden toys', 'Rudraksha beads'],
        travelTips: ['Attend Ganga Aarti at sunset', 'Take a boat ride at dawn', 'Respect local customs'],
        bestTime: 'October to March (pleasant weather)'
      }
    };

    const normalizedCity = city.toLowerCase().trim();
    
    const alternateNames = {
      'bengaluru': 'Bangalore',
      'bangalore': 'Bangalore',
      'bombay': 'Mumbai',
      'calcutta': 'Kolkata',
      'new delhi': 'Delhi',
      'delhi': 'Delhi'
    };

    let cityKey = Object.keys(cityData).find(key => {
      const normalizedKey = key.toLowerCase();
      return normalizedCity.includes(normalizedKey) || normalizedKey.includes(normalizedCity);
    });

    if (!cityKey) {
      for (const [alt, main] of Object.entries(alternateNames)) {
        if (normalizedCity.includes(alt) || alt.includes(normalizedCity)) {
          cityKey = main;
          break;
        }
      }
    }

    if (cityKey && cityData[cityKey]) {
      return cityData[cityKey];
    }

    return {
      famousFor: 'Local Culture & Heritage',
      icon: '🌟',
      description: `<strong>${city} Unique Destination</strong>. Rich culture, traditions, and local specialties waiting to be discovered.`,
      mustTry: ['Local cuisine', 'Street food', 'Regional specialties'],
      traditions: ['Local festivals', 'Traditional crafts', 'Cultural performances'],
      history: `${city} has a rich historical background that has shaped its unique character.`,
      shopping: ['Local markets', 'Handicrafts', 'Traditional items'],
      travelTips: ['Explore local markets', 'Try regional cuisine', 'Respect local customs'],
      bestTime: 'Check seasonal weather patterns'
    };
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!insights) return null;

  const insightTypes = [
    {
      title: 'Must Try Food',
      icon: <UtensilsCrossed className="w-5 h-5 text-red-600" />,
      items: insights.mustTry,
      emoji: '🍽️',
      color: 'from-red-50 to-orange-50'
    },
    {
      title: 'Local Traditions',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      items: insights.traditions,
      emoji: '🎭',
      color: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Historical Background',
      icon: <Landmark className="w-5 h-5 text-blue-600" />,
      items: [insights.history],
      emoji: '📚',
      color: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Shopping & Souvenirs',
      icon: <ShoppingBag className="w-5 h-5 text-green-600" />,
      items: insights.shopping,
      emoji: '🛍️',
      color: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Travel Tips & Best Time',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      items: [...(insights.travelTips || []), `Best Time: ${insights.bestTime}`],
      emoji: '💡',
      color: 'from-amber-50 to-yellow-50'
    }
  ];

  const current = insightTypes[currentInsight];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ maxWidth: '400px' }}
    >
      <div className={`bg-gradient-to-br ${current.color} border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Local Insights</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* City Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{insights.icon}</span>
            <div>
              <h4 className="font-bold text-lg text-gray-900">{destination}</h4>
              <p className="text-sm text-gray-700">{insights.famousFor}</p>
            </div>
          </div>

          {/* Current Insight */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              {current.icon}
              <h5 className="font-semibold text-gray-900 dark:text-gray-100">{current.title}</h5>
            </div>
            <div className="space-y-2">
              {current.items && current.items.length > 0 ? (
                current.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-lg flex-shrink-0">{current.emoji}</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No information available</p>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {insightTypes.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300
                     ${
                  index === currentInsight
                    ? 'w-8 bg-blue-600'
                    : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Auto-rotating every 5 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalInsightsPopup;
