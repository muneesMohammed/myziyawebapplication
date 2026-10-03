"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getCategories, CategoryItem } from "@/lib/api";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCategories().then((data) => {
      if (isMounted) {
        setCategories(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="py-2 text-sm text-black/40">Loading categories...</div>;
  }

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      <Link
        href="/shop"
        className="flex items-center justify-between py-2 text-black font-semibold"
      >
        All Products <MdKeyboardArrowRight />
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${encodeURIComponent(category.slug)}`}
          className="flex items-center justify-between py-2 hover:text-black transition-colors capitalize"
        >
          {category.name} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;

