export type TileType = "start" | "resource" | "power_plant";

export interface TileBasic {
  index: number;
  tileType: TileType;
}
