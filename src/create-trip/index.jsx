import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelsList } from "@/constants/options";
import { Button } from "@/components/ui/button";

const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState([]);

  const handleInputChange = (field, value) => {

    setFormData({
      ...formData,
      [field]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const OnGenerateTrip = () => {
    if(formData?.noofDays>5){
      alert('Number of days should be less than 5');
      return;
    }
    console.log('Generate Trip', formData);
  }
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
            ${formData?.budget === item.title && 'shadow-lg border-black'}
            `}>
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
              ${formData?.traveler === item.people && 'shadow-lg border-black'}
              `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex '>
      <Button onClick={OnGenerateTrip}>Generate Trip</Button>
      </div>

    </div >
  );
}

export default CreateTrip;