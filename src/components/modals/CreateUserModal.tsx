"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/lib/store";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  editingUser?: User | null;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
  editingUser,
}: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Salesman" as UserRole,
    assigned_route_id: "",
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        full_name: editingUser.full_name,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
        assigned_route_id: editingUser.assigned_route_id || "",
      });
    }
  }, [editingUser]);

  useEffect(() => {
    if (isOpen) {
      fetchRoutes();
    }
  }, [isOpen]);

  const fetchRoutes = async () => {
    try {
      const { data } = await supabase
        .from("routes")
        .select("id, name")
        .eq("is_active", true);
      setRoutes(data || []);
    } catch (error) {
      console.error("Failed to fetch routes", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!editingUser) {
        // Create new user
        if (!formData.password) {
          toast.error("Password is required for new users");
          return;
        }

        // Create Supabase auth user
        const { data: authData, error: authError } =
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
          });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create auth user");

        // Insert user record
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role,
            assigned_route_id:
              formData.role === "Salesman" ? formData.assigned_route_id : null,
          })
          .select()
          .single();

        if (userError) throw userError;

        toast.success(`User ${formData.email} created successfully`);
        onSuccess(userData);
      } else {
        // Update existing user
        const { data, error } = await supabase
          .from("users")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            assigned_route_id:
              formData.role === "Salesman" ? formData.assigned_route_id : null,
          })
          .eq("id", editingUser.id)
          .select()
          .single();

        if (error) throw error;

        toast.success("User updated successfully");
        onSuccess(data);
      }

      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "Salesman",
        assigned_route_id: "",
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editingUser ? "Edit User" : "Create User"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              disabled={!!editingUser}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="john@example.com"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temporary Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                User should change password on first login
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserRole,
                  assigned_route_id: "",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="Admin">Admin</option>
              <option value="Salesman">Salesman</option>
              <option value="Factory">Factory</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>

          {formData.role === "Salesman" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Route *
              </label>
              <select
                value={formData.assigned_route_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigned_route_id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required={formData.role === "Salesman"}
              >
                <option value="">Select a route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 disabled:opacity-50 font-medium transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
