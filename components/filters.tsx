"use client";
import { useProductsLoadingContext } from "@/app/context/products-loading-provider";
import { getCategories } from "@/lib/actions/products.actions";
import { prices } from "@/lib/constants";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
const ratings = ["4", "3", "2", "1"];
const Filters = ({ categories }: { categories: string[] }) => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const { category, price, rating } = params;
  const context = useProductsLoadingContext();
  let setProductsLoading: (loading: boolean) => void;
  if (context) setProductsLoading = context.setProductsLoading;
  const router = useRouter();
  const handleSubmit = ({
    category,
    price,
    rating,
  }: {
    category?: string;
    price?: string;
    rating?: string;
  }) => {
    let newUrl;
    if (category)
      newUrl = `/products?${new URLSearchParams({ ...params, category })}`;
    else if (price)
      newUrl = `/products?${new URLSearchParams({ ...params, price })}`;
    else if (rating)
      newUrl = `/products?${new URLSearchParams({ ...params, rating })}`;
    else newUrl = "/products";
    setProductsLoading(true);
    router.push(newUrl);
  };
  return (
    <div className="space-y-4">
      <div>
        <p className="my-1">Category</p>
        <div className="flex flex-col">
          <Button
            variant="link"
            type="button"
            onClick={() => handleSubmit({ category: "all" })}
          >
            Any
          </Button>
          {categories.map((c) => (
            <Button
              variant="link"
              key={c}
              onClick={() => handleSubmit({ category: c })}
              className={category == c ? "font-semibold" : ""}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="my-1">Price</p>
        <div className="flex flex-col">
          <Button
            variant="link"
            onClick={() => handleSubmit({ price: "all" })}
            className={!price || price == "all" ? "font-semibold" : ""}
          >
            Any
          </Button>
          {prices.map((p) => (
            <Button
              variant="link"
              key={p.value}
              onClick={() => handleSubmit({ price: p.value })}
              className={price == p.value ? "font-semibold" : ""}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="my-1">Ratings</p>
        <div className="flex flex-col">
          <Button
            variant="link"
            onClick={() => handleSubmit({ rating: "all" })}
            className={!rating || rating == "all" ? "font-semibold" : ""}
          >
            Any
          </Button>
          {ratings.map((r) => (
            <Button
              variant="link"
              key={r}
              onClick={() => handleSubmit({ rating: r })}
              className={rating == r ? "font-semibold" : ""}
            >
              {r + " stars & above"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Filters;
