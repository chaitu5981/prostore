import { email, z } from "zod";
import { formatDecimal } from "./utils";
import { PAYMENT_METHODS, ROLES } from "./constants";

const currency = z.string().refine((value) => {
  return /^\d+(\.\d{2})?$/.test(formatDecimal(Number(value)));
}, "Price should have 2 decimal places");

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name should have at least 3 characters"),
  slug: z.string().min(3, "Slug should have at least 3 characters"),
  category: z.string().min(3, "Category should have at least 3 characters"),
  brand: z.string().min(3, "Brand should have at least 3 characters"),
  description: z
    .string()
    .min(3, "Description should have at least 3 characters"),
  stock: z
    .string()
    .refine((v) => Number(v) > 0, "Stock has to be a positive number"),
  images: z.array(z.string()).min(1, "Product should have at least 1 image "),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

export const signInSchema = z.object({
  email: z.email("Email is invalid"),
  password: z.string().min(6, "Password should have at least 6 characters"),
});

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product Id is required"),
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

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product Id is required"),
  productName: z.string().min(1, "Product Name is required"),
  slug: z.string().min(1, "Product slug is required"),
  qty: z
    .number("Quantity should be a number")
    .nonnegative("Quantity has to be a positive number"),
  image: z.string().min(1, "Product Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  userId: z.string().optional().nullable(),
  cartSessionId: z.string().min(1, "cartSessionId is required"),
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full Name should have at least 3 characters"),
  streetAddress: z
    .string()
    .min(3, "Street Address should have at least 3 characters"),
  city: z.string().min(3, "City should have at least 3 characters"),
  postalCode: z
    .string()
    .min(3, "Postal Code should have at least 3 characters"),
  country: z.string().min(3, "Country should have at least 3 characters"),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment Method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid Payment Method",
  });

export const insertOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  image: z.string(),
  qty: z.number(),
  price: currency,
  slug: z.string(),
});

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid Payment method",
  }),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  emailAddress: z.string(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name should be at least 3 characters long"),
});

export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, "UserId should not be empty"),
  email: z.email("Email is invalid"),
  role: z.enum(ROLES, "Role should be among " + ROLES.join(" ")),
});
