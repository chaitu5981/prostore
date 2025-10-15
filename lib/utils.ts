import { clsx, type ClassValue } from "clsx";
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
