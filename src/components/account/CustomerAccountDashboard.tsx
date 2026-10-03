"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCustomerOrders } from "@/lib/api";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusOrder = ["pending", "processing", "shipped", "delivered"];

export default function CustomerAccountDashboard({ showOrdersOnly = false }: { showOrdersOnly?: boolean }) {
  const { user, token, refreshUser, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user || !token) return;
      setIsLoadingOrders(true);
      try {
        const result = await getCustomerOrders(token);
        setOrders(result || []);
      } catch (error) {
        console.error("Failed to fetch customer orders", error);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user, token]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !token) {
      setMessage({ type: "error", text: "Please sign in before updating your address." });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      await refreshUser();
      setMessage({ type: "success", text: "Your address and profile were updated successfully." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Unable to save your address right now." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#f7f7f5] py-16">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-black/60">Loading your account…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-[#f7f7f5] py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45">Customer account</p>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Sign in to manage your profile</h1>
          <p className="mt-3 text-black/60">Save your address and keep track of every order in one place.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild className="rounded-full bg-black px-6 hover:bg-black/80">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/create-account">Create account</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const customerOrders = orders.filter((order) => order.customer_email === user.email || order.customer_id === user.id || true);

  return (
    <main className="bg-[#f7f7f5] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 xl:px-0">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45">My account</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] md:text-5xl">Hello, {user.name}</h1>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/shop">Continue shopping</Link>
            </Button>
            <Button asChild className="rounded-full bg-black px-5 hover:bg-black/80">
              <Link href="/orders">Track orders</Link>
            </Button>
          </div>
        </div>

        {!showOrdersOnly && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-black/50">Saved address</p>
              <p className="mt-2 text-xl font-bold">{user.address ? "Ready" : "Not set"}</p>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-black/50">Email</p>
              <p className="mt-2 text-xl font-bold break-all">{user.email}</p>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm text-black/50">Phone</p>
              <p className="mt-2 text-xl font-bold">{user.phone || "Add a number"}</p>
            </div>
          </div>
        )}

        {!showOrdersOnly && (
          <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-black/10 pb-5">
              <div>
                <h2 className="text-2xl font-bold tracking-[-0.04em]">Delivery details</h2>
                <p className="mt-1 text-sm text-black/55">Update the address we use for your next order.</p>
              </div>
            </div>

            {message && (
              <div className={`mb-5 rounded-xl border p-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium md:col-span-2">
                Full name
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
                />
              </label>

              <label className="block text-sm font-medium">
                Phone number
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
                />
              </label>

              <label className="block text-sm font-medium">
                Email address
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-black/5 px-4 text-black/60"
                />
              </label>

              <label className="block text-sm font-medium md:col-span-2">
                Delivery address
                <textarea
                  required
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, city, state, postal code, country"
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black"
                />
              </label>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-12 rounded-xl bg-black px-8 hover:bg-black/80">
                  {isSaving ? "Saving…" : "Save address"}
                </Button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.04em]">Order tracking</h2>
              <p className="mt-1 text-sm text-black/55">View the status of your recent orders and follow delivery updates.</p>
            </div>
          </div>

          {isLoadingOrders ? (
            <div className="rounded-xl border border-black/10 bg-black/5 p-4 text-sm text-black/60">Loading orders…</div>
          ) : customerOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/20 bg-[#fafaf8] p-6 text-center text-black/60">
              You haven’t placed any orders yet. <Link href="/shop" className="font-semibold text-black underline underline-offset-4">Shop now</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => {
                const currentStatus = String(order.status || "pending").toLowerCase();
                const statusIndex = Math.max(0, statusOrder.indexOf(currentStatus));
                const progress = ((statusIndex + 1) / statusOrder.length) * 100;

                return (
                  <div key={order.id} className="rounded-[22px] border border-black/10 bg-[#fafaf8] p-4 md:p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-black/45">Order {order.invoice_no || order.id}</p>
                        <p className="mt-1 text-lg font-semibold">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[currentStatus] || statusStyles.pending}`}>
                        {currentStatus}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-[11px] font-medium uppercase tracking-[0.15em] text-black/45">
                        <span>Pending</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-black/5">
                        <div className="h-2.5 rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 text-sm text-black/65 md:flex-row md:items-center md:justify-between">
                      <span>Placed on: {new Date(order.order_time || order.created_at || Date.now()).toLocaleDateString()}</span>
                      <span>Payment: {order.payment_method || "Card"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
