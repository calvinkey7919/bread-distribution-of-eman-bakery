"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore, User, UserRole } from "@/lib/store";
import { toast } from "sonner";
import { Trash2, Edit2, Plus } from "lucide-react";
import CreateUserModal from "@/components/modals/CreateUserModal";

export default function UsersPage() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role !== "Admin") {
      toast.error("Access denied");
      return;
    }
    fetchUsers();
  }, [user?.role]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure? This will deactivate the user.")) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate user");
    }
  };

  const handleCreate = (newUser: User) => {
    setShowModal(false);
    fetchUsers();
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
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-semibold transition"
        >
          <Plus size={20} />
          <span>New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{u.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-medium text-xs">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setShowModal(true);
                      }}
                      className="p-2 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    {u.is_active && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CreateUserModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSuccess={handleCreate}
          editingUser={editingUser}
        />
      )}
    </div>
  );
}
