import { auth } from "@/auth";
import CartTable from "@/components/cart/cart-table";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/lib/actions/order.actions";
import { shortenId } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderContent = async ({ orderId }: { orderId: string }) => {
  const order = await getOrderById(orderId);
  if (!order) notFound();
  const session = await auth();
  if (order.userId != session?.user.id) redirect("/unauthorized");
  const shippingAddress = order.shippingAddress as ShippingAddress;
  return (
    <div className="wrapper">
      <p className="text-xl my-3">Order {shortenId(orderId)}</p>
      <div className="flex">
        <div className="flex flex-col gap-2 w-full md:w-[65%]">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.paymentMethod}</p>
              {order.isPaid ? (
                <Badge></Badge>
              ) : (
                <Badge variant="destructive" className="mt-4">
                  Not Paid
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{shippingAddress.fullName}</p>
              <p>
                {`${shippingAddress.streetAddress}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country}  `}
              </p>
              {order.isDelivered ? (
                <Badge></Badge>
              ) : (
                <Badge variant="destructive" className="mt-4">
                  Not Delivered
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const orderId = (await props.params).id;
  return (
    <Suspense fallback={<Loader size={50} />}>
      <OrderContent orderId={orderId} />
    </Suspense>
  );
};
export default OrderDetailsPage;
