import CartTable from "@/components/cart/cart-table";
import { getCart } from "@/lib/actions/cart.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Cart",
};
const CartPage = async () => {
  const cart = await getCart();
  if (!cart)
    return (
      <div className="wrapper">
        Your Cart is empty.{"  "}
        <Link href="/" className="underline text-blue-500">
          Continue Shopping
        </Link>
      </div>
    );
  return (
    <div className="wrapper">
      <div className="h3-bold">Shopping Cart</div>
      <CartTable cart={cart} />
    </div>
  );
};
export default CartPage;
