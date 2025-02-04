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
    <div className="p-3 shadow-sm flex items-center gap-2 px-5 flex-wrap sm:flex-nowrap">
      <img src="/logo.svg" alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
      <h2
        className="font-bold text-[20px] sm:text-[25px] md:text-[30px]"
        style={{ color: "#0000FF" }}
      >
        Wander<span className="text-[#151414]">Mind</span>
      </h2>
      <div className="ml-auto">
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[18px] w-[18px] rounded-full cursor-pointer"
                  alt={user?.name}
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={handleLogout}>
                  LogOut
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
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
                <img
                  src="./public/logo.svg"
                  alt="logo"
                  style={{ height: "40px", width: "50px" }}
                />
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
