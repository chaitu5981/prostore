import { getProductBySlug } from "@/lib/actions/products.actions";
import { notFound } from "next/navigation";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <div>{product?.name}</div>;
};
export default ProductDetails;
