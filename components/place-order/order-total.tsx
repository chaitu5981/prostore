"use client";
import { Order, OrderPrices } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { currencyFormatter } from "@/lib/utils";
import PaypalOrderForm from "../paypal-order/paypal-order-form";
import { Button } from "../ui/button";
import {
  updateCODOrderAsPaid,
  updateOrderAsDelivered,
} from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { useTransition } from "react";

const OrderTotal = ({
  order,
  isAdmin = false,
}: {
  order: Order;
  isAdmin?: boolean;
}) => {
  const [isPending1, startTransition1] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const handleMarkAsPaid = () =>
    startTransition1(async () => {
      const res = await updateCODOrderAsPaid(order.id);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  const handleMarkAsDelivered = () =>
    startTransition2(async () => {
      const res = await updateOrderAsDelivered(order.id);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p>Items</p>
          <p>{currencyFormatter(order.itemsPrice)}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>{currencyFormatter(order.taxPrice)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>{currencyFormatter(order.shippingPrice)}</p>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p>{currencyFormatter(order.totalPrice)}</p>
        </div>
      </CardContent>
      <CardFooter>
        {!order.isPaid && !isAdmin && order.paymentMethod == "PayPal" && (
          <PaypalOrderForm
            price={order.totalPrice}
            orderId={order.id as string}
          />
        )}
        {!order.isPaid &&
          isAdmin &&
          order.paymentMethod == "Cash On Delivery" && (
            <Button onClick={handleMarkAsPaid} disabled={isPending1}>
              {isPending1 ? "Processing..." : "Mark As Paid"}
            </Button>
          )}
        {order.isPaid && isAdmin && !order.isDelivered && (
          <Button onClick={handleMarkAsDelivered} disabled={isPending2}>
            {isPending2 ? "Processing..." : "Mark As Delivered"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default OrderTotal;
