import { clsx, type ClassValue } from "clsx";
import { error } from "console";
import { twMerge } from "tailwind-merge";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
  if (error.name == "ZodError") {
    return error.issues.map((i) => i.message).join(". ");
  } else if (error.name == "PrismaClientKnownRequestError") {
    const field = error.meta.target[0];
    return `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
  } else {
    if (typeof error.message == "string") return error.message;
    else return JSON.stringify(error);
  }
};
