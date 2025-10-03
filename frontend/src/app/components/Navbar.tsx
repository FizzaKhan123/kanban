"use client";

import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Task Board</h1>
      <ProfileMenu />
    </nav>
  );
}
