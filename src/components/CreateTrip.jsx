import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelsList } from "@/constants/options";
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
import Footer from "./custom/Footer";

const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

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

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
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
    if (!formData?.location || !formData?.noofDays || !formData?.budget || !formData?.traveler) {
      toast("Please fill all the details");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noofDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noofDays);

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result?.response?.text();
      console.log("Raw AI response:", responseText);
      
      // Clean and parse JSON response
      const tripData = parseAIResponse(responseText);

      // Add price field to each hotel
      tripData.hotels = tripData.hotels.map(hotel => ({
        ...hotel,
        price: hotel.price || "Price not available" // Add price field if not already present
      }));

      const docId = Date.now().toString();
      await SaveAiTrip(JSON.stringify(tripData), docId);
    } catch (error) {
      console.error("Error generating trip:", error);
      if (error.message.includes("API key not valid")) {
        toast.error(
          "Google AI API key is invalid. Please check your environment configuration."
        );
      } else if (error.message.includes("The model is overloaded")) {
        toast.error(
          "The model is currently overloaded. Please try again later."
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
    try {
      const user = JSON.parse(localStorage.getItem("user"));
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
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 pb-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️</h2>
      <p className='mt-3 text-gray-500'>Just provide some basic information, and we'll help you plan your trip.</p>

      <div className='mt-10 flex flex-col gap-5'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={apiKey}
            selectProps={{
              placeholder: 'Search for places...',
              value: place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v); }
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input 
            placeholder='Number of days...' 
            type='number' 
            onChange={(e) => handleInputChange('noofDays', e.target.value)} 
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index} onClick={() => handleInputChange('budget', item.title)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer transition-all
            ${formData?.budget === item.title ? 'shadow-lg border-[#2196f3] border-2 bg-[#e3f2fd] dark:bg-[#1565c0]/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
          {SelectTravelsList.map((item, index) => (
            <div key={index} onClick={() => handleInputChange('traveler', item.people)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer transition-all
              ${formData?.traveler === item.people ? 'shadow-lg border-[#2196f3] border-2 bg-[#e3f2fd] dark:bg-[#1565c0]/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex '>
      <Button 
        onClick={OnGenerateTrip} 
        disabled={loading}
        className="bg-[#ff6f00] hover:bg-[#f57c00] text-white rounded-full px-8 py-3 font-semibold transition-all shadow-lg hover:shadow-xl"
      >
        {loading ? <AiOutlineLoading3Quarters className="animate-spin text-xl inline-block" /> : "Generate Trip"}
      </Button>
      </div>
    </div>
  );
  <Footer />
}

export default CreateTrip;