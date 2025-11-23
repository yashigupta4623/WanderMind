import React, { useState, useEffect } from "react";
import GooglePlacesWrapper from "@/components/custom/GooglePlacesWrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AI_ITINERARY_PROMPT,
  AI_HOTEL_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
  TravelPersonas,
  TravelThemes,
} from "@/constants/options";
import LoadingModal from "@/components/custom/LoadingModal";
import { query, collection, where, getDocs } from "firebase/firestore";
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
import TravelPersonaSelector from "@/components/custom/TravelPersonaSelector";
import BudgetPredictor from "@/components/custom/BudgetPredictor";
import BudgetValidator from "@/components/custom/BudgetValidator";
import TravelConstraints from "@/components/custom/TravelConstraints";
import PreferenceLearningIndicator from "@/components/custom/PreferenceLearningIndicator";
import LastMinuteQuickPlan from "@/components/custom/LastMinuteQuickPlan";
import VoiceFirstPlanner from "@/components/custom/VoiceFirstPlanner";
import InspireMe from "@/components/custom/InspireMe";
import { preferenceLearning } from "@/service/PreferenceLearningService";
import GroupTravelMode from "@/components/custom/GroupTravelMode";
import RealTimeAdaptation from "@/components/custom/RealTimeAdaptation";
import MultilingualSupport from "@/components/custom/MultilingualSupport";
import WeatherAdaptive from "@/components/custom/WeatherAdaptive";
import OfflineMode from "@/components/custom/OfflineMode";
import TripStoryGenerator from "@/components/custom/TripStoryGenerator";
import EcoScoreIndicator from "@/components/custom/EcoScoreIndicator";
import BookingSystem from "@/components/custom/BookingSystem";
import SafetyAccessibilityFilters from "@/components/custom/SafetyAccessibilityFilters";
import { safetyAccessibilityService } from "@/service/SafetyAccessibilityService";
import { Sparkles, Calculator, Camera, Users, MapPin, Calendar, Zap, Globe, Settings, Cloud, Wifi, BookOpen, Leaf, CreditCard, Shield } from "lucide-react";

const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Helper function to repair common JSON issues
const repairJSON = (jsonString) => {
  let repaired = jsonString
    // Remove trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Fix unescaped quotes in strings (basic attempt)
    .replace(/([^\\])"([^"]*[^\\])"([^,}\]\s])/g, '$1"$2\\"$3')
    // Fix unterminated strings at end of object/array
    .replace(/("[^"]*[^\\])([}\]])/g, '$1"$2')
    // Ensure proper string termination
    .replace(/("[^"]*[^\\])$/g, '$1"');

  return repaired;
};

// Helper function to parse AI response and extract JSON
const parseAIResponse = (responseText) => {
  try {
    // First, try to parse as-is
    return JSON.parse(responseText);
  } catch (error) {
    console.log("Direct JSON parse failed, attempting to extract JSON from response...");

    // Clean the response text first
    let cleanedText = responseText.trim();

    // Try to extract JSON from markdown code blocks
    const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        const repairedJson = repairJSON(jsonMatch[1].trim());
        return JSON.parse(repairedJson);
      } catch (e) {
        console.log("JSON extraction from markdown failed:", e);
      }
    }

    // Try to find JSON object in the text with better bracket matching
    const jsonStart = cleanedText.indexOf('{');
    if (jsonStart !== -1) {
      let bracketCount = 0;
      let jsonEnd = -1;
      let inString = false;
      let escapeNext = false;

      for (let i = jsonStart; i < cleanedText.length; i++) {
        const char = cleanedText[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === '{') {
            bracketCount++;
          } else if (char === '}') {
            bracketCount--;
            if (bracketCount === 0) {
              jsonEnd = i;
              break;
            }
          }
        }
      }

      if (jsonEnd !== -1) {
        const jsonString = cleanedText.substring(jsonStart, jsonEnd + 1);
        try {
          const repairedJson = repairJSON(jsonString);
          return JSON.parse(repairedJson);
        } catch (e) {
          console.log("JSON extraction from text failed:", e);
          console.log("Attempted to parse:", jsonString.substring(0, 200) + "...");

          // Last resort: try to truncate at the last valid JSON structure
          try {
            const lastValidBrace = jsonString.lastIndexOf('}', jsonString.length - 50);
            if (lastValidBrace > 100) {
              const truncatedJson = jsonString.substring(0, lastValidBrace + 1);
              const repairedTruncated = repairJSON(truncatedJson);
              console.log("Attempting truncated JSON parse...");
              return JSON.parse(repairedTruncated);
            }
          } catch (truncateError) {
            console.log("Truncated JSON parse also failed:", truncateError);
          }
        }
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
  const [travelConstraints, setTravelConstraints] = useState(null);
  const [safetyFilters, setSafetyFilters] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to format budget display
  const formatBudget = (budget) => {
    const budgetMap = {
      'budget': 'Budget Travel',
      'moderate': 'Comfortable',
      'luxury': 'Luxury',
      'custom': 'Custom Budget'
    };
    return budgetMap[budget] || budget || 'Budget Travel';
  };

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const validTabs = ['inspire', 'persona', 'basic', 'group', 'realtime', 'multilingual', 'advanced'];
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

    const budgetNames = {
      budget: 'Budget Travel',
      moderate: 'Comfortable',
      luxury: 'Luxury',
      custom: 'Custom Budget'
    };

    toast.success(`✅ ${budgetNames[type] || type} selected: ₹${amount.toLocaleString()}`);

    // Auto-navigate to next step if all required fields are filled
    if (formData?.location && formData?.noofDays && formData?.traveler) {
      setTimeout(() => {
        toast.info('All details completed! Ready to generate your trip 🚀');
      }, 1000);
    }
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

  const checkCache = async (formData) => {
    try {
      const q = query(
        collection(db, "AITrips"),
        where("userSelection.location.label", "==", formData.location.label),
        where("userSelection.noofDays", "==", formData.noofDays),
        where("userSelection.budget", "==", formData.budget),
        where("userSelection.traveler", "==", formData.traveler)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("Cache hit! Using existing trip data.");
        return querySnapshot.docs[0].data();
      }
    } catch (error) {
      console.error("Cache check failed:", error);
    }
    return null;
  };

  // Retry helper with exponential backoff
  const retryWithBackoff = async (fn, maxRetries = 2, baseDelay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;

        // Don't retry API key errors or validation errors
        if (error.message.includes("API key") || error.message.includes("not configured")) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      toast("Please login to generate trip");
      return;
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
    setError(null);

    try {
      // 1. Check Cache
      const cachedTrip = await checkCache(formData);
      if (cachedTrip) {
        toast.success("Found a perfect match from our community trips! 🚀");
        const docId = Date.now().toString();
        await SaveAiTrip(cachedTrip.tripData, docId);
        return;
      }

      // 2. Prepare Prompts
      const userEmail = JSON.parse(user)?.email;
      const learnedPrefs = await preferenceLearning.getLearnedPreferences(userEmail);
      const preferencePrompt = preferenceLearning.generatePreferencePrompt(learnedPrefs?.insights);

      const themeNames = selectedThemes.map(id =>
        TravelThemes.find(t => t.id === id)?.name
      ).filter(Boolean).join(', ');

      // Generate safety prompt if safety filters are enabled
      const safetyPrompt = safetyFilters ? safetyAccessibilityService.generateSafetyPrompt(safetyFilters) : '';

      const itineraryPrompt = AI_ITINERARY_PROMPT
        .replace("{location}", formData?.location?.label)
        .replace("{totalDays}", formData?.noofDays)
        .replace("{traveler}", formData?.traveler)
        .replace("{budget}", formData?.budget)
        .replace("{persona}", selectedPersona?.title || 'General Traveler')
        .replace("{themes}", themeNames || 'General sightseeing')
        .replace("{userPreferences}", preferencePrompt || 'None')
        .concat(safetyPrompt);

      const hotelPrompt = AI_HOTEL_PROMPT
        .replace("{location}", formData?.location?.label)
        .replace("{totalDays}", formData?.noofDays)
        .replace("{traveler}", formData?.traveler)
        .replace("{budget}", formData?.budget)
        .replace("{persona}", selectedPersona?.title || 'General Traveler')
        .concat(safetyPrompt);

      // 3. Parallel Execution with Retry Logic
      console.log("Generating trip with parallel requests...");
      const [itineraryResult, hotelResult] = await retryWithBackoff(async () => {
        return await Promise.all([
          chatSession.sendMessage(itineraryPrompt),
          chatSession.sendMessage(hotelPrompt)
        ]);
      });

      const itineraryText = itineraryResult?.response?.text();
      const hotelText = hotelResult?.response?.text();

      if (!itineraryText || !hotelText) {
        throw new Error("Incomplete response from AI service");
      }

      const itineraryJson = parseAIResponse(itineraryText);
      const hotelJson = parseAIResponse(hotelText);

      // 4. Merge Results
      const finalTripData = {
        tripDetails: {
          destination: formData?.location?.label,
          duration: `${formData?.noofDays} days`,
          travelers: formData?.traveler,
          budget: formData?.budget,
          totalBudget: formData?.budgetAmount || "Flexible"
        },
        hotels: hotelJson.hotels || [],
        itinerary: itineraryJson.itinerary || []
      };

      const docId = Date.now().toString();
      await SaveAiTrip(JSON.stringify(finalTripData), docId);
      toast.success("Your personalized trip has been created! ✨");

    } catch (error) {
      console.error("Error generating trip:", error);

      let errorMessage = "An error occurred while generating the trip. Please try again.";

      if (error.message.includes("timeout")) {
        errorMessage = "Trip generation is taking longer than expected. Please try again.";
      } else if (error.message.includes("429") || error.message.includes("Resource exhausted")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message.includes("API key") || error.message.includes("not configured")) {
        errorMessage = "System configuration error. Please contact support.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network and try again.";
      }

      setError(errorMessage);
    } finally {
      if (!error) {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    OnGenerateTrip();
  };

  const handleCloseModal = () => {
    setLoading(false);
    setError(null);
  };

  const SaveAiTrip = async (TripData, docId) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: {
          ...formData,
          safetyFilters: safetyFilters // Include safety filters in user selection
        },
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString(),
        safetyMode: safetyFilters ? 'enabled' : 'disabled'
      });
      // flux
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setLoading(false);
      navigate(`/view-trip/${docId}`);
    }
  };



  return (
    <div className="container mx-auto max-w-7xl px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20 mt-10 pb-16">
      <div className="text-center mb-8">
        <h2 className="font-bold text-4xl text-gray-900 dark:text-white">
          Create Your Perfect Trip ✨
        </h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-lg">
          AI-powered travel planning with personalized recommendations
        </p>

      </div>

      {/* Preference Learning Indicator */}
      <div className="mb-6">
        <PreferenceLearningIndicator
          userId={JSON.parse(localStorage.getItem("user") || '{}')?.email}
        />
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
            Budget {formData?.budgetAmount ? `(₹${parseInt(formData.budgetAmount).toLocaleString()})` : formData?.budget ? `(${formatBudget(formData.budget)})` : '(Required)'}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-12 items-center justify-between rounded-lg !bg-white dark:!bg-gray-800 p-1 w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
          <TabsTrigger value="basic" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-blue-600 data-[state=active]:!text-white transition-all relative">
            <MapPin className="w-4 h-4 mr-2" />
            Details
            {(!formData?.location || !formData?.noofDays || !formData?.traveler) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-pink-600 data-[state=active]:!text-white transition-all">
            <Shield className="w-4 h-4 mr-2" />
            Safety
          </TabsTrigger>
          <TabsTrigger value="quickplan" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-purple-600 data-[state=active]:!text-white transition-all">
            <Zap className="w-4 h-4 mr-2" />
            Quick
          </TabsTrigger>
          <TabsTrigger value="persona" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-indigo-600 data-[state=active]:!text-white transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Style
          </TabsTrigger>
          <TabsTrigger value="inspire" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-blue-600 data-[state=active]:!text-white transition-all">
            <Camera className="w-4 h-4 mr-2" />
            Inspire
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium !text-gray-900 dark:!text-gray-100 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 data-[state=active]:!bg-orange-600 data-[state=active]:!text-white transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                Bolkar Plan Banao 🇮🇳
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Apni bhasha mein boliye, AI samajh jayega! Voice-first planning for India.
              </p>
            </div>
            <VoiceFirstPlanner
              onPlanCreated={(parsed) => {
                console.log('Voice plan created:', parsed);
                // Auto-fill form with voice data
                if (parsed.destination) {
                  handleInputChange('location', { label: parsed.destination });
                  setPlace({ label: parsed.destination });
                }
                if (parsed.days) {
                  handleInputChange('noofDays', parsed.days.toString());
                }
                if (parsed.budget) {
                  handleInputChange('budget', parsed.budget);
                  // Also set budget amount for validation
                  const budgetAmounts = {
                    'budget': 15000,
                    'moderate': 35000,
                    'luxury': 75000
                  };
                  handleInputChange('budgetAmount', budgetAmounts[parsed.budget] || 25000);
                }
                if (parsed.traveler) {
                  handleInputChange('traveler', parsed.traveler);
                }
                if (parsed.preferences && parsed.preferences.length > 0) {
                  handleInputChange('themes', parsed.preferences);
                }
                toast.success('✅ Voice plan ready! All fields filled. You can generate trip now! 🎤');
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="quickplan" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Last-Minute Quick Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Just landed? Get an instant hyper-compressed plan in seconds!
              </p>
            </div>
            <LastMinuteQuickPlan
              onPlanGenerated={(plan) => {
                console.log('Quick plan generated:', plan);
                toast.success('Quick plan ready! Start exploring now! 🚀');
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="inspire" className="mt-6">
          <InspireMe onDestinationSelect={handleDestinationFromInspire} />
        </TabsContent>

        <TabsContent value="persona" className="mt-6">
          <TravelPersonaSelector
            onPersonaSelect={handlePersonaSelect}
            selectedPersona={selectedPersona}
            selectedThemes={selectedThemes}
            onDestinationSelect={(destination) => {
              // Auto-fill the destination
              handleInputChange('location', { label: destination });
              // Switch to Details tab
              setActiveTab('basic');
              // Show success message
              toast.success(`${destination} selected! Fill in the remaining details to generate your trip.`);
            }}
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

            {/* Budget Section Moved Here */}
            {formData?.location && formData?.noofDays && formData?.traveler && (
              <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xl my-3 font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calculator className="w-5 h-5 text-purple-500" />
                  What is your budget?
                </h2>
                <div className="space-y-6">
                  <BudgetPredictor
                    destination={formData.location.label}
                    days={formData.noofDays}
                    travelers={formData.traveler}
                    onBudgetSelect={handleBudgetSelect}
                  />

                  {formData?.budgetAmount && (
                    <BudgetValidator
                      destination={formData.location.label}
                      days={formData.noofDays}
                      travelers={formData.traveler}
                      budget={formData.budgetAmount}
                      onSuggestionAccept={(suggestion) => {
                        console.log('Accepted suggestion:', suggestion);
                        if (suggestion.type === 'days') {
                          handleInputChange('noofDays', suggestion.value.toString());
                          toast.success(`Trip duration adjusted to ${suggestion.value} days`);
                        } else if (suggestion.type === 'budget') {
                          handleBudgetSelect('custom', suggestion.value);
                          toast.success(`Budget increased to ₹${suggestion.value.toLocaleString()}`);
                        } else {
                          toast.success(`Great choice! ${suggestion.type} suggestion accepted`);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="group" className="mt-6">
          <GroupTravelMode onGroupPreferencesUpdate={handleGroupPreferences} />
        </TabsContent>

        <TabsContent value="safety" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Shield className="w-6 h-6 text-pink-500" />
                Safety & Accessibility
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                India-first filters for safe, accessible, and comfortable travel 🇮🇳
              </p>
            </div>
            <SafetyAccessibilityFilters
              onFiltersUpdate={(filters) => {
                setSafetyFilters(filters);
                setFormData(prev => ({
                  ...prev,
                  safetyFilters: filters
                }));
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="mt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Travel Constraints</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set rules that AI must follow when planning your trip
              </p>
            </div>
            <TravelConstraints onConstraintsUpdate={setTravelConstraints} />
          </div>
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
          disabled={loading || !formData?.location || !formData?.noofDays || !formData?.traveler || !formData?.budget}
          onClick={OnGenerateTrip}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin text-xl mr-2" />
              Generating Your Perfect Trip...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI-Powered Trip
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

      <LoadingModal
        open={loading}
        destination={formData?.location?.label}
        error={error}
        onRetry={handleRetry}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default CreateTrip;
