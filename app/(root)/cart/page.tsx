import CartTable from "@/components/cart/cart-table";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getCart } from "@/lib/actions/cart.actions";
import { currencyFormatter, getCartQty } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
export const metadata = {
  title: "Cart",
};

const CartContent = async () => {
  const cart = await getCart();
  if (!cart)
    return (
      <div className="wrapper">
        Your Cart is empty.{"  "}
        <Link href="/" className="underline text-blue-500">
          Continue Shopping
        </Link>
      </div>
    );
  return (
    <div className="wrapper">
      <div className="h3-bold">Shopping Cart</div>
      <div className="flex justify-between flex-col md:flex-row gap-5">

      <CartTable cart={cart} />
      <Card className="w-[40%] md:w-[25%] mx-auto md:ml-auto">
        <CardContent>
          <p>
            Sub Total({getCartQty(cart.items)}) :{" "}
            <span className="font-semibold">
              {currencyFormatter(cart.totalPrice)}
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/shipping-address">
          <Button
            className="w-full h-fit"
            >
            <p className="whitespace-pre-wrap">Proceed to Checkout</p>
          </Button>
            </Link>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

const CartPage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <CartContent />
    </Suspense>
  );
};

export default CartPage;
