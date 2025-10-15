import z from "zod";
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
