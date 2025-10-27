import CartTable from "@/components/cart/cart-table";
import { getCart } from "@/lib/actions/cart.actions";
import { redirect } from "next/navigation";

const CartPage = async () => {
  const cart = await getCart();
  if (!cart) redirect("/");
  return (
    <div className="wrapper">
      <div className="h3-bold">Shopping Cart</div>
      <CartTable cart={cart} />
    </div>
  );
};
export default CartPage;
