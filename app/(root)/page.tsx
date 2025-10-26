import ProductList from "@/components/shared/product/ProductList";
// import sampleData from "@/db/sample-data";
import { getProducts } from "@/lib/actions/products.actions";

const HomePage = async () => {
  const sampleData = await getProducts();

  return (
    <div className="wrapper">
      <ProductList data={sampleData} title="New Arrivals" />
    </div>
  );
};
export default HomePage;
