import Loader from "@/components/Loader";
import BannerCarousel from "@/components/shared/product/banner-carousel";
import ProductList from "@/components/shared/product/ProductList";
// import sampleData from "@/db/sample-data";
import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/actions/products.actions";
import { Suspense } from "react";

const HomePageContent = async () => {
  const sampleData = await getProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <div className="wrapper">
      <BannerCarousel data={featuredProducts} />
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
