"use client";
import { createContext, ReactNode, useContext, useState } from "react";

const ProductsLoadingContext = createContext<
  | {
      productsLoading: boolean;
      setProductsLoading: (loading: boolean) => void;
    }
  | undefined
>(undefined);

const ProductsLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [productsLoading, setProductsLoading] = useState(false);
  return (
    <ProductsLoadingContext.Provider
      value={{ productsLoading, setProductsLoading }}
    >
      {children}
    </ProductsLoadingContext.Provider>
  );
};

export const useProductsLoadingContext = () => {
  const context = useContext(ProductsLoadingContext);
  if (context) return context;
};
export default ProductsLoadingProvider;
