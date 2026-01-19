"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { Package, Truck, CheckCircle, FileText, TrendingUp } from "lucide-react";

interface DashboardStats {
  ordersToday: number;
  dispatchedToday: number;
  acknowledgedToday: number;
  verifiedToday: number;
  invoicedToday: number;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        let query = supabase
          .from("orders")
          .select("status", { count: "exact" })
          .eq("order_date", today);

        if (user?.role === "Salesman") {
          query = query.eq("salesman_id", user.id);
        }

        const { data: orders, count } = await query;

        const statusCounts = {
          CREATED: 0,
          DISPATCHED: 0,
          ACKNOWLEDGED: 0,
          VERIFIED: 0,
          INVOICED: 0,
        };

        orders?.forEach((order: any) => {
          statusCounts[order.status as keyof typeof statusCounts]++;
        });

        setStats({
          ordersToday: count || 0,
          dispatchedToday: statusCounts.DISPATCHED,
          acknowledgedToday: statusCounts.ACKNOWLEDGED,
          verifiedToday: statusCounts.VERIFIED,
          invoicedToday: statusCounts.INVOICED,
        });
      } catch (error) {
        toast.error("Failed to load stats");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Package}
          label="Orders Today"
          value={stats?.ordersToday || 0}
          color="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Truck}
          label="Dispatched"
          value={stats?.dispatchedToday || 0}
          color="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Acknowledged"
          value={stats?.acknowledgedToday || 0}
          color="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Verified"
          value={stats?.verifiedToday || 0}
          color="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={FileText}
          label="Invoiced"
          value={stats?.invoicedToday || 0}
          color="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === "Salesman" && (
            <>
              <QuickActionButton
                href="/dashboard/orders/create"
                label="Create Order"
              />
              <QuickActionButton
                href="/dashboard/acknowledgements"
                label="Acknowledge Delivery"
              />
              <QuickActionButton href="/dashboard/invoices" label="Upload Invoice" />
            </>
          )}
          {user?.role === "Factory" && (
            <>
              <QuickActionButton
                href="/dashboard/dispatch"
                label="Dispatch Orders"
              />
              <QuickActionButton
                href="/dashboard/pending-orders"
                label="View Orders"
              />
            </>
          )}
          {user?.role === "Accountant" && (
            <>
              <QuickActionButton
                href="/dashboard/verify"
                label="Verify Deliveries"
              />
              <QuickActionButton href="/dashboard/reports" label="View Reports" />
            </>
          )}
          {user?.role === "Admin" && (
            <>
              <QuickActionButton href="/dashboard/users" label="Manage Users" />
              <QuickActionButton href="/dashboard/routes" label="Manage Routes" />
              <QuickActionButton href="/dashboard/reports" label="View Reports" />
            </>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="font-semibold text-amber-900 mb-2">System Status</h3>
        <p className="text-sm text-amber-800">
          All systems operational. Last sync: just now
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  iconColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  iconColor: string;
}) {
  return (
    <div className={`${color} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Icon size={32} className={iconColor} />
      </div>
    </div>
  );
}

function QuickActionButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="p-4 border border-gray-200 rounded-lg hover:bg-amber-50 transition text-center font-medium text-gray-700 hover:text-amber-900"
    >
      {label}
    </a>
  );
}
