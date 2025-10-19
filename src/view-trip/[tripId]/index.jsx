import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Infosection from '../components/Infosection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import ConversationalPlanner from '@/components/custom/ConversationalPlanner';
import EcoScoreIndicator from '@/components/custom/EcoScoreIndicator';
import TripStoryGenerator from '@/components/custom/TripStoryGenerator';
import WeatherAdaptive from '@/components/custom/WeatherAdaptive';
import OfflineMode from '@/components/custom/OfflineMode';
import BookingSystem from '@/components/custom/BookingSystem';
import RealTimeAdaptation from '@/components/custom/RealTimeAdaptation';
import MultilingualSupport from '@/components/custom/MultilingualSupport';
import { MapPin, MessageCircle, Leaf, BookOpen, Share2, Download, Cloud, Wifi, CreditCard, Zap, Globe } from 'lucide-react';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
        toast.error('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      toast.error('Error getting trip data');
    }
  };

  const handleTripUpdate = (modifications) => {
    // Update trip data with modifications from conversational planner
    setTrip(prevTrip => ({
      ...prevTrip,
      ...modifications
    }));
    toast.success('Trip updated successfully!');
  };

  const generateShareableCard = () => {
    // Generate a shareable trip card
    const tripSummary = {
      destination: trip?.userSelection?.location?.label,
      duration: trip?.userSelection?.noofDays,
      travelers: trip?.userSelection?.traveler,
      budget: trip?.userSelection?.budget
    };
    
    // In a real implementation, this would generate a PDF or image
    toast.success('Shareable trip card generated!');
    return tripSummary;
  };

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Trip Header with Quick Actions */}
      <div className="mb-6">
        <Infosection trip={trip} />
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateShareableCard}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Trip
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('story')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Generate Story
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('eco')}
            className="flex items-center gap-2"
          >
            <Leaf className="w-4 h-4" />
            Eco Score
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('booking')}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Book Now
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('realtime')}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Live Updates
          </Button>
        </div>
      </div>

      {/* Enhanced Trip View with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-1 text-xs">
            <CreditCard className="w-3 h-3" />
            <span className="hidden sm:inline">Book</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-1 text-xs">
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1 text-xs">
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="multilingual" className="flex items-center gap-1 text-xs">
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-1 text-xs">
            <Cloud className="w-3 h-3" />
            <span className="hidden sm:inline">Weather</span>
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-1 text-xs">
            <BookOpen className="w-3 h-3" />
            <span className="hidden sm:inline">Story</span>
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-1 text-xs">
            <Share2 className="w-3 h-3" />
            <span className="hidden sm:inline">Share</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-8">
            <Hotels trip={trip} />
            <PlacesToVisit trip={trip} />
          </div>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <BookingSystem 
            tripData={trip}
            onBookingComplete={(bookingData) => {
              console.log('Booking completed:', bookingData);
              toast.success(`Booking confirmed! ID: ${bookingData.bookingId}`);
            }}
          />
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <RealTimeAdaptation 
            tripData={trip}
            currentLocation={trip?.userSelection?.location}
            onItineraryUpdate={handleTripUpdate}
          />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ConversationalPlanner 
            currentTrip={trip}
            onTripUpdate={handleTripUpdate}
          />
        </TabsContent>

        <TabsContent value="multilingual" className="mt-6">
          <MultilingualSupport 
            currentLanguage="en"
            onLanguageChange={(lang) => {
              console.log('Language changed to:', lang);
              toast.success(`Language changed to ${lang}`);
            }}
          />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherAdaptive 
            destination={trip?.userSelection?.location?.label}
            itinerary={trip?.tripData}
            onItineraryUpdate={handleTripUpdate}
          />
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <TripStoryGenerator tripData={trip} />
        </TabsContent>

        <TabsContent value="share" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Share Your Amazing Trip</h3>
              <p className="text-gray-600 mb-6">
                Let others discover this incredible destination through your experience
              </p>
            </div>

            {/* Shareable Trip Card Preview */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold">
                    {trip?.userSelection?.location?.label || 'Amazing Destination'}
                  </h4>
                  <p className="opacity-90">
                    {trip?.userSelection?.noofDays} days • {trip?.userSelection?.traveler}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl">✈️</div>
                  <p className="text-sm opacity-75">WanderMind</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="opacity-75">Budget</p>
                  <p className="font-semibold">{trip?.userSelection?.budget || 'Moderate'}</p>
                </div>
                <div>
                  <p className="opacity-75">Trip Style</p>
                  <p className="font-semibold">AI-Optimized</p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-16 flex flex-col items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>Share Link</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
                📱
                <span>QR Code</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className='mt-10'>
        <Footer />
      </div>
    </div>
  );
}

export default Viewtrip;
