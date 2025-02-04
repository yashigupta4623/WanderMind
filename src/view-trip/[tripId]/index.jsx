import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Infosection from '../components/Infosection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});

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

  return (
    <div className='p-10  md:px-20 lg:px-44 xl:px-56'>
      <Infosection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
        <div className='mt-10'>
        <Footer />
        </div>
        
    </div>
  );
}

export default Viewtrip;
