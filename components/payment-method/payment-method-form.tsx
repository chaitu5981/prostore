"use client";
import { paymentMethodSchema } from "@/lib/validators";
import { PaymentMethod } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { MoveRight } from "lucide-react";
import Loader from "../Loader";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PaymentMethodForm = ({ paymentMethod }: { paymentMethod: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: paymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const onSubmit = async (data: PaymentMethod) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(data);
      if (res.success) {
        toast.success(res.message);
        router.push("/place-order");
      } else toast.error(res.message);
    });
  };
  return (
    <div className="max-w-xl">
      <p className="my-5"> Please Select a Payment Method</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <RadioGroupItem value={method} id={method} />
                      <Label htmlFor={method}>{method}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" className="mt-5 w-30">
          {isPending ? (
            <Loader size={15} />
          ) : (
            <span className="flex gap-2 items-center">
              <MoveRight />
              Continue
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};
export default PaymentMethodForm;
