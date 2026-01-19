"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/store";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg overflow-y-auto">
        <Sidebar userRole={user.role} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:pb-0 pb-20">
        <Header userRole={user.role} userName={user.full_name} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <BottomNav userRole={user.role} />
      </div>
    </div>
  );
}
