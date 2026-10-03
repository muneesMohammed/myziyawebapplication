"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";

import { useAuth } from "@/context/AuthContext";

const data: NavMenu = [
  {
    id: 1,
    label: "Shop",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Spray Fragrance",
        url: "/shop?category=pocket-spray",
        description: "Highly concentrated Extrait de Parfum spray bottles, infused with luxurious fragrance oils",
      },
      {
        id: 12,
        label: "Cream Fragrance",
        url: "/shop?category=perfumed-cream",
        description: "Artisanal solid perfume creams and silky aromatic body balms crafted with golden wax & essential oils",
      },
      {
        id: 13,
        label: "Fragrance Oil",
        url: "/shop?category=oudh-oil",
        description: "100% uncut, alcohol-free pure Attar oil elixirs in hand-carved crystal flacons.",
      },
      {
        id: 14,
        label: "Royal Oudh & Incense",
        url: "/shop?category=bakhoor",
        description: "Hand-rolled Cambodian Kyara Oudh sticks and slow-burning agarwood resin Bakhoor.",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "On Sale",
    url: "/shop",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "New Arrivals",
    url: "/shop",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Brands",
    url: "/shop",
    children: [],
  },
];

const TopNavbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className="mt-2 mr-3 lg:mr-10 flex items-center"
          >
            <Image
              priority
              src="/images/logo.png"
              width={170}
              height={70}
              alt="Myzia Perfumes"
              className="h-auto w-[100px] shrink-0 lg:w-[150px]"
            />
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[400px] mr-3 lg:mr-10">
          <InputGroup className="bg-[#F0F0F0] w-full">
            <InputGroup.Text>
              <button type="submit">
                <Image
                  priority
                  src="/icons/search.svg"
                  height={20}
                  width={20}
                  alt="search"
                  className="min-w-5 min-h-5"
                />
              </button>
            </InputGroup.Text>
            <InputGroup.Input
              type="search"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="bg-transparent placeholder:text-black/40"
            />
          </InputGroup>
        </form>
        <div className="flex items-center relative">
          <Link href="/shop" className="block md:hidden mr-[14px] p-1">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-w-[22px] max-h-[22px]"
            />
          </Link>
          <CartBtn />

          {user ? (
            <div className="relative ml-3">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold hover:bg-black/10 transition"
              >
                <span className="max-w-[100px] truncate">{user.name}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-black/10 bg-white p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-black/10">
                    <p className="text-xs font-bold text-black truncate">{user.name}</p>
                    <p className="text-[11px] text-black/50 truncate">{user.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setShowDropdown(false)} className="mt-1 block rounded-lg px-3 py-2 text-xs font-medium text-black hover:bg-black/5 transition">
                    My account
                  </Link>
                  <Link href="/orders" onClick={() => setShowDropdown(false)} className="block rounded-lg px-3 py-2 text-xs font-medium text-black hover:bg-black/5 transition">
                    My orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left mt-1 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="p-1 ml-1" aria-label="Sign in">
              <Image
                priority
                src="/icons/user.svg"
                height={100}
                width={100}
                alt="user"
                className="max-w-[22px] max-h-[22px]"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
