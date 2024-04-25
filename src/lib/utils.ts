import { ColorCode } from "~/constants/colors";

export const hexToDecimal = (colorCode: ColorCode) => {
  const hex = colorCode.substring(1);
  const decimal = parseInt(hex, 16);
  return decimal;
};
