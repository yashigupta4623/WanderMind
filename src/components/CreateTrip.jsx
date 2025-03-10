import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelsList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
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
      console.log(result?.response?.text());
      const tripData = JSON.parse(result?.response?.text());

      // Add price field to each hotel
      tripData.hotels = tripData.hotels.map(hotel => ({
        ...hotel,
        price: hotel.price || "Price not available" // Add price field if not already present
      }));

      const docId = Date.now().toString();
      await SaveAiTrip(JSON.stringify(tripData), docId);
    } catch (error) {
      console.error("Error generating trip:", error);
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
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
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
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index} onClick={() => handleInputChange('budget', item.title)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
            ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
        <div className='grid grid-cols-4 gap-5 mt-5'>
          {SelectTravelsList.map((item, index) => (
            <div key={index} onClick={() => handleInputChange('traveler', item.people)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
              ${formData?.traveler === item.people ? 'shadow-lg border-black' : ''}`}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex '>
      <Button onClick={OnGenerateTrip} disabled={loading}>
  {loading ? <AiOutlineLoading3Quarters className="animate-spin text-xl inline-block" /> : "Generate Trip"}
</Button>
      </div>
    </div>
  );
  <Footer />
}

export default CreateTrip;