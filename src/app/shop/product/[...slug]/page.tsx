import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { getProductByIdOrSlug, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const targetIdentifier = params.slug[0];
  const productData = await getProductByIdOrSlug(targetIdentifier);

  if (!productData?.title) {
    notFound();
  }

  // Fetch related products dynamically from same category or general list
  const allProducts = await getProducts({ limit: 10 });
  const relatedProducts = allProducts.filter(
    (p) => String(p.id) !== String(productData.id)
  ).slice(0, 4);

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.title ?? "product"} />
        <section className="mb-11">
          <Header data={productData} />
        </section>
        <Tabs />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="You might also like" data={relatedProducts} />
      </div>
    </main>
  );
}

