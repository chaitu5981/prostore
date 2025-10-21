import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="wrapper">
      <section className=" grid grid-cols-1 md:grid-cols-5 gap-y-5">
        <div className="col-span-2 justify-self-center md:justify-self-start">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 justify-self-center flex flex-col gap-6 min-w-0">
          <p>{product.category}</p>
          <p className="text-2xl font-semibold">{product.name}</p>
          <p className="text-sm">
            {product.rating} of {product.numReviews} Reviews
          </p>
          <div className="bg-green-200 px-3 py-1 rounded-4xl w-fit ">
            <ProductPrice price={Number(product.price)} />
          </div>
          <div className="text-sm">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="col-span-1 justify-self-center md:justify-self-end w-[20rem] md:w-full">
          <div className="w-full border-2 border-gray-200 rounded-md p-3 space-y-2">
            <div className="flex justify-between">
              <p>Price</p>
              <ProductPrice price={Number(product.price)} />
            </div>
            <div className="flex justify-between">
              <p>Status</p>
              {product.stock > 0 ? (
                <div className="flex flex-col">
                  <Badge variant={"outline"}>In Stock</Badge>
                </div>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            {product.stock > 0 && (
              <Button className="w-full">Add to Cart</Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProductDetails;
