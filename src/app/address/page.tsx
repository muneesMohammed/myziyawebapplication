"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AddressPage() {
  const { user, token } = useAuth();
  const { cart, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Razorpay is only available in the browser."));
        return;
      }

      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const existingScript = document.getElementById("razorpay-checkout-script");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay script.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Razorpay script."));
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart || cart.items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const itemsPayload = cart.items.map((item) => ({
        product_id: String(item.id),
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`.trim();
      const amount = Math.round(adjustedTotalPrice || 0);

      const paymentPayload = {
        items: itemsPayload,
        payment_method: paymentMethod === "razorpay" ? "card" : "cash",
        shipping_cost: 0,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: fullAddress,
      };

      if (paymentMethod === "razorpay") {
        await loadRazorpayScript();
        const razorpayOrder = await createRazorpayOrder(amount, `myziya_${Date.now()}`);

        const razorpay = new (window as any).Razorpay({
          key: razorpayOrder.key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Myzia Perfumes",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const res = await createOrder(
              {
                ...paymentPayload,
                payment_method: "card",
              },
              token || undefined
            );
            setOrderConfirmed(res);
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#111111",
          },
          modal: {
            ondismiss: () => {
              setErrorMsg("Payment was cancelled. Please try again.");
            },
          },
        });

        razorpay.open();
        return;
      }

      const res = await createOrder(paymentPayload, token || undefined);
      setOrderConfirmed(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <main className="bg-[#f7f7f5] py-16">
        <div className="mx-auto max-w-[600px] px-4 text-center">
          <div className="rounded-[24px] border border-black/10 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Order Confirmed!</h1>
            <p className="mt-2 text-black/60">
              Thank you for your purchase. Your order has been placed in our system.
            </p>
            <div className="my-6 rounded-xl bg-gray-50 p-4 text-left space-y-2 text-sm border border-black/5">
              <div><span className="font-semibold">Invoice No:</span> {orderConfirmed.invoice_no || orderConfirmed.id}</div>
              <div><span className="font-semibold">Customer:</span> {orderConfirmed.customer_name || formData.fullName}</div>
              <div><span className="font-semibold">Status:</span> <span className="capitalize text-green-700 font-medium">{orderConfirmed.status || "pending"}</span></div>
              <div><span className="font-semibold">Total Amount:</span> ₹{orderConfirmed.total_amount || Math.round(adjustedTotalPrice)}</div>
            </div>
            <Button asChild className="rounded-full bg-black px-8">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f7f7f5] py-10 md:py-16">
      <div className="mx-auto max-w-[780px] px-4 xl:px-0">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Link href="/cart" className="text-sm text-black/50 underline underline-offset-4">
              Back to cart
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.05em] md:text-5xl">Delivery address</h1>
            <p className="mt-3 text-sm text-black/55 md:text-base">Where should we send your Myzia order?</p>
          </div>
          <span className="hidden text-sm font-medium text-black/45 sm:block">1 of 2</span>
        </div>

        <form className="rounded-[24px] border border-black/10 bg-white p-5 md:p-8" onSubmit={handleSubmit}>
          <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-5">
            <h2 className="text-xl font-bold md:text-2xl">Shipping details</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-black/40">Secure checkout</span>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="mb-6 rounded-2xl border border-black/10 bg-[#fafaf8] p-4">
            <p className="text-sm font-semibold">Payment method</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                <span>
                  <span className="block text-sm font-medium">Razorpay</span>
                  <span className="block text-xs text-black/55">Card, UPI, wallet</span>
                </span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>
                  <span className="block text-sm font-medium">Cash on delivery</span>
                  <span className="block text-xs text-black/55">Pay on delivery</span>
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Full name
              <input
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your full name"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium">
              Email address
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              Address
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="House number and street"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium">
              City
              <input
                required
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="address-level2"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium">
              State / Province
              <input
                required
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                autoComplete="address-level1"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium">
              Postal code
              <input
                required
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                autoComplete="postal-code"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
            <label className="block text-sm font-medium">
              Phone number
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="For delivery updates"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
              />
            </label>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" asChild className="h-12 rounded-xl px-7">
              <Link href="/cart">Return to cart</Link>
            </Button>
            <Button type="submit" disabled={submitting} className="h-12 rounded-xl bg-black px-8 hover:bg-black/80">
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
