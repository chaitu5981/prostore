import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const event = Stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  if (event.type == "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Payment Intent", paymentIntent);
    return NextResponse.json({
      message: "Updated Order to Paid",
    });
  } else
    NextResponse.json({
      message: "Payment not successfull",
    });
}
