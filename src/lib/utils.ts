import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ColorCode } from "~/constants/colors";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const hexToDecimal = (colorCode: ColorCode) => {
  const hex = colorCode.substring(1);
  const decimal = parseInt(hex, 16);
  return decimal;
};
