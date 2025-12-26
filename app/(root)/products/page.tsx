import Filters from "@/components/filters";
import ProductCard from "@/components/shared/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getAllProducts, getCategories } from "@/lib/actions/products.actions";
import { getPriceLabel } from "@/lib/utils";
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
  }>;
}) => {
  const { query, category, price, rating } = await searchParams;
  const res = await getAllProducts({
    query: query || "",
    category: category || "all",
    price: price || "all",
    rating: rating || "all",
  });
  const categories = await getCategories();

  return (
    <div className="wrapper">
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <Filters categories={categories.map((c) => c.category)} />
        </div>
        <div className="col-span-3">
          {
            <div className="flex gap-2 items-center mb-2">
              {category && category !== "all" && (
                <div className="space-x-2">
                  <span className="font-semibold">Category:</span>
                  <span>{category}</span>
                </div>
              )}
              {price && price != "all" && (
                <div className="space-x-2">
                  <span className="font-semibold">Price:</span>
                  <span>{getPriceLabel(price)}</span>
                </div>
              )}
              {rating && rating != "all" && (
                <div className="space-x-2">
                  <span className="font-semibold">Rating:</span>
                  <span>{rating + " stars & above"}</span>
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
          }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {res.data?.length == 0 ? (
              <p>No Products found</p>
            ) : (
              res.data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
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
  }>;
}) => {
  return (
    <Suspense>
      <Products searchParams={searchParams} />
    </Suspense>
  );
};
export default ProductsPage;
