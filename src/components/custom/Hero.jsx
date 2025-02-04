import React from "react";
import { Lightbulb } from "lucide-react";
import Footer from "./Footer.jsx";


function Hero() {
  return (
    <div>
     <hr />
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row h-full justify-center items-center mx-10 my-20">
        <article className="flex-1 p-4">
          <h1 className="font-bold lg:text-7xl md:text-6xl text-4xl text-left w-full">
            Uncover the <br /> 
            <span className="text-blue-500">AI</span> Travel{" "}
            <span className="text-blue-500">Plan</span>
          </h1>

          <div className="mt-5 lg:mt-10 text-left lg:text-lg md:text-md text-base">
            <div className="flex items-center">
              <Lightbulb className="mr-2 text-yellow-600 h-[50px] w-[50px]" />
              <span className="text-3xl md:text-2xl">
                Imagine telling your travel planner,
              </span>
            </div>
            <p className="text-blue-500 font-bold tracking-wide lg:text-2xl md:text-base text-sm mt-2">
              'Weekend escape to a vibrant city, with mid-range budget in summer.'
            </p>
            <p className="mt-5 text-gray-600 font-medium md:max-w-xl">
              Our AI not only understands but crafts a personalized adventure. Discover local secrets, savor culinary delights, and explore iconic landmarks with an itinerary designed just for you.
            </p>
          </div>
        </article>

        {/* Hero Image */}
        <div className="flex-1 p-4">
  <img 
    src="/travel_image.svg" 
    alt="Travel Image" 
    className="w-full h-auto max-w-full object-cover md:h-64 lg:h-80 xl:h-96" 
  />
</div>

      </div>

      {/* How It Works Section */}
      <div className="my-20 text-center">
        <h2 className="text-5xl text-blue-700 font-bold">How it works?</h2>
        <h3 className="text-4xl my-2 text-orange-700 font-bold">Craft Your Ideal Journey Swiftly</h3>

        <div className="flex flex-col lg:flex-row justify-center items-center text-white p-16 space-y-10 lg:space-y-0 lg:space-x-20">
          {/* Step 1: Login */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <img src="/login.png" alt="Login Icon" className="hover:scale-105 cursor-pointer transition-all  h-[80px] w-[80px]" />
            </div>
            <p className="font-bold text-2xl text-blue-700">Login</p>
            <p className="text-gray-600 text-lg">Log in to start your journey.</p>
          </div>

      

          {/* Step 2: Key in the travel idea */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <img src="/bulb.png" alt="Idea Icon" className="hover:scale-105 cursor-pointer transition-all  h-[80px] w-[80px]" />
            </div>
            <h2 className="font-bold text-2xl text-blue-700">Key in the travel idea</h2>
            <p className="text-gray-600 text-lg">Share your perfect trip and allocate your expenses!</p>
          </div>

          {/* Step 3: Get AI Plan */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gray-800 p-6 rounded-2xl">
              <img src="/plane.png" alt="AI Plan Icon" className="hover:scale-105 cursor-pointer transition-all  h-[80px] w-[80px]" />
            </div>
            <h2 className="font-bold text-2xl text-blue-700">Get AI Plan</h2>
            <p className="text-gray-600 text-lg">Get your AI-driven tailored travel plan</p>
          </div>
        </div>
      </div>

      {/* Favorite Trips Section */}
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold  text-blue-600">Our Community's Favorite Trips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-20">
          {[
            { name: "Vrindavan, India", img: "/vrin.png" },
            { name: "Ooty, India", img: "/ooty.png" },
            { name: "Greece, Republic", img: "/greece.png" },
            { name: "Haridwar", img: "/haridwar.png" },
            { name: "London", img: "/london.png" },
            { name: "Delhi, India", img: "/India-Gate.png" },
            { name: "Mount Everest, India", img: "/mt_everest.jpg" },
            { name: "Paris, NY", img: "/paris.png" },
             
          ].map((trip, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
              <img src={trip.img} alt={trip.name} className="w-full h-[240px] rounded-xl hover:scale-105 cursor-pointer transition-all shadow-md bg-white"  />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-lg">
                {trip.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Section */}
      <Footer />
    </div>

   
  );
}

export default Hero;
