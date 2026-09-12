"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountShell from "@/components/account/AccountShell";

export default function SignInPage() {
  return (
    <AccountShell
      eyebrow="Welcome back"
      title="Your scent story continues."
      description="Sign in to keep your saved fragrances, orders, and delivery details close at hand."
      footer={
        <>
          New to Myzia? {" "}
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
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-medium">
          Email address
          <input
            required
            type="email"
            name="email"
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
          <button type="button" className="font-medium text-black underline underline-offset-4">
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl bg-black text-base hover:bg-black/80">
          Sign in
        </Button>
      </form>
    </AccountShell>
  );
}
