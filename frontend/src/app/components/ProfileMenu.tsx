"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (token && storedUsername && storedEmail) {
      setUser({
        username: storedUsername,
        email: storedEmail,
      });
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    router.push("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200"
      >
        <User className="w-5 h-5 text-gray-700" />
        <span className="font-medium">{user?.username || "Profile"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-3 border z-50">
          <div className="border-b pb-2 mb-2">
            <p className="font-semibold text-gray-800">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-red-600 hover:bg-red-50 px-2 py-1 rounded"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
