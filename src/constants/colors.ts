export const COLORS = {
  WHITE_5: "#f1f6f0",
  WHITE_6: "#d5d6db",
  WHITE_7: "#BBC3D0",
  BLUE_4: "#96A9C1",
  BLUE_5: "#6C81A1",
  BLUE_6: "#405273",
  BLUE_7: "#14233A",
  BROWN_4: "#7A5859",
  BROWN_6: "#593E47",
  YELLOW_7: "#A57855",
  DARK_5: "#303843",
  ORANGE_6: "#B55945",
  GREEN_5: "#819447",
} as const;

export type ColorCode = (typeof COLORS)[keyof typeof COLORS];
