"use client";

import { useState, useEffect } from "react";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/product.types";
import { getProducts } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 500]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([10, 500]);
  const [sortBy, setSortBy] = useState("most-popular");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const backendSortMap: Record<string, string> = {
      "most-popular": "rating",
      "low-price": "price_asc",
      "high-price": "price_desc",
    };

    getProducts({
      category_slug: searchParams.category,
      search: searchParams.search,
      min_price: appliedPriceRange[0],
      max_price: appliedPriceRange[1],
      sort_by: backendSortMap[sortBy] || "newest",
      limit: 100,
    }).then((data) => {
      if (isMounted) {
        setProducts(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [searchParams.category, searchParams.search, appliedPriceRange, sortBy]);

  const categoryTitle = searchParams.search
    ? `Search: "${searchParams.search}"`
    : searchParams.category
    ? searchParams.category.replaceAll("-", " ")
    : "All products";

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = products.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onApply={() => {
                setAppliedPriceRange(priceRange);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px] capitalize">
                  {categoryTitle}
                </h1>
                <MobileFilters
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  onApply={() => {
                    setAppliedPriceRange(priceRange);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {paginatedProducts.length} of {products.length} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">Most Popular</SelectItem>
                      <SelectItem value="low-price">Low Price</SelectItem>
                      <SelectItem value="high-price">High Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="py-12 text-center text-black/60 font-medium">
                Loading products from database...
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-12 text-center text-black/60 font-medium">
                No products found in this selection.
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            )}
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage(Math.max(activePage - 1, 1));
                }}
                aria-disabled={activePage === 1}
                className="border border-black/10"
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(page);
                        }}
                        className="text-black/50 font-medium text-sm"
                        isActive={page === activePage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage(Math.min(activePage + 1, totalPages));
                }}
                aria-disabled={activePage === totalPages}
                className="border border-black/10"
              />
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}

