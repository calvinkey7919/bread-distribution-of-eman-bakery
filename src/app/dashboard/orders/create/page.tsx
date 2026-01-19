"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  unit_price: number;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== "Salesman") {
      toast.error("Access denied");
      router.push("/dashboard");
      return;
    }

    const initPage = async () => {
      try {
        // Get user's assigned route
        const { data: userData } = await supabase
          .from("users")
          .select("assigned_route_id")
          .eq("id", user.id)
          .single();

        if (!userData?.assigned_route_id) {
          toast.error("No route assigned");
          router.push("/dashboard");
          return;
        }

        const { data: routeData } = await supabase
          .from("routes")
          .select("*")
          .eq("id", userData.assigned_route_id)
          .single();

        setRoute(routeData);

        // Get products
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        setProducts(productData || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load order form");
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [user, router]);

  const handleAddProduct = () => {
    if (products.length === 0) return;
    setOrderItems([
      ...orderItems,
      {
        product_id: products[0].id,
        product_name: products[0].name,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    if (qty < 0) return;
    const updated = [...orderItems];
    updated[index].quantity = qty;
    setOrderItems(updated);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const updated = [...orderItems];
    updated[index].product_id = product.id;
    updated[index].product_name = product.name;
    setOrderItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    if (orderItems.some((item) => item.quantity <= 0)) {
      toast.error("All quantities must be greater than 0");
      return;
    }

    setSubmitting(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          route_id: route.id,
          salesman_id: user?.id,
          status: "CREATED",
          order_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsToInsert = orderItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        ordered_quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success("Order created successfully");
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      console.error(error);
    } finally {
      setSubmitting(false);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Route
          </label>
          <div className="px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-semibold text-amber-900">{route?.name}</p>
            <p className="text-sm text-amber-700">{route?.description}</p>
          </div>
        </div>

        {/* Products Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center space-x-2 px-3 py-1 bg-amber-900 text-white rounded text-sm hover:bg-amber-950 transition"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          {orderItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No items yet. Click "Add Product" to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <select
                      value={item.product_id}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting || orderItems.length === 0}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition"
          >
            {submitting ? "Creating..." : "Create Order"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/orders")}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
