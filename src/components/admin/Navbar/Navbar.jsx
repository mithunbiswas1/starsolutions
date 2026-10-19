// src/components/common/Navbar/Navbar.jsx

"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { baseUriBackend } from "@/redux/url/url";

export default function Navbar() {
  const { user } = useAuth();

  const fullName = user?.fullName || "Admin User";
  const role = user?.role || "Administrator";
  const profileImage = user?.image;

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-end px-6">
        <div className="flex items-center gap-3">
          {profileImage ? (
            <Image
              src={`${baseUriBackend}${profileImage}`}
              alt={fullName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(fullName)}
            </div>
          )}

          <div className="hidden text-left md:block">
            <h4 className="text-sm font-semibold text-gray-900">{fullName}</h4>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
