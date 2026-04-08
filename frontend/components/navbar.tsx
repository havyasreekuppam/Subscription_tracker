"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

import { Bell, Menu, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSubscriptions } from "@/lib/subscription-context";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  // ✅ FIX: Safe destructuring
  const context = useSubscriptions()
  const unreadCount = context?.unreadCount ?? 0
  

  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 🔥 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 Profile image
  useEffect(() => {
    const loadImage = () => {
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage && !savedImage.startsWith("blob:")) {
        setProfileImage(savedImage);
      } else if (savedImage && savedImage.startsWith("blob:")) {
        localStorage.removeItem("profileImage");
        setProfileImage(null);
      }
    };

    loadImage();
    window.addEventListener("profileImageUpdated", loadImage);

    return () => {
      window.removeEventListener("profileImageUpdated", loadImage);
    };
  }, []);

  useEffect(() => {
    if (!profileImage && user?.photoURL) {
      setProfileImage(user.photoURL)
    }
  }, [profileImage, user]);

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // 🔥 User data
  const userName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  const userEmail = user?.email || "No email";

  const initials = userName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between 
      border-b border-white/10 
      bg-white/10 backdrop-blur-xl 
      shadow-lg px-4 lg:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        <h1 className="text-lg font-semibold text-white hidden sm:block">
          Subscription Dashboard
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* 🔔 Notifications */}
        <Link href="/notifications">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-white/10"
          >
            <Bell className="h-5 w-5 text-white" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center 
                rounded-full bg-linear-to-r from-purple-500 to-pink-500 
                text-[10px] font-medium text-white">
               {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* 👤 User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 px-2 hover:bg-white/10 rounded-xl">
              <Avatar className="h-8 w-8 ring-2 ring-white/20">
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="hidden md:flex flex-col text-sm text-white">
                <span>{userName}</span>
                <span className="text-xs text-white/60">{userEmail}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* DROPDOWN */}
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-xl"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}