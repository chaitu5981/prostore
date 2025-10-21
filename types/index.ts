import { insertProductSchema } from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  stock: number;
  rating: string;
  numReviews: number;
  createdAt: Date;
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
