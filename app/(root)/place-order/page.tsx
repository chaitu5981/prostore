import { auth } from "@/auth";
import CartTable from "@/components/cart/cart-table";
import Loader from "@/components/Loader";
import PlaceOrderForm from "@/components/place-order/place-order-form";
import CheckoutSteps from "@/components/shared/checkout/checkout-steps";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { currencyFormatter } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const PlaceOrderContent = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const cart = await getCart();
  if (!cart) redirect("/cart");
  const user = await getUserById(userId);
  if (!user?.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");
  const shippingAddress = user.address as ShippingAddress;
  return (
    <div className="wrapper flex  md:flex-col items-start md:items-center gap-5">
      <CheckoutSteps current={4} />
      <div className="space-y-3 md:w-full">
        <h2 className="text-xl">Place Order</h2>
        <div className="flex gap-5 flex-col md:flex-row w-full">
          <div className="flex flex-col gap-4 w-full md:w-[65%]">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {`${shippingAddress.streetAddress}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country}  `}
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/shipping-address">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{user.paymentMethod}</p>
              </CardContent>
              <CardFooter>
                <Link href="/payment-method">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <CartTable cart={cart} src="orderPage" />
              </CardContent>
              <CardFooter>
                <Link href="/cart">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full md:w-[32%]">
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p>Items</p>
                  <p>{currencyFormatter(cart.itemsPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>{currencyFormatter(cart.taxPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>{currencyFormatter(cart.shippingPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Total</p>
                  <p>{currencyFormatter(cart.totalPrice)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <PlaceOrderForm />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceOrderPage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <PlaceOrderContent />
    </Suspense>
  );
};
export default PlaceOrderPage;
