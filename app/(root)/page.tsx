import Loader from "@/components/Loader";
import ProductList from "@/components/shared/product/ProductList";
// import sampleData from "@/db/sample-data";
import { getProducts } from "@/lib/actions/products.actions";
import { Suspense } from "react";

const HomePageContent = async () => {
  const sampleData = await getProducts();

  return (
    <div className="wrapper">
      <ProductList data={sampleData} title="New Arrivals" />
    </div>
  );
};

const HomePage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <HomePageContent />
    </Suspense>
  );
};
export default HomePage;
