import React from "react";
import { IoShareSocialSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";

function Infosection({ trip }) {
  return (
    <div>
      <img
        src="/bg.jpg"
        alt="Background"
        className="h-[400px] w-full object-cover rounded-xl "
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center items-center">
  <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-md">
    📆 {trip.userSelection?.noofDays} Days
  </h2>
  <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-md">
    💸 {trip.userSelection?.budget} Budget
  </h2>
  <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-md">
    👓 No. of Traveler : {trip.userSelection?.traveler}
  </h2>
</div>

        </div>
        <Button><IoShareSocialSharp /></Button>
      </div>
    </div>
  );
}

export default Infosection;
