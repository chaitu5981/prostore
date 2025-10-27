"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const existItem = cart?.items.find((x) => x.productId == item.productId);
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const res = await addItemToCart(item);
      if (!res.success) toast.error(res.message);
      else
        toast.success(res.message, {
          action: <Button>Go to Cart</Button>,
          position: "bottom-right",
        });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };
  const handleRemoveFromCart = async () => {
    try {
      setRemoving(true);
      const res = await removeItemFromCart(item.productId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setRemoving(false);
    }
  };
  if (existItem)
    return (
      <div className="flex-center gap-2">
        <Button onClick={handleRemoveFromCart} className="w-12">
          {removing ? <Loader size={15} /> : <Minus />}
        </Button>
        {existItem.qty}
        <Button onClick={handleAddToCart} className="w-12">
          {adding ? <Loader size={15} /> : <Plus />}
        </Button>
      </div>
    );
  return (
    <div>
      {" "}
      <Button className="w-full" onClick={handleAddToCart}>
        {adding ? (
          <Loader size={20} />
        ) : (
          <div className="flex gap-2 items-center">
            <Plus /> Add to Cart
          </div>
        )}
      </Button>
    </div>
  );
};
export default AddToCart;
