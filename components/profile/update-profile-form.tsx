"use client";

import { updateUserProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldGroup } from "../ui/field";
import { Button } from "../ui/button";
import Loader from "../Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useTransition } from "react";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UpdateProfileForm = () => {
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: session.data?.user.name || "",
    },
  });
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) =>
    startTransition(async () => {
      const res = await updateUserProfile(values.name);
      if (res.success) {
        const newSession = {
          ...session.data,
          user: { ...session.data?.user, name: values.name },
        };
        await session.update(newSession);
        router.refresh();
        toast.success(res.message);
      } else toast.error(res.message);
    });
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-5 w-30">
            {isPending ? <Loader size={15} /> : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default UpdateProfileForm;
