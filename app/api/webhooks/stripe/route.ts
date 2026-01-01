import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const event = Stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  if (event.type == "checkout.session.completed") {
    const { object } = event.data;
    if (object.metadata) {
      await updateOrderToPaid(object.metadata.orderId, {
        id: object.id,
        status: "COMPLETED",
        emailAddress: object.customer_details?.email
          ? object.customer_details.email
          : "",
        pricePaid: object.amount_total
          ? (object.amount_total / 100).toString()
          : "",
      });
    }
    return NextResponse.json({
      message: "Updated Order to Paid",
    });
  } else
    NextResponse.json({
      message: "Payment not successful",
    });
}
