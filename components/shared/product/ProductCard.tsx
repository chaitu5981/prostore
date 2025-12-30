import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import ProductPrice from "./ProductPrice";
import { Product } from "@/types";
import Link from "next/link";
import Rating from "@/components/review/rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="flex flex-col items-center cursor-pointer">
        <CardHeader className="w-full justify-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover"
          />
        </CardHeader>
        <CardContent className="w-full">
          <p className="font-semibold">{product.brand}</p>
          <p className="truncate font-semibold text-sm">{product.name}</p>
        </CardContent>
        <CardFooter className="w-full justify-between">
          <div className="flex gap-2 items-center">
            <Rating rating={Number(product.rating)} />
            <p>Stars</p>
          </div>
          <ProductPrice price={Number(product.price)} />
        </CardFooter>
      </Card>
    </Link>
  );
};
export default ProductCard;
