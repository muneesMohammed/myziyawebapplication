"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountShell
      eyebrow="Welcome back"
      title="Your scent story continues."
      description="Sign in to keep your saved fragrances, orders, and delivery details close at hand."
      footer={
        <>
          New to Myzia?{" "}
          <Link href="/create-account" className="font-semibold text-black underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-[-0.04em]">Sign in</h2>
        <p className="mt-2 text-sm text-black/55">Enter your details to access your account.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Email address
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none transition focus:border-black"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            required
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none transition focus:border-black"
          />
        </label>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-black/60">
            <input type="checkbox" name="remember" className="h-4 w-4 accent-black" />
            Remember me
          </label>
          <Link href="#" className="font-medium text-black underline underline-offset-4">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-black text-base hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AccountShell>
  );
}
