"use client";
import { Product } from "@/types";
import ProductCard from "./shared/product/ProductCard";
import Loader from "./Loader";
import { useProductsLoadingContext } from "@/app/context/products-loading-provider";
import { useEffect } from "react";

const ProductsGrid = ({ products }: { products: Product[] }) => {
  const context = useProductsLoadingContext();
  let productsLoading;
  let setProductsLoading: (loading: boolean) => void;
  if (context) {
    productsLoading = context.productsLoading;
    setProductsLoading = context.setProductsLoading;
  }

  useEffect(() => {
    if (products) setProductsLoading(false);
  }, [products]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {productsLoading ? (
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
