"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatError } from "@/lib/utils";
import {
  approvePaypalOrder,
  createPaypalOrder,
} from "@/lib/actions/order.actions";

const PaypalOrderForm = ({
  price,
  orderId,
}: {
  price: string;
  orderId: string;
}) => {
  console.log("first");
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    currency: "USD",
    components: "buttons",
  };
  const router = useRouter();
  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(orderId, price);
    if (!res.success) toast.error(res.message);
    return res.orderID;
  };

  const approveOrder = async (data: {
    orderID: string;
    payerID?: string | null;
  }) => {
    const res = await approvePaypalOrder(orderId, data.orderID);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };
  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={handleCreatePaypalOrder}
          onApprove={approveOrder}
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};
export default PaypalOrderForm;
