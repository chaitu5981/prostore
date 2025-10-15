import { Product } from "@/types";
import ProductCard from "./ProductCard";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title: string;
  limit?: string;
}) => {
  let limitedData = data;
  if (limit) {
    limitedData = data.slice(0, parseInt(limit));
  }
  return (
    <div>
      <h2 className="h3-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {limitedData.map((item: Product) => (
          <ProductCard key={item.slug} product={item} />
        ))}
      </div>
    </div>
  );
};
export default ProductList;
