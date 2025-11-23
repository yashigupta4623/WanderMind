import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Infosection from '../components/Infosection';
import LocalInsights from '../components/LocalInsights';
import LocalInsightsPopup from '../components/LocalInsightsPopup';
import RealTimeUpdates from '../components/RealTimeUpdates';
import TripStory from '../components/TripStory';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Transport from '../components/Transport';
import Flights from '../components/Flights';
import SafetySummary from '../components/SafetySummary';

import ConversationalPlanner from '@/components/custom/ConversationalPlanner';
import EcoScoreIndicator from '@/components/custom/EcoScoreIndicator';
import TripStoryGenerator from '@/components/custom/TripStoryGenerator';
import WeatherAdaptive from '@/components/custom/WeatherAdaptive';
import OfflineMode from '@/components/custom/OfflineMode';
import BookingSystem from '@/components/custom/BookingSystem';
import RealTimeAdaptation from '@/components/custom/RealTimeAdaptation';
import MultilingualSupport from '@/components/custom/MultilingualSupport';
import AICopilotAlert from '@/components/custom/AICopilotAlert';
import MultilingualTripDisplay from '@/components/custom/MultilingualTripDisplay';
import GroupPlanningCollaboration from '@/components/custom/GroupPlanningCollaboration';
import SmartMapsUI from '@/components/custom/SmartMapsUI';
import SustainabilityCostControl from '@/components/custom/SustainabilityCostControl';
import { MapPin, MessageCircle, Leaf, BookOpen, Share2, Download, Cloud, Wifi, CreditCard, Zap, Globe, Bot, Users, Map, DollarSign, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showInsightsPopup, setShowInsightsPopup] = useState(true);
  const tripCardRef = useRef(null);
  const pdfContentRef = useRef(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }

    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log("Location structure:", docSnap.data()?.userSelection?.location);
        console.log("Trip data for budget:", docSnap.data()?.tripData);
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
        // Create fallback trip data for demo purposes
        const fallbackTrip = {
          userSelection: {
            location: { label: 'Sample Destination' },
            noofDays: '3',
            traveler: '2 People',
            budget: 'moderate',
            budgetAmount: 50000
          },
          tripData: {
            hotels: [],
            itinerary: {}
          }
        };
        setTrip(fallbackTrip);
        toast.error('Trip not found. Showing demo data.');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      // Create fallback trip data
      const fallbackTrip = {
        userSelection: {
          location: { label: 'Sample Destination' },
          noofDays: '3',
          traveler: '2 People',
          budget: 'moderate',
          budgetAmount: 50000
        },
        tripData: {
          hotels: [],
          itinerary: {}
        }
      };
      setTrip(fallbackTrip);
      toast.error('Error loading trip data. Showing demo data.');
    }
  };

  // Function to calculate total estimated budget
  const calculateTotalBudget = () => {
    let totalBudget = {
      hotelCost: 0,
      activityCost: 0,
      total: 0,
      currency: '₹',
      isEstimated: false
    };

    try {
      // Calculate hotel costs
      if (trip?.tripData?.hotels && Array.isArray(trip.tripData.hotels)) {
        trip.tripData.hotels.forEach(hotel => {
          if (hotel.price) {
            // Extract number from price string (e.g., "₹5000-7000", "$100-150")
            const priceMatch = hotel.price.match(/[\d,]+/g);
            if (priceMatch) {
              const prices = priceMatch.map(p => parseInt(p.replace(/,/g, '')));
              const avgPrice = prices.length > 1 ?
                (prices[0] + prices[1]) / 2 :
                prices[0];
              totalBudget.hotelCost += avgPrice;
            }
          }
        });
      }

      // Calculate activity/place costs
      if (trip?.tripData?.itinerary) {
        Object.values(trip.tripData.itinerary).forEach(day => {
          if (day.plan && Array.isArray(day.plan)) {
            day.plan.forEach(place => {
              if (place.ticketPricing) {
                const priceMatch = place.ticketPricing.match(/[\d,]+/g);
                if (priceMatch) {
                  const prices = priceMatch.map(p => parseInt(p.replace(/,/g, '')));
                  const avgPrice = prices.length > 1 ?
                    (prices[0] + prices[1]) / 2 :
                    prices[0];
                  totalBudget.activityCost += avgPrice;
                }
              }
            });
          }
        });
      }

      // Multiply hotel cost by number of days if needed
      if (trip?.userSelection?.noofDays && totalBudget.hotelCost > 0) {
        totalBudget.hotelCost = totalBudget.hotelCost * trip.userSelection.noofDays;
      }

      totalBudget.total = totalBudget.hotelCost + totalBudget.activityCost;

      // Always use INR currency
      totalBudget.currency = '₹';

      // If no prices found, estimate based on budget range and days
      if (totalBudget.total === 0 && trip?.userSelection) {
        totalBudget.isEstimated = true;
        const days = parseInt(trip.userSelection.noofDays) || 3;
        const travelers = trip.userSelection.traveler || '2 People';
        const numTravelers = parseInt(travelers.match(/\d+/)?.[0]) || 2;

        // Use actual budget amount if available
        let dailyBudget = 4000; // Default moderate

        if (trip.userSelection.budgetAmount && trip.userSelection.budgetAmount > 0) {
          dailyBudget = trip.userSelection.budgetAmount / days / numTravelers;
        } else if (trip.userSelection.budget) {
          const budgetLower = trip.userSelection.budget.toLowerCase();
          if (budgetLower.includes('cheap') || budgetLower.includes('budget')) {
            dailyBudget = 2500;
          } else if (budgetLower.includes('luxury') || budgetLower.includes('expensive')) {
            dailyBudget = 8000;
          } else {
            dailyBudget = 4500; // moderate
          }
        }

        totalBudget.hotelCost = Math.round(dailyBudget * 0.4 * days * numTravelers);
        totalBudget.activityCost = Math.round(dailyBudget * 0.3 * days * numTravelers);
        totalBudget.total = Math.round(dailyBudget * days * numTravelers);
      }

      console.log('Calculated Budget:', totalBudget);

    } catch (error) {
      console.error('Error calculating budget:', error);
    }

    return totalBudget;
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

  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating comprehensive PDF...');

      const element = pdfContentRef.current;
      if (!element) {
        toast.error('Unable to generate PDF');
        return;
      }

      // Capture the complete trip content as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `WanderMind_${trip?.userSelection?.location?.label?.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
      pdf.save(fileName);

      toast.dismiss();
      toast.success('Complete trip PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  // Function to generate and share trip link
  const handleShareLink = async () => {
    setShowShareDialog(true);
  };

  // Function to copy link to clipboard
  const copyToClipboard = async () => {
    try {
      const shareUrl = `${window.location.origin}/view-trip/${tripId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying:', error);
      toast.error('Failed to copy link');
    }
  };

  // Function to toggle QR code display
  const handleShowQRCode = () => {
    setShowQRCode(!showQRCode);
    if (!showQRCode) {
      toast.success('QR Code generated!');
    }
  };

  // Function to download QR code
  const handleDownloadQRCode = () => {
    const svg = document.getElementById('trip-qr-code');
    if (svg) {
      // Convert SVG to canvas then to image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const data = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = `WanderMind_Trip_QR_${Date.now()}.png`;
        link.href = pngUrl;
        link.click();

        URL.revokeObjectURL(url);
        toast.success('QR Code downloaded!');
      };
      img.src = url;
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  // Simple translations for tab labels
  const getTabLabel = (key) => {
    const translations = {
      en: {
        overview: 'Overview',
        insights: 'Local Insights',
        realtime: 'Live Updates',
        story: 'Story',
        maps: 'Maps',
        sustainability: 'Eco',
        group: 'Group',
        copilot: 'AI Copilot',
        booking: 'Book',
        share: 'Share'
      },
      hi: {
        overview: 'अवलोकन',
        insights: 'स्थानीय जानकारी',
        realtime: 'लाइव अपडेट',
        story: 'कहानी',
        maps: 'नक्शे',
        sustainability: 'पर्यावरण',
        group: 'समूह',
        copilot: 'AI सहायक',
        booking: 'बुक करें',
        share: 'साझा करें'
      }
    };
    
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  return (
    <div className='p-4 sm:p-6 md:px-10 lg:px-20 xl:px-44 2xl:px-56'>
      {/* Trip Header with Quick Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                toast.success(`Language changed to ${languages.find(l => l.code === e.target.value)?.name}`);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Infosection trip={trip} />

      </div>

      {/* Clean Trip View with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-12 items-center justify-between rounded-lg !bg-white dark:!bg-gray-800 p-1 w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
          <TabsTrigger
            value="overview"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {getTabLabel('overview')}
          </TabsTrigger>

          <TabsTrigger
            value="realtime"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-orange-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Zap className="w-3 h-3 mr-1" />
            Live
          </TabsTrigger>
          <TabsTrigger
            value="maps"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-green-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Map className="w-3 h-3 mr-1" />
            Maps
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-pink-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Story
          </TabsTrigger>
          <TabsTrigger
            value="sustainability"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-emerald-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Leaf className="w-3 h-3 mr-1" />
            Eco
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-purple-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Users className="w-3 h-3 mr-1" />
            Group
          </TabsTrigger>
          <TabsTrigger
            value="copilot"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-indigo-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Bot className="w-3 h-3 mr-1" />
            Copilot
          </TabsTrigger>
          <TabsTrigger
            value="booking"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-orange-600 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Book
          </TabsTrigger>
          <TabsTrigger
            value="share"
            className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-gray-900 data-[state=active]:!text-white data-[state=active]:shadow-sm transition-all"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Hotels trip={trip} />
            <Transport trip={trip} />
            <Flights trip={trip} />
            <PlacesToVisit trip={trip} />
            
            {/* Farewell Message */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl">✈️</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Happy Journey!
                </h3>
                <span className="text-3xl">🌟</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-2">
                Wishing you an amazing adventure filled with wonderful memories!
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Take care and travel safe! 🧳💙
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <LocalInsights trip={trip} />
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <RealTimeUpdates trip={trip} />
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <TripStory trip={trip} />
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

        <TabsContent value="safety" className="mt-6">
          <SafetySummary trip={trip} />
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <RealTimeAdaptation
            tripData={trip}
            currentLocation={trip?.userSelection?.location}
            onItineraryUpdate={handleTripUpdate}
          />
        </TabsContent>

        <TabsContent value="copilot" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Bot className="w-6 h-6 text-purple-600" />
                AI Copilot - Real-Time Adaptive Assistant
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Your intelligent travel companion that monitors conditions and suggests real-time adjustments
              </p>
            </div>
            <AICopilotAlert
              tripData={trip}
              onReplan={(updatedTrip) => {
                setTrip(updatedTrip);
                toast.success('Trip updated by AI Copilot!');
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ConversationalPlanner
            currentTrip={trip}
            onTripUpdate={handleTripUpdate}
          />
        </TabsContent>

        <TabsContent value="maps" className="mt-6">
          <SmartMapsUI
            tripData={trip}
            tripId={tripId}
          />
        </TabsContent>

        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityCostControl
            tripData={trip}
            onBudgetUpdate={(updates) => {
              setTrip(prev => ({
                ...prev,
                userSelection: {
                  ...prev.userSelection,
                  ...updates
                }
              }));
              toast.success('Trip updated with new preferences!');
            }}
          />
        </TabsContent>

        <TabsContent value="group" className="mt-6">
          <GroupPlanningCollaboration
            tripData={trip}
            tripId={tripId}
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
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Share Your Amazing Trip
                </h3>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Let others discover this incredible destination through your experience.
                Create lasting memories and inspire fellow travelers!
              </p>
            </div>

            {/* Helper function for budget display */}
            {(() => {
              const formatShareBudget = (trip) => {
                const budgetAmount = trip?.userSelection?.budgetAmount;

                if (budgetAmount && budgetAmount > 0) {
                  return `₹${parseInt(budgetAmount).toLocaleString()}`;
                }

                // Generate realistic amount based on budget type
                const budget = trip?.userSelection?.budget;
                const days = parseInt(trip?.userSelection?.noofDays) || 3;
                const travelers = trip?.userSelection?.traveler || '1 Person';
                const peopleCount = travelers.includes('2') ? 2 :
                  travelers.includes('3') ? 3 :
                    travelers.includes('4') ? 4 :
                      travelers.includes('Group') ? 4 : 1;

                let estimatedAmount = 0;
                switch (budget) {
                  case 'budget':
                    estimatedAmount = days * peopleCount * 2500;
                    break;
                  case 'moderate':
                    estimatedAmount = days * peopleCount * 4500;
                    break;
                  case 'luxury':
                    estimatedAmount = days * peopleCount * 8000;
                    break;
                  default:
                    estimatedAmount = days * peopleCount * 4000;
                }

                return `₹${estimatedAmount.toLocaleString()}`;
              };

              window.formatShareBudget = formatShareBudget; // Make it available
              return null;
            })()}

            {/* Enhanced Shareable Trip Card Preview */}
            <div ref={tripCardRef} className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium uppercase tracking-wider opacity-90">
                        Travel Experience
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold leading-tight mb-2">
                      {trip?.userSelection?.location?.label || 'Amazing Destination'}
                    </h4>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        {trip?.userSelection?.noofDays} days
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👥</span>
                        {trip?.userSelection?.traveler}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl mb-1">✈️</div>
                    <div className="text-xs font-bold tracking-wider">
                      WANDER<span className="text-yellow-300">MIND</span>
                    </div>
                  </div>
                </div>

                {/* Trip Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💰</span>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-75">Budget</span>
                    </div>
                    <p className="font-bold text-lg capitalize">
                      {trip?.userSelection?.budget === 'budget' ? 'Budget Travel' :
                        trip?.userSelection?.budget === 'moderate' ? 'Comfortable' :
                          trip?.userSelection?.budget === 'luxury' ? 'Luxury' :
                            trip?.userSelection?.budget || 'Moderate'}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-75">Trip Style</span>
                    </div>
                    <p className="font-bold text-lg">AI-Optimized</p>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 opacity-75">
                      <span>🌟</span>
                      Personalized
                    </span>
                    <span className="flex items-center gap-1 opacity-75">
                      <span>🎯</span>
                      AI-Powered
                    </span>
                    <span className="flex items-center gap-1 opacity-75">
                      <span>⚡</span>
                      Smart Planning
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    Created {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Share Options */}
            <div className="grid md:grid-cols-3 gap-6">
              <Button
                className="h-20 flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleDownloadPDF}
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Download PDF</div>
                  <div className="text-xs opacity-90">Save offline copy</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-3 border-2 border-purple-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleShareLink}
              >
                <Share2 className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Share Link</div>
                  <div className="text-xs opacity-75">Copy shareable URL</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-3 border-2 border-pink-200 hover:border-pink-300 bg-white hover:bg-pink-50 text-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleShowQRCode}
              >
                <div className="text-2xl">📱</div>
                <div className="text-center">
                  <div className="font-semibold">QR Code</div>
                  <div className="text-xs opacity-75">Scan to view</div>
                </div>
              </Button>
            </div>

            {/* Enhanced QR Code Display */}
            {showQRCode && (
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 shadow-xl">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Scan to View Trip</h4>
                  <p className="text-sm text-gray-600">Share this QR code with friends and family</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-gray-100">
                  <QRCodeSVG
                    id="trip-qr-code"
                    value={`${window.location.origin}/view-trip/${tripId}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Scan this QR code to view the trip on any device
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleDownloadQRCode}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>



      {/* Hidden PDF Content - Complete Trip Details */}
      <div ref={pdfContentRef} style={{ position: 'absolute', left: '-9999px', width: '800px' }}>
        <div style={{ padding: '40px', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
              {trip?.userSelection?.location?.label || 'Your Amazing Trip'}
            </h1>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Generated by WanderMind AI Travel Planner • {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Trip Overview */}
          <div style={{ marginBottom: '30px', backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
              📋 Trip Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>📍 Destination</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {trip?.userSelection?.location?.label || 'N/A'}
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>📆 Duration</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {trip?.userSelection?.noofDays || 0} Days
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>👥 Number of Travelers</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {trip?.userSelection?.traveler || 'N/A'}
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>💰 Budget Range</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
                  {trip?.userSelection?.budget || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Total Estimated Budget */}
          {(() => {
            const budget = calculateTotalBudget();
            return (
              <div style={{ marginBottom: '30px', backgroundColor: '#dcfce7', padding: '20px', borderRadius: '8px', border: '2px solid #10b981' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#065f46', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  💵 {budget.isEstimated ? 'Estimated Budget Range' : 'Total Estimated Budget'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '13px', color: '#047857', marginBottom: '6px', fontWeight: '500' }}>🏨 Hotels</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#065f46' }}>
                      {budget.currency}{Math.round(budget.hotelCost).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                      For {trip?.userSelection?.noofDays || 0} nights
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '13px', color: '#047857', marginBottom: '6px', fontWeight: '500' }}>🎫 Activities & Food</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#065f46' }}>
                      {budget.currency}{Math.round(budget.activityCost).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                      Entry fees, tours & meals
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#10b981', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', color: '#ffffff', marginBottom: '6px', fontWeight: '500', opacity: '0.9' }}>💰 Total {budget.isEstimated ? 'Estimated' : ''}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
                      {budget.currency}{Math.round(budget.total).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#ffffff', marginTop: '4px', opacity: '0.8' }}>
                      {budget.isEstimated ? 'Based on budget range' : 'Approximate cost'}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: budget.isEstimated ? '#fef3c7' : '#e0e7ff', borderRadius: '6px', border: `1px solid ${budget.isEstimated ? '#fbbf24' : '#6366f1'}` }}>
                  <div style={{ fontSize: '12px', color: budget.isEstimated ? '#92400e' : '#3730a3', lineHeight: '1.6' }}>
                    <strong>Note:</strong> {budget.isEstimated ?
                      `This is an estimated budget based on your "${trip?.userSelection?.budget}" budget preference for ${trip?.userSelection?.noofDays} days. Actual costs may vary based on hotels, activities, food choices, and transportation.` :
                      `This budget is calculated from hotel prices and activity costs in your itinerary. Consider additional expenses like transportation (${budget.currency}${Math.round(budget.total * 0.15).toLocaleString()} approx) and shopping.`
                    }
                  </div>
                </div>
                {budget.isEstimated && (
                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e0e7ff', borderRadius: '6px', border: '1px solid #818cf8' }}>
                    <div style={{ fontSize: '11px', color: '#4338ca', lineHeight: '1.5' }}>
                      💡 <strong>Budget Breakdown:</strong> Hotels ~40% • Food & Activities ~30% • Transport ~15% • Shopping & Misc ~15%
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Additional Trip Information */}
          <div style={{ marginBottom: '30px', backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', border: '1px solid #fbbf24' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
              ℹ️ Trip Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>Trip ID</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', fontFamily: 'monospace' }}>
                  {trip?.id || tripId}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>Created By</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', wordBreak: 'break-all' }}>
                  {trip?.userEmail || 'WanderMind User'}
                </div>
              </div>
            </div>
            {trip?.userSelection?.location && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>Full Location Details</div>
                <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
                  {(() => {
                    const loc = trip.userSelection.location;
                    // Try to get the most detailed location information
                    if (loc.value?.description) return loc.value.description;
                    if (loc.value?.structured_formatting?.main_text && loc.value?.structured_formatting?.secondary_text) {
                      return `${loc.value.structured_formatting.main_text}, ${loc.value.structured_formatting.secondary_text}`;
                    }
                    if (loc.value?.structured_formatting?.main_text) return loc.value.structured_formatting.main_text;
                    if (loc.value?.place_id) return `Place ID: ${loc.value.place_id}`;
                    if (loc.label) return loc.label;
                    // If nothing else, show what we have
                    return JSON.stringify(loc.value || loc).substring(0, 200);
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Budget Breakdown if available */}
          {trip?.tripData?.budgetBreakdown && (
            <div style={{ marginBottom: '30px', backgroundColor: '#d1fae5', padding: '20px', borderRadius: '8px', border: '1px solid #10b981' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px' }}>
                💵 Estimated Budget Breakdown
              </h2>
              <div style={{ fontSize: '14px', color: '#047857' }}>
                {trip.tripData.budgetBreakdown}
              </div>
            </div>
          )}

          {/* Hotels Section */}
          {trip?.tripData?.hotels && trip.tripData.hotels.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
                🏨 Recommended Hotels
              </h2>
              {trip.tripData.hotels.map((hotel, index) => (
                <div key={index} style={{ marginBottom: '20px', padding: '18px', border: '2px solid #e5e7eb', borderRadius: '10px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {hotel.hotelName || hotel.name || `Hotel ${index + 1}`}
                    </h3>
                    {hotel.rating && (
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '12px' }}>
                        ⭐ {hotel.rating}
                      </div>
                    )}
                  </div>
                  {hotel.hotelAddress && (
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      📍 {hotel.hotelAddress}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    {hotel.price && (
                      <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>
                        💰 Price: {hotel.price}
                      </div>
                    )}
                    {hotel.geoCoordinates && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        🗺️ Coordinates: {hotel.geoCoordinates.lat}, {hotel.geoCoordinates.lng}
                      </div>
                    )}
                  </div>
                  {hotel.description && (
                    <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                      {hotel.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Itinerary Section */}
          {trip?.tripData?.itinerary && Object.keys(trip.tripData.itinerary).length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
                📅 Complete Day-by-Day Itinerary
              </h2>
              {Object.keys(trip.tripData.itinerary).map((dayKey, index) => {
                const day = trip.tripData.itinerary[dayKey];
                return (
                  <div key={index} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
                    <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '12px 16px', borderRadius: '8px 8px 0 0', marginBottom: '0' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>
                        📆 Day {index + 1}
                        {day.theme && <span style={{ fontSize: '14px', marginLeft: '10px', opacity: '0.9' }}>• {day.theme}</span>}
                      </h3>
                    </div>
                    <div style={{ border: '2px solid #3b82f6', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '16px' }}>
                      {day.plan && day.plan.length > 0 ? (
                        day.plan.map((place, placeIndex) => (
                          <div key={placeIndex} style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: placeIndex < day.plan.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                              <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: '0' }}>
                                {placeIndex + 1}
                              </div>
                              <div style={{ flex: '1' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', marginTop: '4px' }}>
                                  {place.placeName || place.name || `Location ${placeIndex + 1}`}
                                </h4>
                                {place.placeDetails && (
                                  <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px', lineHeight: '1.6' }}>
                                    {place.placeDetails}
                                  </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                                  {place.timeToTravel && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '4px' }}>
                                      ⏱️ Travel: {place.timeToTravel}
                                    </div>
                                  )}
                                  {place.ticketPricing && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '4px' }}>
                                      🎫 Ticket: {place.ticketPricing}
                                    </div>
                                  )}
                                  {place.timeToVisit && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '4px' }}>
                                      🕒 Best Time: {place.timeToVisit}
                                    </div>
                                  )}
                                  {place.rating && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '4px' }}>
                                      ⭐ Rating: {place.rating}
                                    </div>
                                  )}
                                </div>
                                {place.geoCoordinates && (
                                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
                                    📍 Coordinates: {place.geoCoordinates.lat}, {place.geoCoordinates.lng}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                          No activities planned for this day
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Travel Tips if available */}
          {trip?.tripData?.travelTips && (
            <div style={{ marginBottom: '30px', backgroundColor: '#e0e7ff', padding: '20px', borderRadius: '8px', border: '1px solid #6366f1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#3730a3', marginBottom: '12px' }}>
                💡 Travel Tips
              </h2>
              <div style={{ fontSize: '14px', color: '#4338ca', lineHeight: '1.8' }}>
                {trip.tripData.travelTips}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '3px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
              ✈️ Happy Traveling with WanderMind!
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
              Your AI-Powered Travel Companion
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
              Visit: {window.location.origin} | Trip ID: {trip?.id || tripId}
            </div>
            <div style={{ fontSize: '10px', color: '#d1d5db', marginTop: '8px' }}>
              Generated on {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Share Link Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Trip Link</DialogTitle>
            <DialogDescription>
              Copy this link and share it with your friends and family
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                value={`${window.location.origin}/view-trip/${tripId}`}
                readOnly
                className="h-10"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={copyToClipboard}
            >
              <span className="sr-only">Copy</span>
              Copy
            </Button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-sm text-gray-600">
              <strong>Destination:</strong> {trip?.userSelection?.location?.label}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Duration:</strong> {trip?.userSelection?.noofDays} days
            </p>
            <p className="text-sm text-gray-600">
              <strong>Budget:</strong> {trip?.userSelection?.budget}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto-rotating Local Insights Popup */}
      {showInsightsPopup && (
        <LocalInsightsPopup
          trip={trip}
          onClose={() => setShowInsightsPopup(false)}
        />
      )}
    </div>
  );
}

export default Viewtrip;
