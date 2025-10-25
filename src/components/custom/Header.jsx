import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import ThemeToggle from "./ThemeToggle";
import AnimatedLogo from "./AnimatedLogo";

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      console.log(tokenInfo);
      GetUserProfile(tokenInfo);
    },
    onError: (error) => console.log(error),
  });

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
        window.location.reload();
      });
  };

  return (
    <div className="p-3 shadow-sm flex items-center gap-2 px-5 flex-wrap sm:flex-nowrap bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <AnimatedLogo className="w-8 h-8 sm:w-10 sm:h-10" />
      <h2 className="font-bold text-[20px] sm:text-[25px] md:text-[30px] text-blue-600 dark:text-blue-400">
        Wander<span className="text-gray-900 dark:text-white">Mind</span>
      </h2>
      <div className="ml-auto flex items-center gap-3">
        {/* Quick Feature Access - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.href = '/create-trip?tab=inspire'}
            className="text-xs"
          >
            🎯 Inspire Me
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.href = '/create-trip?tab=persona'}
            className="text-xs"
          >
            🤖 AI Plan
          </Button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
        
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                <span className="hidden sm:inline">+ Create Trip</span>
                <span className="sm:hidden">+ Trip</span>
              </Button>
            </a>
            <a href="/my-trips" className="hidden sm:block">
              <Button variant="outline" className="rounded-full text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[30px] w-[30px] sm:h-[35px] sm:w-[35px] rounded-full cursor-pointer border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  alt={user?.name}
                />
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-600" />
                  <a href="/my-trips" className="block sm:hidden">
                    <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                      My Trips
                    </button>
                  </a>
                  <button 
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
          >
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <AnimatedLogo className="h-10 w-12" />
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
    </div>
  );
}

export default Header;
