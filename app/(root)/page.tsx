import ProductList from "@/components/shared/product/ProductList";
import sampleData from "../db/sample-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const HomePage = async () => {
  await delay(2000);
  return (
    <div className="wrapper">
      <ProductList data={sampleData.products} title="New Arrivals" />
    </div>
  );
};
export default HomePage;
