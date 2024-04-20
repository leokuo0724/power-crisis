import { ResourceType } from "./resource";

export const POWER_PLANT_TYPES = {
  THERMAL: "thermal",
  NUCLEAR: "nuclear",
  SOLAR: "solar",
  WIND: "wind",
  HYDRO: "hydro",
  BIOMASS: "biomass",
} as const;

export type PowerPlantType =
  (typeof POWER_PLANT_TYPES)[keyof typeof POWER_PLANT_TYPES];

export type PowerPlantInfo = {
  type: PowerPlantType;
  buildCost: number;
  powerGain: {
    resourceType: ResourceType;
    cost: number;
    gain: number;
  };
  // TODO: effects
};
