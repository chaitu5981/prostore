"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) toast.error(res.message);
    else
      toast(`${item.productName} added to Cart`, {
        action: <Button>Go to Cart</Button>,
        position: "bottom-right",
      });
  };
  return (
    <div>
      {" "}
      <Button className="w-full" onClick={handleAddToCart}>
        <Plus /> Add to Cart
      </Button>
    </div>
  );
};
export default AddToCart;
