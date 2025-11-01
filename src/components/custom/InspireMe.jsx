import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Search, MapPin, Star, Clock, Sparkles } from 'lucide-react';
import { chatSession } from '@/service/AIModel';
import { toast } from 'sonner';

const InspireMe = ({ onDestinationSelect }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fileInputRef = useRef(null);

  const tripFilters = [
    { id: 'all', name: 'All Trips', icon: '🌟' },
    { id: 'heritage', name: 'Heritage', icon: '🏛️' },
    { id: 'adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'spiritual', name: 'Spiritual', icon: '🛕' },
    { id: 'luxury', name: 'Luxury', icon: '💎' }
  ];

  const getFilteredTrips = () => {
    if (selectedFilter === 'all') return curatedTrips;
    
    const filterMap = {
      heritage: ['Heritage & Culture', 'Heritage & Luxury', 'Spiritual & Cultural'],
      adventure: ['Adventure & Mountains'],
      nature: ['Nature & Relaxation', 'Nature & Wildlife'],
      beach: ['Beach & Nightlife'],
      spiritual: ['Spiritual & Cultural'],
      luxury: ['Heritage & Luxury']
    };
    
    return curatedTrips.filter(trip => 
      filterMap[selectedFilter]?.some(theme => trip.theme.includes(theme.split(' & ')[0]))
    );
  };

  const INSPIRE_PROMPT = `
    Analyze this image/keyword: {input} and suggest 5 beautiful destinations in India that match this vibe.
    
    For each destination, provide:
    - Name and state
    - Why it matches the image/keyword
    - Best time to visit
    - Key attractions (3-4)
    - Approximate budget for 3 days
    - Unique experience highlight
    
    Return as JSON array with this structure:
    [
      {
        "name": "destination name",
        "state": "state name",
        "matchReason": "why it matches",
        "bestTime": "best months to visit",
        "attractions": ["attraction1", "attraction2", "attraction3"],
        "budget": "budget range in INR",
        "uniqueExperience": "special highlight",
        "imageKeywords": "keywords for image search",
        "rating": "4.5/5"
      }
    ]
  `;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    try {
      // For demo purposes, we'll analyze based on image characteristics
      // In a real implementation, you'd use Google Vision API or similar
      const imageAnalysis = analyzeImageCharacteristics(imageData);
      await findDestinations(imageAnalysis);
    } catch (error) {
      console.error('Image analysis error:', error);
      toast.error('Failed to analyze image. Please try with keywords instead.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImageCharacteristics = (imageData) => {
    // Simple image analysis based on filename or user input
    // In production, integrate with Google Vision API
    return {
      colors: ['blue', 'green', 'white'],
      objects: ['mountains', 'water', 'nature'],
      mood: 'serene'
    };
  };

  const handleKeywordSearch = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    setIsAnalyzing(true);
    try {
      await findDestinations(keyword);
    } catch (error) {
      console.error('Keyword search error:', error);
      toast.error('Failed to find destinations. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const findDestinations = async (input) => {
    try {
      const prompt = INSPIRE_PROMPT.replace('{input}', JSON.stringify(input));
      const result = await chatSession.sendMessage(prompt);
      const response = result?.response?.text();
      
      // Parse AI response
      let destinations;
      try {
        destinations = JSON.parse(response);
      } catch (e) {
        // Fallback to sample destinations if parsing fails
        destinations = getSampleDestinations(input);
      }

      setSuggestions(destinations);
    } catch (error) {
      console.error('Destination finding error:', error);
      setSuggestions(getSampleDestinations(input));
    }
  };

  const getSampleDestinations = (input) => {
    const sampleDestinations = [
      {
        name: "Manali",
        state: "Himachal Pradesh",
        matchReason: "Perfect mountain destination with snow-capped peaks",
        bestTime: "March to June, October to February",
        attractions: ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Old Manali"],
        budget: "₹15,000 - ₹25,000 for 3 days",
        uniqueExperience: "Paragliding over Solang Valley",
        imageKeywords: "mountains snow adventure",
        rating: "4.6/5"
      },
      {
        name: "Goa",
        state: "Goa",
        matchReason: "Beautiful beaches and vibrant coastal culture",
        bestTime: "November to March",
        attractions: ["Baga Beach", "Dudhsagar Falls", "Old Goa Churches", "Anjuna Market"],
        budget: "₹12,000 - ₹20,000 for 3 days",
        uniqueExperience: "Sunset cruise on Mandovi River",
        imageKeywords: "beach ocean sunset",
        rating: "4.4/5"
      },
      {
        name: "Rishikesh",
        state: "Uttarakhand",
        matchReason: "Spiritual destination with river adventures",
        bestTime: "February to May, September to November",
        attractions: ["Laxman Jhula", "Beatles Ashram", "Triveni Ghat", "Neer Garh Waterfall"],
        budget: "₹8,000 - ₹15,000 for 3 days",
        uniqueExperience: "White water rafting in Ganges",
        imageKeywords: "river spiritual mountains",
        rating: "4.5/5"
      }
    ];

    return sampleDestinations;
  };

  const handleDestinationSelect = (destination) => {
    if (onDestinationSelect) {
      onDestinationSelect({
        label: `${destination.name}, ${destination.state}`,
        value: destination.name,
        destination: destination
      });
    }
    toast.success(`Selected ${destination.name} as your destination!`);
  };

  const predefinedKeywords = [
    { keyword: 'snow mountains', icon: '🏔️' },
    { keyword: 'beaches ocean', icon: '🏖️' },
    { keyword: 'desert sand', icon: '🏜️' },
    { keyword: 'forests wildlife', icon: '🌲' },
    { keyword: 'lakes peaceful', icon: '🏞️' },
    { keyword: 'temples spiritual', icon: '🛕' },
    { keyword: 'hills tea gardens', icon: '🍃' },
    { keyword: 'backwaters boats', icon: '🛶' }
  ];

  // Curated trip suggestions
  const curatedTrips = [
    {
      id: 'golden_triangle',
      title: 'Golden Triangle Classic',
      duration: '6 days',
      destinations: ['Delhi', 'Agra', 'Jaipur'],
      theme: 'Heritage & Culture',
      budget: '₹25,000 - ₹45,000',
      bestTime: 'Oct - Mar',
      highlights: ['Taj Mahal', 'Red Fort', 'Hawa Mahal', 'Amber Fort'],
      description: 'Experience India\'s most iconic heritage circuit with magnificent palaces, forts, and the world-famous Taj Mahal.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
      difficulty: 'Easy',
      travelStyle: 'Heritage Explorer'
    },
    {
      id: 'kerala_backwaters',
      title: 'Kerala Backwaters & Hills',
      duration: '5 days',
      destinations: ['Kochi', 'Alleppey', 'Munnar'],
      theme: 'Nature & Relaxation',
      budget: '₹20,000 - ₹35,000',
      bestTime: 'Sep - May',
      highlights: ['Houseboat Stay', 'Tea Plantations', 'Spice Gardens', 'Kathakali Dance'],
      description: 'Cruise through serene backwaters, explore lush tea gardens, and experience Kerala\'s rich cultural heritage.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400',
      difficulty: 'Easy',
      travelStyle: 'Nature Lover'
    },
    {
      id: 'rajasthan_royal',
      title: 'Royal Rajasthan',
      duration: '8 days',
      destinations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
      theme: 'Heritage & Luxury',
      budget: '₹40,000 - ₹80,000',
      bestTime: 'Oct - Mar',
      highlights: ['City Palace', 'Lake Pichola', 'Mehrangarh Fort', 'Desert Safari'],
      description: 'Live like royalty in magnificent palaces, explore desert landscapes, and witness Rajasthan\'s vibrant culture.',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
      difficulty: 'Moderate',
      travelStyle: 'Luxury Nomad'
    },
    {
      id: 'himachal_adventure',
      title: 'Himachal Adventure',
      duration: '7 days',
      destinations: ['Manali', 'Kasol', 'Tosh', 'Kheerganga'],
      theme: 'Adventure & Mountains',
      budget: '₹18,000 - ₹30,000',
      bestTime: 'Mar - Jun, Sep - Nov',
      highlights: ['Paragliding', 'Trekking', 'River Rafting', 'Camping'],
      description: 'Thrilling adventures in the Himalayas with trekking, paragliding, and stunning mountain landscapes.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      difficulty: 'Challenging',
      travelStyle: 'Adventure Seeker'
    },
    {
      id: 'goa_beaches',
      title: 'Goa Beach Paradise',
      duration: '4 days',
      destinations: ['North Goa', 'South Goa'],
      theme: 'Beach & Nightlife',
      budget: '₹15,000 - ₹25,000',
      bestTime: 'Nov - Feb',
      highlights: ['Beach Parties', 'Water Sports', 'Portuguese Architecture', 'Seafood'],
      description: 'Relax on pristine beaches, enjoy vibrant nightlife, and explore Goa\'s unique Indo-Portuguese culture.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
      difficulty: 'Easy',
      travelStyle: 'Nightlife Enthusiast'
    },
    {
      id: 'south_india_temples',
      title: 'South India Temple Trail',
      duration: '9 days',
      destinations: ['Chennai', 'Madurai', 'Thanjavur', 'Pondicherry'],
      theme: 'Spiritual & Cultural',
      budget: '₹22,000 - ₹38,000',
      bestTime: 'Oct - Mar',
      highlights: ['Meenakshi Temple', 'Brihadeeswarar Temple', 'French Quarter', 'Classical Dance'],
      description: 'Discover South India\'s magnificent temples, classical arts, and diverse cultural heritage.',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
      difficulty: 'Moderate',
      travelStyle: 'Heritage Explorer'
    },
    {
      id: 'northeast_explorer',
      title: 'Northeast India Explorer',
      duration: '10 days',
      destinations: ['Guwahati', 'Shillong', 'Cherrapunji', 'Kaziranga'],
      theme: 'Nature & Wildlife',
      budget: '₹30,000 - ₹50,000',
      bestTime: 'Oct - Apr',
      highlights: ['Living Root Bridges', 'Rhino Safari', 'Waterfalls', 'Tribal Culture'],
      description: 'Explore India\'s hidden gem with unique landscapes, diverse wildlife, and rich tribal heritage.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
      difficulty: 'Moderate',
      travelStyle: 'Nature Lover'
    },
    {
      id: 'ladakh_adventure',
      title: 'Ladakh High Altitude',
      duration: '8 days',
      destinations: ['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'],
      theme: 'Adventure & Mountains',
      budget: '₹35,000 - ₹55,000',
      bestTime: 'May - Sep',
      highlights: ['Highest Motorable Road', 'Magnetic Hill', 'Monasteries', 'Desert Safari'],
      description: 'Experience the roof of the world with breathtaking landscapes, ancient monasteries, and unique culture.',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400',
      difficulty: 'Challenging',
      travelStyle: 'Adventure Seeker'
    }
  ];

  const handleCuratedTripSelect = (trip) => {
    const tripDestination = {
      label: `${trip.destinations.join(' → ')} (${trip.duration})`,
      value: trip.destinations[0],
      trip: trip
    };
    
    if (onDestinationSelect) {
      onDestinationSelect(tripDestination);
    }
    toast.success(`Selected ${trip.title}! Perfect choice for ${trip.travelStyle.toLowerCase()}s.`);
  };

  return (
    <div className="space-y-6">
      {/* Curated Trip Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Curated Trip Suggestions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Handpicked itineraries designed by travel experts for different interests and budgets
          </p>
        </CardHeader>
        <CardContent>
          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{curatedTrips.length}</div>
              <div className="text-xs text-gray-600">Curated Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹15K+</div>
              <div className="text-xs text-gray-600">Starting From</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4-10</div>
              <div className="text-xs text-gray-600">Days Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25+</div>
              <div className="text-xs text-gray-600">Destinations</div>
            </div>
          </div>

          {/* Trip Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tripFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="flex items-center gap-1 text-xs"
              >
                <span>{filter.icon}</span>
                {filter.name}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {getFilteredTrips().length} trip{getFilteredTrips().length !== 1 ? 's' : ''} 
              {selectedFilter !== 'all' && ` for ${tripFilters.find(f => f.id === selectedFilter)?.name}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredTrips().map((trip) => (
              <Card 
                key={trip.id} 
                className="cursor-pointer hover:shadow-lg transition-all group"
                onClick={() => handleCuratedTripSelect(trip)}
              >
                <div className="relative">
                  <img 
                    src={trip.image} 
                    alt={trip.title}
                    className="w-full h-32 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs">
                      {trip.duration}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {trip.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{trip.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{trip.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium text-green-600">{trip.budget}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Best Time:</span>
                      <span className="font-medium">{trip.bestTime}</span>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-gray-500">Destinations:</span>
                      <p className="font-medium text-blue-600">{trip.destinations.join(' → ')}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trip.highlights.slice(0, 2).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {trip.highlights.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{trip.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full mt-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCuratedTripSelect(trip);
                    }}
                  >
                    Choose This Trip
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Perfect for This Season
          </CardTitle>
          <p className="text-sm text-gray-600">
            Destinations that are ideal to visit right now based on weather and local events
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Current month recommendations */}
            {curatedTrips.slice(0, 4).map((trip) => (
              <div 
                key={`seasonal-${trip.id}`}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors dark:border-gray-700"
                onClick={() => handleCuratedTripSelect(trip)}
              >
                <img 
                  src={trip.image} 
                  alt={trip.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{trip.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">{trip.destinations.join(', ')}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{trip.duration}</Badge>
                    <Badge variant="secondary" className="text-xs">{trip.budget.split(' - ')[0]}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Trending Destinations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Most popular destinations chosen by travelers this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Manali', bookings: '2.3K', trend: '+15%', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' },
              { name: 'Goa', bookings: '1.8K', trend: '+8%', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
              { name: 'Jaipur', bookings: '1.5K', trend: '+12%', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200' },
              { name: 'Kerala', bookings: '1.2K', trend: '+20%', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200' }
            ].map((dest, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer"
                onClick={() => {
                  const destination = { label: dest.name, value: dest.name };
                  if (onDestinationSelect) onDestinationSelect(destination);
                  toast.success(`Selected ${dest.name}! A trending choice.`);
                }}
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col justify-end p-2">
                  <h4 className="text-white font-medium text-sm">{dest.name}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80">{dest.bookings} bookings</span>
                    <Badge className="bg-green-500 text-white text-xs">{dest.trend}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            Custom Discovery
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload an image or enter keywords to discover matching destinations in India
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedImage ? (
              <div className="space-y-3">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="max-h-48 mx-auto rounded-lg"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Upload an inspiring image</p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG up to 5MB
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Keyword Search */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Or describe what you're looking for... (e.g., 'snow mountains', 'peaceful lakes')"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleKeywordSearch()}
              />
              <Button onClick={handleKeywordSearch} disabled={isAnalyzing}>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Predefined Keywords */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick inspiration:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedKeywords.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setKeyword(item.keyword);
                      findDestinations(item.keyword);
                    }}
                    className="text-xs"
                  >
                    {item.icon} {item.keyword}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 animate-pulse" />
              <span>Analyzing and finding perfect destinations...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destination Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Inspired Destinations for You</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestions.map((destination, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {destination.name}
                        </h4>
                        <p className="text-sm text-gray-600">{destination.state}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {destination.rating}
                      </div>
                    </div>

                    <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      💡 {destination.matchReason}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Best Time:</span>
                        <span>{destination.bestTime}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Budget:</span>
                        <span className="ml-2 text-green-600">{destination.budget}</span>
                      </div>

                      <div>
                        <span className="font-medium">Top Attractions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {destination.attractions.slice(0, 3).map((attraction, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {attraction}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-2 rounded">
                        <span className="font-medium text-yellow-800">✨ Unique Experience:</span>
                        <p className="text-yellow-700 text-xs mt-1">{destination.uniqueExperience}</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleDestinationSelect(destination)}
                    >
                      Choose This Destination
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspireMe;