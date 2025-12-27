"use client";
import { Product } from "@/types";
import ProductCard from "./shared/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const ProductsGrid = ({ products }: { products: Product[] }) => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const initialMount = useRef(true);
  const prevSearchParams = useRef(searchParams.toString());
  const prevProducts = useRef(products);
  useEffect(() => {
    const currentSearchParams = searchParams.toString();
    if (initialMount.current) {
      initialMount.current = false;
      prevSearchParams.current = currentSearchParams;
      prevProducts.current = products;
      return;
    }
    if (prevSearchParams.current != currentSearchParams) {
      setLoading(true);
      prevSearchParams.current = currentSearchParams;
    }
  }, [searchParams]);
  useEffect(() => {
    if (
      products.length == 0 ||
      prevProducts.current.length != products.length ||
      products.some((p, i) => p.id != prevProducts.current[i]?.id)
    ) {
      setLoading(false);
      prevProducts.current = products;
    }
  }, [products]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {loading ? (
        <Loader size={50} />
      ) : products?.length == 0 ? (
        <p>No Products found</p>
      ) : (
        products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};
export default ProductsGrid;
