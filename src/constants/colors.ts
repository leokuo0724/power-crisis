export const COLORS = {
  WHITE_5: "#f1f6f0",
  WHITE_6: "#d5d6db",
  BLUE_5: "#6C81A1",
  BROWN_4: "#7A5859",
  BROWN_6: "#593E47",
  YELLOW_7: "#A57855",
  DARK_5: "#303843",
  ORANGE_6: "#B55945",
  GREEN_5: "#819447",
} as const;

export type ColorCode = (typeof COLORS)[keyof typeof COLORS];
