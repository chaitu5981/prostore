import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const body = await request.json();
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shirt",
            },
            unit_amount: body.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: body.orderId,
      },
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${body.orderId}`,
    });
    return NextResponse.json({ url: session.url as string });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
