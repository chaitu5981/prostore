import { GenericError, PrismaError, ZodError } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
type ErrorType = ZodError | PrismaError | GenericError | Error;
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
  if ("name" in error && error.name === "ZodError") {
    const zodError = error as ZodError;
    return zodError.issues.map((i) => i.message).join(". ");
  } else if ("name" in error && error.name == "PrismaClientKnownRequestError") {
    const prismaError = error as PrismaError;
    const field = prismaError.meta.target[0];
    return `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  } else if ("message" in error) {
    const genericError = error as GenericError;
    return genericError.message;
  } else return JSON.stringify(error);
};
