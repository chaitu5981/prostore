"use client";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

const PlaceOrderForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm();
  const router = useRouter();
  const onSubmit = async () => {
    startTransition(async () => {
      const res = await createOrder();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      if (res.redirectTo) router.push(res?.redirectTo);
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Button className="w-30">
        {isPending ? (
          <Loader size={10} />
        ) : (
          <span className="flex gap-2">
            <Check />
            Place Order
          </span>
        )}
      </Button>
    </form>
  );
};
export default PlaceOrderForm;
