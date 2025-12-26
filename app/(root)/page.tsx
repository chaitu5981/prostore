import Loader from "@/components/Loader";
import BannerCarousel from "@/components/shared/product/banner-carousel";
import ProductList from "@/components/shared/product/ProductList";
import { Button } from "@/components/ui/button";
// import sampleData from "@/db/sample-data";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/products.actions";
import Link from "next/link";
import { Suspense } from "react";

const HomePageContent = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <div className="wrapper">
      <BannerCarousel data={featuredProducts} />
      <ProductList data={latestProducts} title="New Arrivals" />
      <div className="flex justify-center">
        <Button asChild className="my-5 mx-auto">
          <Link href="/products" className="text-xl">
            View All Products
          </Link>
        </Button>
      </div>
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
