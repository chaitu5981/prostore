"use client";
import { ShippingAddress } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validators";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { MoveRight } from "lucide-react";
const ShippingAddressForm = ({ address }: { address?: ShippingAddress }) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || {
      fullName: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: ShippingAddress) => {
    startTransition(async () => {
      const res = await updateUserAddress(data);
      if (res.success) {
        toast.success(res.message);
        router.push("/payment-method");
      } else toast.error(res.message);
    });
  };
  return (
    <div className="max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="full">
        <FieldGroup>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-full-name">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-full-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Full Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="streetAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-street">
                  Street Address
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-street"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Street Address"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-city">City</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-city"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter City"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-code">Postal Code</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-code"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Postal Code"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-country">Country</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-country"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Country"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
export default ShippingAddressForm;
