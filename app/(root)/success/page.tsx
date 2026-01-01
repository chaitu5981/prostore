import { notFound, redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string; orderId: string }>;
}) {
  const { session_id, orderId } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });
  if (!order) notFound();
  const { status } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect(`/order/${orderId}`);
  }

  if (status === "complete") {
    return (
      <div className="flex flex-col gap-5 items-center">
        <p className="text-xl font-semibold">Thanks for the Purchase</p>
        <p>We are processing your order</p>
        <Button asChild>
          <Link href={`/order/${orderId}`}>View Order</Link>
        </Button>
      </div>
    );
  }
}
