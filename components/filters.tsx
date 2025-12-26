"use client";
import { getCategories } from "@/lib/actions/products.actions";
import { prices } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const ratings = ["4", "3", "2", "1"];
const Filters = ({ categories }: { categories: string[] }) => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const { category, price, rating } = params;
  const getNewUrl = ({
    category,
    price,
    rating,
  }: {
    category?: string;
    price?: string;
    rating?: string;
  }) => {
    if (category)
      return `/products?${new URLSearchParams({ ...params, category })}`;
    if (price) return `/products?${new URLSearchParams({ ...params, price })}`;
    if (rating)
      return `/products?${new URLSearchParams({ ...params, rating })}`;
    else return "/products";
  };
  return (
    <div className="space-y-4">
      <div>
        <p className="my-1">Category</p>
        <div className="flex flex-col">
          <Link
            href={getNewUrl({ category: "all" })}
            className={!category || category == "all" ? "font-semibold" : ""}
          >
            Any
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={getNewUrl({ category: c })}
              className={category == c ? "font-semibold" : ""}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="my-1">Price</p>
        <div className="flex flex-col">
          <Link
            href={getNewUrl({ price: "all" })}
            className={!price || price == "all" ? "font-semibold" : ""}
          >
            Any
          </Link>
          {prices.map((p) => (
            <Link
              key={p.value}
              href={getNewUrl({ price: p.value })}
              className={price == p.value ? "font-semibold" : ""}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="my-1">Ratings</p>
        <div className="flex flex-col">
          <Link
            href={getNewUrl({ rating: "all" })}
            className={!rating || rating == "all" ? "font-semibold" : ""}
          >
            Any
          </Link>
          {ratings.map((r) => (
            <Link
              key={r}
              href={getNewUrl({ rating: r })}
              className={rating == r ? "font-semibold" : ""}
            >
              {r + " stars & above"}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Filters;
