import { ConsumableResource } from "~/types/resource";
import { TileType } from "../tiles/common";

type BoardData = TileData[];
type TileData = {
  index: number;
  tileType: TileType;
  resourceType?: ConsumableResource;
};

export const boardData: BoardData = [
  { index: 0, tileType: "start" },
  { index: 1, tileType: "resource", resourceType: "coal" },
  { index: 2, tileType: "resource", resourceType: "oil" },
  { index: 3, tileType: "resource", resourceType: "natural_gas" },
  { index: 4, tileType: "resource", resourceType: "coal" },
  { index: 5, tileType: "power_plant" },
  { index: 6, tileType: "resource", resourceType: "oil" },
  { index: 7, tileType: "resource", resourceType: "coal" },
  { index: 8, tileType: "surprise" },
  { index: 9, tileType: "resource", resourceType: "uranium" },
  { index: 10, tileType: "power_plant" },
  { index: 11, tileType: "resource", resourceType: "natural_gas" },
  { index: 12, tileType: "resource", resourceType: "biomass" },
  { index: 13, tileType: "resource", resourceType: "coal" },
  { index: 14, tileType: "resource", resourceType: "oil" },
  { index: 15, tileType: "power_plant" },
  { index: 16, tileType: "resource", resourceType: "coal" },
  { index: 17, tileType: "resource", resourceType: "natural_gas" },
  { index: 18, tileType: "surprise" },
  { index: 19, tileType: "resource", resourceType: "uranium" },
];
