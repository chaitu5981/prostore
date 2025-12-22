import { auth } from "@/auth";
import Loader from "@/components/Loader";
import PaypalOrderForm from "@/components/paypal-order/paypal-order-form";
import OrderTotal from "@/components/place-order/order-total";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderById } from "@/lib/actions/order.actions";
import { formatDateAndTime, shortenId } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderContent = async ({ orderId }: { orderId: string }) => {
  const order = await getOrderById(orderId);
  if (!order) notFound();
  const session = await auth();
  if (session?.user.role != "admin" && order.userId != session?.user.id)
    redirect("/unauthorized");
  const shippingAddress = order.shippingAddress as ShippingAddress;
  return (
    <div className="wrapper">
      <p className="text-xl my-3">Order {shortenId(orderId)}</p>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-full md:w-[65%]">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.paymentMethod}</p>
              {order.isPaid && order.paidAt ? (
                <Badge>Paid at {formatDateAndTime(order.paidAt as Date)}</Badge>
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
                <Badge>
                  Delivered at {formatDateAndTime(order.deliveredAt as Date)}
                </Badge>
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
            <CardContent>
              <Table className="w-full overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems &&
                    order?.orderItems.map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell className="flex gap-3 items-center whitespace-break-spaces">
                          <Image
                            src={item.image}
                            alt="Image"
                            width={50}
                            height={50}
                          />
                          <p className="wrap-break-word">{item.productName}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-center">{item.qty}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-right">${item.price.toString()}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-[32%]">
          <OrderTotal order={order} isAdmin={session?.user.role == "admin"} />
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
