"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountShell from "@/components/account/AccountShell";

export default function CreateAccountPage() {
  return (
    <AccountShell
      eyebrow="Make it yours"
      title="Build your fragrance ritual."
      description="Create an account to save favourites, move faster at checkout, and follow every order."
      footer={
        <>
          Already have an account? {" "}
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
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            First name
            <input required type="text" name="firstName" autoComplete="given-name" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
          </label>
          <label className="block text-sm font-medium">
            Last name
            <input required type="text" name="lastName" autoComplete="family-name" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Email address
          <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input required minLength={8} type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
        </label>
        <label className="flex items-start gap-3 text-sm leading-5 text-black/60">
          <input required type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-black" />
          I agree to the terms and privacy policy.
        </label>
        <Button type="submit" className="h-12 w-full rounded-xl bg-black text-base hover:bg-black/80">
          Create account
        </Button>
      </form>
    </AccountShell>
  );
}
