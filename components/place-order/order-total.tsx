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

const OrderTotal = ({ order }: { order: Order }) => {
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
        {order.isPaid || (
          <PaypalOrderForm
            price={order.totalPrice}
            orderId={order.id as string}
          />
        )}
      </CardFooter>
    </Card>
  );
};
export default OrderTotal;
