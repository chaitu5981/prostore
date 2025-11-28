import { CartItem, GenericError, PrismaError, ZodError } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
type ErrorType = ZodError | PrismaError | GenericError | Error | unknown;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const convertToPlainObject = <T>(obj: T[]): T[] => {
  return JSON.parse(JSON.stringify(obj));
};

export const formatDecimal = (value: number): string => {
  const [int, decimal] = value.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
};

export const formatError = (error: ErrorType): string => {
  if (
    typeof error == "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ZodError"
  ) {
    const zodError = error as ZodError;
    return zodError.issues.map((i) => i.message).join(". ");
  } else if (
    typeof error == "object" &&
    error !== null &&
    "name" in error &&
    error.name == "PrismaClientKnownRequestError"
  ) {
    const prismaError = error as PrismaError;
    const field = prismaError.meta.target[0];
    return `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  } else if (typeof error == "object" && error !== null && "message" in error) {
    const genericError = error as GenericError;
    return genericError.message;
  } else return JSON.stringify(error);
};

export const round2 = (value: number | string): number => {
  const roundedValue = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  return roundedValue;
};

export const getCartQty = (items: CartItem[]): number =>
  items.reduce((acc, item) => acc + item.qty, 0);

export const currencyFormatter = (value: string | number): string =>
  new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 2,
  }).format(Number(value));

export const calcPrices = (cartItems: CartItem[]) => {
  const itemsPrice = round2(
    cartItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice < 100 ? 10 : 0);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};
