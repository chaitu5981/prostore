import ProductList from "@/components/shared/product/ProductList";
// import sampleData from "@/db/sample-data";
import { getProducts } from "@/lib/actions/products.actions";
import { convertToPlainObject } from "@/lib/utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const HomePage = async () => {
  await delay(2000);
  const sampleData = await getProducts();
  return (
    <div className="wrapper">
      <ProductList
        data={convertToPlainObject(sampleData)}
        title="New Arrivals"
      />
    </div>
  );
};
export default HomePage;
