import ProductsLoadingProvider from "@/app/context/products-loading-provider";
import Filters from "@/components/filters";
import Loader from "@/components/Loader";
import ProductsGrid from "@/components/products-grid";
import Sorting from "@/components/sorting";
import { Button } from "@/components/ui/button";
import { getAllProducts, getCategories } from "@/lib/actions/products.actions";
import { getPriceLabel } from "@/lib/utils";
import { Product } from "@/types";
import Link from "next/link";
import { Suspense } from "react";

const Products = async ({
  searchParams,
}: {
  searchParams: Promise<{
    limit: string;
    page: string;
    query: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
  }>;
}) => {
  const { query, category, price, rating, sort } = await searchParams;
  const res = await getAllProducts({
    query: query || "",
    category: category || "all",
    price: price || "all",
    rating: rating || "all",
    sort,
  });
  const categories = await getCategories();

  return (
    <div className="wrapper">
      <ProductsLoadingProvider>
        <div className="grid grid-cols-4">
          <div className="col-span-4 sm:col-span-1">
            <Filters categories={categories.map((c) => c.category)} />
          </div>
          <div className="col-span-4 sm:col-span-3">
            <div className="flex flex-col xl:flex-row  my-2">
              <div className="flex flex-col lg:flex-row gap-2 lg:items-center mb-2">
                {category && category !== "all" && (
                  <div className="flex gap-1">
                    <p className="font-semibold">Category:</p>
                    <p>{category}</p>
                  </div>
                )}
                {price && price != "all" && (
                  <div className="flex gap-1">
                    <p className="font-semibold">Price:</p>
                    <p>{getPriceLabel(price)}</p>
                  </div>
                )}
                {rating && rating != "all" && (
                  <div className="flex gap-1">
                    <p className="font-semibold">Rating:</p>
                    <p>{rating + " stars & above"}</p>
                  </div>
                )}
                {((category && category != "all") ||
                  (price && price != "all") ||
                  (rating && rating != "all")) && (
                  <Button asChild variant="outline">
                    <Link href="/products">Clear Filters</Link>
                  </Button>
                )}
              </div>
              <Sorting />
            </div>
            <ProductsGrid products={res.data as Product[]} />
          </div>
        </div>
      </ProductsLoadingProvider>
    </div>
  );
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    limit: string;
    page: string;
    query: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
  }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <Products searchParams={searchParams} />
    </Suspense>
  );
};
export default ProductsPage;
