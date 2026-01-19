"use client";

import { UserRole } from "@/lib/store";
import Link from "next/link";
import {
  Home,
  Package,
  Truck,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function BottomNav({ userRole }: { userRole: UserRole }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navItems = {
    Admin: [
      { icon: Home, label: "Home", href: "/dashboard" },
      { icon: Package, label: "Users", href: "/dashboard/users" },
      { icon: Truck, label: "Routes", href: "/dashboard/routes" },
      { icon: CheckCircle, label: "Reports", href: "/dashboard/reports" },
      { icon: MoreVertical, label: "More", onClick: handleLogout },
    ],
    Salesman: [
      { icon: Home, label: "Home", href: "/dashboard" },
      { icon: Package, label: "Orders", href: "/dashboard/orders" },
      { icon: Truck, label: "Ack", href: "/dashboard/acknowledgements" },
      { icon: CheckCircle, label: "Invoices", href: "/dashboard/invoices" },
      { icon: MoreVertical, label: "More", onClick: handleLogout },
    ],
    Factory: [
      { icon: Home, label: "Home", href: "/dashboard" },
      { icon: Truck, label: "Dispatch", href: "/dashboard/dispatch" },
      { icon: Package, label: "Orders", href: "/dashboard/pending-orders" },
      { icon: CheckCircle, label: "Status", href: "/dashboard/orders" },
      { icon: MoreVertical, label: "More", onClick: handleLogout },
    ],
    Accountant: [
      { icon: Home, label: "Home", href: "/dashboard" },
      { icon: CheckCircle, label: "Verify", href: "/dashboard/verify" },
      { icon: Package, label: "Reports", href: "/dashboard/reports" },
      { icon: Truck, label: "Status", href: "/dashboard/orders" },
      { icon: MoreVertical, label: "More", onClick: handleLogout },
    ],
  };

  const items = navItems[userRole] || navItems.Salesman;

  return (
    <div className="flex justify-around items-center h-20">
      {items.map((item) => (
        <div key={item.label}>
          {item.href ? (
            <Link
              href={item.href}
              className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-amber-900 transition"
            >
              <item.icon size={24} />
              <span className="text-xs text-center">{item.label}</span>
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              className="flex flex-col items-center space-y-1 p-2 text-gray-600 hover:text-red-600 transition"
            >
              <item.icon size={24} />
              <span className="text-xs text-center">{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
