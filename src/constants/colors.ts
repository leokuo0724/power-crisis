export const COLORS = {
  WHITE_5: "#f1f6f0",
  WHITE_6: "#d5d6db",
  BLUE_5: "#6C81A1",
} as const;

export type ColorCode = (typeof COLORS)[keyof typeof COLORS];
