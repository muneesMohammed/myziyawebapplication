"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/context/AuthContext";

export default function CreateAccountPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName;

    try {
      await register({
        name: fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create customer account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountShell
      eyebrow="Make it yours"
      title="Build your fragrance ritual."
      description="Create an account to save favourites, move faster at checkout, and follow every order."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-black underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-[-0.04em]">Create account</h2>
        <p className="mt-2 text-sm text-black/55">Your next signature scent starts here.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            First name
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
            />
          </label>
          <label className="block text-sm font-medium">
            Last name
            <input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
            />
          </label>
        </div>

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

        <label className="block text-sm font-medium">
          Phone number (Optional)
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="+1 234 567 890"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          Delivery address (Optional)
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            autoComplete="street-address"
            placeholder="Street address, City, Country"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            required
            minLength={6}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black"
          />
        </label>

        <label className="flex items-start gap-3 text-sm leading-5 text-black/60">
          <input required type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-black" />
          I agree to the terms and privacy policy.
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-black text-base hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create account"}
        </Button>
      </form>
    </AccountShell>
  );
}
