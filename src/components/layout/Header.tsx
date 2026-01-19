"use client";

import { UserRole } from "@/lib/store";
import { Menu, Bell, User } from "lucide-react";
import { useUIStore } from "@/lib/store";

export default function Header({
  userRole,
  userName,
}: {
  userRole: UserRole;
  userName: string;
}) {
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} className="text-amber-900" />
          </button>
          <h1 className="text-2xl font-bold text-amber-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
            <User size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
