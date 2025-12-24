import ProductForm from "@/components/admin/product-form";
import Loader from "@/components/Loader";
import { getProductById } from "@/lib/actions/products.actions";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const UpdateProduct = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) notFound();
  return (
    <div className="wrapper">
      <p className="text-xl font-semibold my-5">Update Product</p>
      <ProductForm type="update" product={product} />
    </div>
  );
};

const UpdateProductPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <UpdateProduct params={params} />
    </Suspense>
  );
};
export default UpdateProductPage;
