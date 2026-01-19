"use client";

import { UserRole } from "@/lib/store";
import Link from "next/link";
import {
  Home,
  Users,
  RouteIcon,
  Package,
  Truck,
  CheckCircle,
  FileText,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function Sidebar({ userRole }: { userRole: UserRole }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const menuItems = {
    Admin: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: Users, label: "User Management", href: "/dashboard/users" },
      { icon: RouteIcon, label: "Routes", href: "/dashboard/routes" },
      { icon: Package, label: "Products", href: "/dashboard/products" },
      { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
      { icon: FileText, label: "Daily Closing", href: "/dashboard/daily-closing" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ],
    Salesman: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: Package, label: "Create Order", href: "/dashboard/orders/create" },
      { icon: Truck, label: "My Orders", href: "/dashboard/orders" },
      { icon: CheckCircle, label: "Acknowledgements", href: "/dashboard/acknowledgements" },
      { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
    ],
    Factory: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: Truck, label: "Dispatch Orders", href: "/dashboard/dispatch" },
      { icon: Package, label: "Pending Orders", href: "/dashboard/pending-orders" },
    ],
    Accountant: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: CheckCircle, label: "Verify Deliveries", href: "/dashboard/verify" },
      { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
    ],
  };

  const items = menuItems[userRole] || menuItems.Salesman;

  return (
    <div className="p-6 space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Eman Bakery</h1>
        <p className="text-sm text-gray-500">Distribution System</p>
      </div>

      <nav className="space-y-2 flex-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
