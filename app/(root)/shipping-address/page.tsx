import { auth } from "@/auth";
import Loader from "@/components/Loader";
import CheckoutSteps from "@/components/shared/checkout/checkout-steps";
import ShippingAddressForm from "@/components/shipping-address/shipping-address-form";
import { getCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ShippingAddressContent = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const cart = await getCart();
  if (!cart) redirect("/cart");

  const user = await getUserById(session.user.id);

  return (
    <div className="wrapper flex  md:flex-col items-start md:items-center gap-5">
      <CheckoutSteps current={2} />

      <div className="flex flex-col gap-3">
        <div className="h3-bold">ShippingAddress</div>
        <p>Please enter your address to ship to</p>
        <ShippingAddressForm address={user?.address as ShippingAddress} />
      </div>
    </div>
  );
};

const ShippingAddressPage = () => {
  return (
    <Suspense fallback={<Loader size={50} />}>
      <ShippingAddressContent />
    </Suspense>
  );
};
export default ShippingAddressPage;
