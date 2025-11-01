import React, { useState, useEffect } from "react";
import GooglePlacesWrapper from "@/components/custom/GooglePlacesWrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
  TravelPersonas,
  TravelThemes,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/custom/Footer";
import TravelPersonaSelector from "@/components/custom/TravelPersonaSelector";
import BudgetPredictor from "@/components/custom/BudgetPredictor";
import InspireMe from "@/components/custom/InspireMe";
import GroupTravelMode from "@/components/custom/GroupTravelMode";
import RealTimeAdaptation from "@/components/custom/RealTimeAdaptation";
import MultilingualSupport from "@/components/custom/MultilingualSupport";
import WeatherAdaptive from "@/components/custom/WeatherAdaptive";
import OfflineMode from "@/components/custom/OfflineMode";
import TripStoryGenerator from "@/components/custom/TripStoryGenerator";
import EcoScoreIndicator from "@/components/custom/EcoScoreIndicator";
import BookingSystem from "@/components/custom/BookingSystem";
import { Sparkles, Calculator, Camera, Users, MapPin, Calendar, Zap, Globe, Settings, Cloud, Wifi, BookOpen, Leaf, CreditCard } from "lucide-react";

const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Helper function to parse AI response and extract JSON
const parseAIResponse = (responseText) => {
  try {
    // First, try to parse as-is
    return JSON.parse(responseText);
  } catch (error) {
    console.log("Direct JSON parse failed, attempting to extract JSON from response...");

    // Try to extract JSON from markdown code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.log("JSON extraction from markdown failed:", e);
      }
    }

    // Try to find JSON object in the text
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.log("JSON extraction from text failed:", e);
      }
    }

    // If all else fails, throw the original error
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
};

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [predictedBudget, setPredictedBudget] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const validTabs = ['inspire', 'persona', 'basic', 'group', 'budget', 'realtime', 'multilingual', 'advanced'];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handlePersonaSelect = (persona, themes) => {
    setSelectedPersona(persona);
    setSelectedThemes(themes);
    setFormData(prev => ({
      ...prev,
      persona: persona,
      themes: themes
    }));
  };

  const handleBudgetSelect = (type, amount) => {
    setPredictedBudget({ type, amount });
    setFormData(prev => ({
      ...prev,
      budget: type,
      budgetAmount: amount
    }));
    toast.success(`Budget set to ${type}: ₹${amount.toLocaleString()}`);
  };

  const handleDestinationFromInspire = (destination) => {
    setPlace(destination);
    setFormData(prev => ({
      ...prev,
      location: destination
    }));
    setActiveTab("basic");
  };

  const handleGroupPreferences = (groupPreferences) => {
    setGroupData(groupPreferences);
    setFormData(prev => ({
      ...prev,
      groupData: groupPreferences,
      traveler: `${groupPreferences.groupSize} People (Group)`
    }));
    toast.success('Group preferences saved!');
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      console.log(tokenInfo);
      GetUserProfile(tokenInfo);
    },
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      toast("Please login to generate trip");
    }

    const missingFields = [];
    if (!formData?.location) missingFields.push("destination");
    if (!formData?.noofDays) missingFields.push("number of days");
    if (!formData?.budget) missingFields.push("budget");
    if (!formData?.traveler) missingFields.push("traveler type");

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    const personaKeywords = selectedPersona?.keywords || '';
    const themeNames = selectedThemes.map(id =>
      TravelThemes.find(t => t.id === id)?.name
    ).filter(Boolean).join(', ');

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noofDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{persona}", selectedPersona?.title || 'General Traveler')
      .replace("{personaKeywords}", personaKeywords)
      .replace("{themes}", themeNames || 'General sightseeing');

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result?.response?.text();
      console.log("Raw AI response:", responseText);

      // Clean and parse JSON response
      const tripData = parseAIResponse(responseText);

      const docId = Date.now().toString();
      await SaveAiTrip(JSON.stringify(tripData), docId);
      
      if (isDemoMode) {
        toast.success("Demo trip generated successfully! 🎉");
      } else {
        toast.success("Your personalized trip has been created! ✨");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      if (error.message.includes("429") || error.message.includes("Resource exhausted")) {
        setRateLimitHit(true);
        toast.success(
          "🎯 Switched to demo mode due to API limits. Your trip is being generated with sample data!"
        );
      } else if (error.message.includes("The model is overloaded")) {
        toast.error(
          "The model is currently overloaded. Please try again later."
        );
      } else if (error.message.includes("API key not valid")) {
        toast.error(
          "Google AI API key is invalid. Please check your environment configuration."
        );
      } else if (error.message.includes("not configured")) {
        toast.error(
          "AI service is not properly configured. Please contact support."
        );
      } else if (error.message.includes("Failed to parse JSON")) {
        toast.error(
          "The AI response format is invalid. Please try again."
        );
      } else {
        toast.error(
          "An error occurred while generating the trip. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData, docId) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
      });
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setLoading(false);
      navigate(`/view-trip/${docId}`);
    }
  };

  const isDemoMode = !import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY || import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY === 'AIzaSyDemoKey123456789';
  const [rateLimitHit, setRateLimitHit] = useState(false);

  return (
    <div className="container mx-auto max-w-7xl px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20 mt-10 pb-16">
      <div className="text-center mb-8">
        <h2 className="font-bold text-4xl text-gray-900 dark:text-white">
          Create Your Perfect Trip ✨
        </h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-lg">
          AI-powered travel planning with personalized recommendations
        </p>
        {(isDemoMode || rateLimitHit) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {rateLimitHit ? (
                <>⚡ <strong>Rate Limit Mode:</strong> API quota exceeded. Using demo mode with realistic sample data!</>
              ) : (
                <>🎯 <strong>Demo Mode:</strong> Experience our AI travel planner with sample data. All features are fully functional!</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Trip Planning Progress</h3>
          <span className="text-xs text-gray-500">
            {[formData?.location, formData?.noofDays, formData?.traveler, formData?.budget].filter(Boolean).length}/4 completed
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className={`flex items-center gap-1 ${formData?.location ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${formData?.location ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            Destination
          </div>
          <div className={`flex items-center gap-1 ${formData?.noofDays ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${formData?.noofDays ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            Duration
          </div>
          <div className={`flex items-center gap-1 ${formData?.traveler ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${formData?.traveler ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            Travelers
          </div>
          <div className={`flex items-center gap-1 ${formData?.budget ? 'text-green-600' : 'text-red-500 font-medium'}`}>
            <div className={`w-2 h-2 rounded-full ${formData?.budget ? 'bg-green-500' : 'bg-red-500'}`}></div>
            Budget {!formData?.budget && '(Required)'}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger
            value="inspire"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-100 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Camera className="w-3 h-3" />
            <span className="hidden sm:inline">Inspire</span>
          </TabsTrigger>
          <TabsTrigger
            value="persona"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Style</span>
          </TabsTrigger>
          <TabsTrigger
            value="basic"
            className="flex items-center gap-1 text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300"
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Details</span>
            {(!formData?.location || !formData?.noofDays || !formData?.traveler) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Group</span>
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="flex items-center gap-1 text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300"
          >
            <Calculator className="w-3 h-3" />
            <span className="hidden sm:inline">Budget</span>
            {!formData?.budget && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="realtime"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger
            value="multilingual"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="flex items-center justify-center gap-1 text-xs h-9 rounded-md text-gray-200 bg-gray-900 dark:text-gray-300 data-[state=active]:bg-white data-[state=active]:text-[#2196f3] dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">More</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspire" className="mt-6">
          <InspireMe onDestinationSelect={handleDestinationFromInspire} />
        </TabsContent>

        <TabsContent value="persona" className="mt-6">
          <TravelPersonaSelector
            onPersonaSelect={handlePersonaSelect}
            selectedPersona={selectedPersona}
            selectedThemes={selectedThemes}
          />
        </TabsContent>

        <TabsContent value="basic" className="mt-6 space-y-6">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl my-3 font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <MapPin className="w-5 h-5 text-red-500" />
                What is your destination of choice?
              </h2>
              <GooglePlacesWrapper
                apiKey={apiKey}
                selectProps={{
                  placeholder: "Search for places...",
                  value: place,
                  onChange: (v) => {
                    setPlace(v);
                    handleInputChange("location", v);
                  },
                }}
              />
            </div>

            <div>
              <h2 className="text-xl my-3 font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5 text-blue-500" />
                How many days are you planning your trip?
              </h2>
              <Input
                placeholder="Number of days..."
                type="number"
                min="1"
                max="30"
                onChange={(e) => handleInputChange("noofDays", e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-xl my-3 font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Users className="w-5 h-5 text-green-500" />
                Who do you plan on travelling with?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {SelectTravelsList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer transition-all bg-white dark:bg-gray-800
                    ${formData?.traveler === item.people
                        ? "shadow-lg border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:border-gray-300 dark:hover:border-gray-600 border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <h2 className="text-3xl text-center">{item.icon}</h2>
                    <h2 className="font-bold text-lg text-center text-gray-900 dark:text-gray-100">{item.title}</h2>
                    <h2 className="text-sm text-gray-600 dark:text-gray-400 text-center">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="group" className="mt-6">
          <GroupTravelMode onGroupPreferencesUpdate={handleGroupPreferences} />
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          {formData?.location && formData?.noofDays && formData?.traveler ? (
            <BudgetPredictor
              destination={formData.location.label}
              days={formData.noofDays}
              travelers={formData.traveler}
              onBudgetSelect={handleBudgetSelect}
            />
          ) : (
            <div className="text-center py-8">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Complete Trip Details First
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please fill in your destination, duration, and traveler details to get budget predictions
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Real-Time Adaptation Demo
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Experience how our AI adapts your itinerary based on live conditions like weather, traffic, and events.
              </p>
            </div>
            <RealTimeAdaptation
              tripData={formData}
              currentLocation={formData?.location}
              onItineraryUpdate={(update) => {
                console.log('Real-time update:', update);
                toast.success('Itinerary updated based on real-time conditions!');
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="multilingual" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                Multilingual Support Demo
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Experience voice assistance and travel planning in 12+ Indian languages with cultural insights.
              </p>
            </div>
            <MultilingualSupport
              currentLanguage="en"
              onLanguageChange={(lang) => {
                console.log('Language changed to:', lang);
                toast.success(`Language changed to ${lang}`);
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Explore additional features that make your travel planning experience exceptional.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weather Adaptation */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 hover:border-[#2196f3] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weather Adaptation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Real-time weather monitoring and recommendations</p>
                  </div>
                </div>
                <WeatherAdaptive
                  destination={formData?.location?.label || "Delhi"}
                  itinerary={formData}
                  onItineraryUpdate={(update) => {
                    console.log('Weather update:', update);
                    toast.success('Weather-based recommendations applied!');
                  }}
                />
              </div>

              {/* Booking System */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 hover:border-[#2196f3] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">One-Click Booking</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Seamless EaseMyTrip integration</p>
                  </div>
                </div>
                <BookingSystem
                  tripData={formData}
                  onBookingComplete={(bookingData) => {
                    console.log('Booking completed:', bookingData);
                    toast.success(`Booking confirmed! ID: ${bookingData.bookingId}`);
                  }}
                />
              </div>

              {/* Eco Score */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 hover:border-[#2196f3] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Eco-Friendly Travel</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sustainability scoring and green alternatives</p>
                  </div>
                </div>
                <EcoScoreIndicator
                  tripData={formData}
                  ecoScore={7.5}
                />
              </div>

              {/* Trip Story Generator */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 hover:border-[#2196f3] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trip Story Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-generated shareable travel stories</p>
                  </div>
                </div>
                <TripStoryGenerator tripData={formData} />
              </div>

              {/* Offline Mode */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 hover:border-[#2196f3] transition-colors col-span-full">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi className="w-8 h-8 text-gray-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Offline Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Access your itinerary without internet connection</p>
                  </div>
                </div>
                <OfflineMode tripData={formData} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate Trip Button */}
      <div className="my-10 flex justify-center">
        <Button
          disabled={loading || !formData?.location || !formData?.noofDays || !formData?.traveler}
          onClick={OnGenerateTrip}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin text-xl mr-2" />
              {isDemoMode ? 'Generating Demo Trip...' : 'Generating Your Perfect Trip...'}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {isDemoMode ? 'Generate Demo Trip' : 'Generate AI-Powered Trip'}
            </>
          )}
        </Button>
      </div>

      {/* Trip Summary */}
      {(formData?.location || selectedPersona || predictedBudget) && (
        <div className="mb-8 p-6 rounded-lg bg-card text-card-foreground border border-border shadow-sm transition-colors">
          <h3 className="font-semibold text-lg mb-4">Trip Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {formData?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Destination: {formData.location.label}</span>
              </div>
            )}
            {formData?.noofDays && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Duration: {formData.noofDays} days</span>
              </div>
            )}
            {formData?.traveler && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span>Travelers: {formData.traveler}</span>
              </div>
            )}
            {selectedPersona && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Style: {selectedPersona.title}</span>
              </div>
            )}
            {predictedBudget && (
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-orange-500" />
                <span>Budget: ₹{predictedBudget.amount?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src="./public/logo.svg"
                  alt="logo"
                  style={{ height: "40px", width: "50px" }}
                />
                <h2
                  style={{
                    fontWeight: "bold",
                    color: "#f56551",
                    fontSize: "25px",
                  }}
                >
                  Wander<span className="text-[#000000]">Mind</span>
                </h2>
              </div>
              <h2 className="font-bold text-lg mt-5">Sign In With Google</h2>
              <p>Sign in to the App with the Google authentication sexure.</p>
              <Button
                onClick={login}
                className="mt-5 w-full flex gap-4 items-center"
              >
                <FcGoogle style={{ height: "35px", width: "25px" }} />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default CreateTrip;
