import { auth } from "@/auth";
import ShippingAddressForm from "@/components/shipping-address/shipping-address-form";
import { getCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { redirect } from "next/navigation";

const ShippingAddressPage = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const cart = await getCart();
  if (!cart) redirect("/cart");

  const res = await getUserById(session.user.id);
  let user;
  if (res.success) user = res.data;

  return (
    <div className="wrapper flex-center">
      <div className="flex flex-col gap-3">
        <div className="h3-bold">ShippingAddress</div>
        <p>Please enter your address to ship to</p>
        <ShippingAddressForm address={user?.address as ShippingAddress} />
      </div>
    </div>
  );
};
export default ShippingAddressPage;
