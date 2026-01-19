"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Route {
  id: string;
  name: string;
  description: string;
  assigned_salesman?: string;
  is_active: boolean;
}

export default function RoutesPage() {
  const user = useAuthStore((state) => state.user);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (user?.role !== "Admin") {
      toast.error("Access denied");
      return;
    }
    fetchRoutes();
  }, [user?.role]);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setRoutes(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("routes").insert([
        {
          name: formData.name,
          description: formData.description,
        },
      ]);

      if (error) throw error;

      toast.success("Route created successfully");
      setFormData({ name: "", description: "" });
      setShowForm(false);
      fetchRoutes();
    } catch (error: any) {
      toast.error(error.message || "Failed to create route");
    }
  };

  const handleDelete = async (routeId: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const { error } = await supabase
        .from("routes")
        .update({ is_active: false })
        .eq("id", routeId);

      if (error) throw error;

      toast.success("Route deactivated");
      fetchRoutes();
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate route");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-semibold transition"
        >
          <Plus size={20} />
          <span>New Route</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Downtown Route"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Route description..."
              rows={3}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-semibold transition"
            >
              Create Route
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{route.description}</p>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <Edit2 size={16} className="inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(route.id)}
                className="flex-1 px-3 py-2 border border-red-300 rounded text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
