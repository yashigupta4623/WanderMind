import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  const tripData = trip?.tripData ? JSON.parse(trip.tripData) : {};

  return (
    <div>
    <h2 className="font-bold text-2xl mt-5 mb-6 text-center">
  Places to Visit
</h2>


      <div>
        {tripData?.itinerary?.length > 0 ? (
          tripData.itinerary.map((item, index) => (
            
              <div>
              <h2 className='font-medium text-lg my-2  text-blue-600'>{item.day}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {item.plan?.map((place, index) => (
                  <div>
                   
                    <PlaceCardItem place={place} />
                  </div>
                ))}
                </div>
              </div>
            
          ))
        ) : (
          <div className="text-center text-gray-500">No places to visit available</div>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;
