import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  title: string;
  slug: string;
};

const categoriesData: Category[] = [
  {
    title: "PerfumedCream",
    slug: "/shop?category=perfumed-cream",
  },
  {
    title: "pocket spray",
    slug: "/shop?category=pocket-spray",
  },
  {
    title: "oudh oil",
    slug: "/shop?category=oudh-oil",
  },
  {
    title: "bakhoor",
    slug: "/shop?category=bakhoor",
  },
  {
    title: "freshners",
    slug: "/shop?category=fresheners",
  },
];

const CategoriesSection = () => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <Link
          key={idx}
          href={category.slug}
          className="flex items-center justify-between py-2"
        >
          {category.title} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;
