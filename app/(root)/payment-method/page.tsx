import { auth } from "@/auth";
import Loader from "@/components/Loader";
import PaymentMethodForm from "@/components/payment-method/payment-method-form";
import CheckoutSteps from "@/components/shared/checkout/checkout-steps";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@/types";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const PaymentMethodContent = async () => {
  const session = await auth();
  if (!session) return null;
  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  return (
    <div className="wrapper">
      <Button asChild color="gray">
        <Link href="/shipping-address">
          <div className="flex gap-2 items-center">
            <MoveLeft />
            Back
          </div>
        </Link>
      </Button>
      <div className="flex md:flex-col items-start md:items-center">
        <CheckoutSteps current={3} />
        <PaymentMethodForm paymentMethod={user?.paymentMethod as string} />
      </div>
    </div>
  );
};
const PaymentMethodPage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <PaymentMethodContent />
    </Suspense>
  );
};
export default PaymentMethodPage;
