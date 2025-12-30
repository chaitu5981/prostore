import { auth } from "@/auth";
import Loader from "@/components/Loader";
import Rating from "@/components/review/rating";
import ReviewForm from "@/components/review/review-form";
import ReviewList from "@/components/review/review-list";
import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { getCart } from "@/lib/actions/cart.actions";
import { getProductBySlug } from "@/lib/actions/products.actions";
import { getAllReviews } from "@/lib/actions/review.actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
export const metadata = {
  title: "Product",
};
const ProductDetailsContent = async ({ slug }: { slug: string }) => {
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const session = await auth();
  const cart = await getCart();
  const reviews = await getAllReviews(product.id);
  return (
    <div className="wrapper">
      <section className=" grid grid-cols-1 md:grid-cols-5 gap-y-5">
        <div className="col-span-2 justify-self-center md:justify-self-start">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 justify-self-center flex flex-col gap-6 min-w-0">
          <p>{product.category}</p>
          <p className="text-2xl font-semibold">{product.name}</p>
          <div className="flex gap-3 items-center">
            <Rating rating={Number(product.rating)} />
            <p>of {product.numReviews} Reviews</p>
          </div>
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
              {Number(product.stock) > 0 ? (
                <div className="flex flex-col">
                  <Badge variant={"outline"}>In Stock</Badge>
                </div>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            {Number(product.stock) > 0 && (
              <AddToCart
                cart={cart}
                item={{
                  productId: product.id,
                  slug: product.slug,
                  productName: product.name,
                  qty: 1,
                  image: product.images[0],
                  price: product.price,
                }}
              />
            )}
          </div>
        </div>
      </section>
      <section>
        <p className="text-2xl font-semibold my-5">Customer Reviews</p>
        {session?.user ? (
          <ReviewForm
            userId={session?.user.id as string}
            productId={product.id}
          />
        ) : (
          <Link
            href={`/sign-in?callbackUrl=/product/${product.slug}`}
            className="text-blue-500 underline"
          >
            Sign in to submit a Review
          </Link>
        )}
      </section>
      <section>
        {reviews.length == 0 ? (
          <p>No Reviews posted yet</p>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </section>
    </div>
  );
};

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<Loader size={50} />}>
      <ProductDetailsContent slug={slug} />
    </Suspense>
  );
};

export default ProductDetails;
