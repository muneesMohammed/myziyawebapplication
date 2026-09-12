"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddressPage() {
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

        <form className="rounded-[24px] border border-black/10 bg-white p-5 md:p-8" onSubmit={(event) => event.preventDefault()}>
          <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-5">
            <h2 className="text-xl font-bold md:text-2xl">Shipping details</h2>
            <span className="text-xs uppercase tracking-[0.16em] text-black/40">Secure checkout</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium sm:col-span-2">
              Full name
              <input required type="text" name="fullName" autoComplete="name" placeholder="Your full name" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              Address
              <input required type="text" name="address" autoComplete="street-address" placeholder="House number and street" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
            <label className="block text-sm font-medium">
              City
              <input required type="text" name="city" autoComplete="address-level2" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
            <label className="block text-sm font-medium">
              State / Province
              <input required type="text" name="state" autoComplete="address-level1" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
            <label className="block text-sm font-medium">
              Postal code
              <input required type="text" name="postalCode" autoComplete="postal-code" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
            <label className="block text-sm font-medium">
              Phone number
              <input required type="tel" name="phone" autoComplete="tel" placeholder="For delivery updates" className="mt-2 h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-black" />
            </label>
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm text-black/60">
            <input type="checkbox" name="saveAddress" className="h-4 w-4 accent-black" />
            Save this address to my account
          </label>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" asChild className="h-12 rounded-xl px-7">
              <Link href="/cart">Return to cart</Link>
            </Button>
            <Button type="submit" className="h-12 rounded-xl bg-black px-8 hover:bg-black/80">
              Continue to payment
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
