"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewDefaultValues } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createUpdateReview,
  getReviewByUser,
} from "@/lib/actions/review.actions";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import Loader from "../Loader";

const ReviewForm = ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [openingForm, startOpeningForm] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: { ...reviewDefaultValues, userId, productId },
  });
  const onSubmit = (values: z.infer<typeof insertReviewSchema>) => {
    startTransition(async () => {
      const res = await createUpdateReview({ ...values });
      if (!res.success) {
        toast.error(res.message);
      } else {
        setOpen(false);
        form.reset({ ...reviewDefaultValues, userId, productId });
        toast.success(res.message);
      }
    });
  };
  const openForm = () =>
    startOpeningForm(async () => {
      const review = await getReviewByUser({ userId, productId });
      if (review) {
        form.setValue("title", review.title);
        form.setValue("description", review.description);
        form.setValue("rating", review.rating.toString());
      }
      setOpen(true);
    });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={openForm}>Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold">Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts with other Customers.
          </DialogDescription>
        </DialogHeader>
        {openingForm ? (
          <Loader size={30} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Give a Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {["1", "2", "3", "4", "5"].map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isPending ? <Loader size={15} /> : "Submit"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ReviewForm;
