import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  stock: number;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ZodError = {
  name: string;
  issues: Array<{ message: string }>;
};

export type PrismaError = {
  name: string;
  meta: {
    target: Array<string>;
  };
};

export type GenericError = {
  message: string;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  orderItems : OrderItem[]
};
