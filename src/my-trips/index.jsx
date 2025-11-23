import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";


function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  /**
   * Used to Get All User Trips
   * @returns
   */
  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );

    const querySnapshot = await getDocs(q);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-6xl text-blue-700">My Trips</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem
              key={index}
              trip={trip}
              refreshTrips={GetUserTrips}
            />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div
              key={index}
              className="h-[220px] w-full bg-slate-200 rounded-xl shadow-md border animate-pulse"
            ></div>
          ))
        )}
      </div>


    </div>
  );
}

export default MyTrips;
