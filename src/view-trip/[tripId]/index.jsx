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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const tripCardRef = useRef(null);
  const pdfContentRef = useRef(null);

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
        console.log("Location structure:", docSnap.data()?.userSelection?.location);
        console.log("Trip data for budget:", docSnap.data()?.tripData);
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

      // Detect currency from prices
      const firstHotelPrice = trip?.tripData?.hotels?.[0]?.price || '';
      if (firstHotelPrice.includes('$')) totalBudget.currency = '$';
      else if (firstHotelPrice.includes('€')) totalBudget.currency = '€';
      else if (firstHotelPrice.includes('£')) totalBudget.currency = '£';

      // If no prices found, estimate based on budget range and days
      if (totalBudget.total === 0 && trip?.userSelection) {
        totalBudget.isEstimated = true;
        const days = parseInt(trip.userSelection.noofDays) || 1;
        const travelers = trip.userSelection.traveler || '1';
        const numTravelers = parseInt(travelers.match(/\d+/)?.[0]) || 1;
        
        let dailyBudget = 3000; // Default moderate
        
        if (trip.userSelection.budget) {
          const budgetLower = trip.userSelection.budget.toLowerCase();
          if (budgetLower.includes('cheap') || budgetLower.includes('budget')) {
            dailyBudget = 2000;
          } else if (budgetLower.includes('luxury') || budgetLower.includes('expensive')) {
            dailyBudget = 8000;
          } else {
            dailyBudget = 4000; // moderate
          }
        }
        
        totalBudget.hotelCost = dailyBudget * 0.4 * days * numTravelers;
        totalBudget.activityCost = dailyBudget * 0.3 * days * numTravelers;
        totalBudget.total = dailyBudget * days * numTravelers;
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
            <div ref={tripCardRef} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
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
              <Button 
                className="h-16 flex flex-col items-center gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center gap-2"
                onClick={handleShareLink}
              >
                <Share2 className="w-5 h-5" />
                <span>Share Link</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center gap-2"
                onClick={handleShowQRCode}
              >
                📱
                <span>QR Code</span>
              </Button>
            </div>

            {/* QR Code Display */}
            {showQRCode && (
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Scan to View Trip</h4>
                <div className="bg-white p-4 rounded-lg">
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

      <div className='mt-10'>
        <Footer />
      </div>

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
    </div>
  );
}

export default Viewtrip;
