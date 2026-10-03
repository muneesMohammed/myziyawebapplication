import ProductListSec from "@/components/common/ProductListSec";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { getProducts, getReviews } from "@/lib/api";

export const revalidate = 0; // Ensure fresh dynamic data on each request

export default async function Home() {
  const [allProducts, reviews] = await Promise.all([
    getProducts({ limit: 100 }),
    getReviews()
  ]);

  // Extract new arrivals and top selling from dynamic API products
  const newArrivals = allProducts.slice(0, 4);
  const topSelling = allProducts.slice(4, 8).length > 0 ? allProducts.slice(4, 8) : allProducts.slice(0, 4);

  return (
    <>
      <Header />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="NEW ARRIVALS"
          data={newArrivals}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="top selling"
            data={topSelling}
            viewAllLink="/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviews} />
      </main>
    </>
  );
}

