import { z } from "zod";
import { formatDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatDecimal(Number(value))),
    "Price should have 2 decimal places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name should have at least 3 characters"),
  slug: z.string().min(3, "Slug should have at least 3 characters"),
  category: z.string().min(3, "Category should have at least 3 characters"),
  brand: z.string().min(3, "Brand should have at least 3 characters"),
  description: z
    .string()
    .min(3, "Description should have at least 3 characters"),
  images: z.array(z.string()).min(1, "Product should have at least 1 image "),
  isFeatured: z.boolean(),
  price: currency,
});

export const signInSchema = z.object({
  email: z.email("Email is invalid"),
  password: z.string().min(6, "Password should be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name should have at least 3 characters"),
    email: z.email("Email is invalid"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password should be at least 6 characters"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
