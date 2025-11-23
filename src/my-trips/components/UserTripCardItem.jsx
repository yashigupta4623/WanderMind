import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";
import { Trash, Clock, MapPin, Calendar, Wallet, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function UserTripCardItem({ trip, refreshTrips }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    try {
      const resp = await GetPlaceDetails(data);
      if (resp?.data?.places?.[0]?.photos?.length > 0) {
        const photos = resp.data.places[0].photos;
        const photoIndex = photos.length > 8 ? 8 : photos.length > 3 ? 3 : 0;
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photos[photoIndex].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  const handleDeleteTrip = async (e) => {
    // e.stopPropagation() is handled by the button click, but good to have here if called directly
    try {
      await deleteDoc(doc(db, "AITrips", trip.id));
      toast.success("Trip deleted successfully!");
      setOpenDialog(false);
      if (refreshTrips) {
        refreshTrips();
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  const formatCreationDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Function to format budget display with amount
  const formatBudgetDisplay = (trip) => {
    const budgetAmount = trip?.userSelection?.budgetAmount;

    // Try to show actual budget amount first
    if (budgetAmount && budgetAmount > 0) {
      return `₹${parseInt(budgetAmount).toLocaleString()}`;
    }

    // Try to extract amount from trip data or generate realistic amount based on budget type
    const budget = trip?.userSelection?.budget;
    const days = parseInt(trip?.userSelection?.noofDays) || 3;
    const travelers = trip?.userSelection?.traveler || '1 Person';

    // Extract number of people
    const peopleCount = travelers.includes('2') ? 2 :
      travelers.includes('3') ? 3 :
        travelers.includes('4') ? 4 :
          travelers.includes('Group') ? 4 : 1;

    // Generate realistic budget amounts based on type
    let estimatedAmount = 0;
    switch (budget) {
      case 'budget':
        estimatedAmount = days * peopleCount * 2500; // ₹2,500 per person per day
        break;
      case 'moderate':
        estimatedAmount = days * peopleCount * 4500; // ₹4,500 per person per day
        break;
      case 'luxury':
        estimatedAmount = days * peopleCount * 8000; // ₹8,000 per person per day
        break;
      default:
        estimatedAmount = days * peopleCount * 4000; // Default moderate
    }

    return `₹${estimatedAmount.toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/view-trip/${trip.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative hover:scale-105 transition-all duration-300 rounded-xl shadow-sm hover:shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <img
          src={photoUrl ? photoUrl : "/header.png"}
          alt="Trip destination"
          className="object-cover h-[200px] w-full transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/header.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1">
          {trip?.userSelection?.location?.label}
        </h2>

        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{trip?.userSelection?.noofDays} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-green-500" />
            <span>{formatBudgetDisplay(trip)}</span>
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Created {formatCreationDate(trip.id)}</span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/create-trip', { state: { editTrip: trip } });
              }}
              className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors z-10 relative"
              title="Edit Trip"
            >
              <Edit className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDialog(true);
                  }}
                  className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors z-10 relative"
                  title="Delete Trip"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your trip to
                    <span className="font-bold text-gray-900 dark:text-white"> {trip?.userSelection?.location?.label}</span>.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={(e) => e.stopPropagation()}>Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteTrip}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTripCardItem;
