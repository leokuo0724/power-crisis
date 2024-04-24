import { POWER_PLANT_KEYS } from "~/constants/image-keys";
import { ResourceType } from "./resource";
import { CardEffect } from "./effects";

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
  id: string;
  type: PowerPlantType;
  buildCost: number;
  powerGain: {
    resourceType: ResourceType;
    cost: number;
    gain: number;
  };
  effects: CardEffect[];
};

export const POWER_PLANT_TEXTURE_MAP: Record<PowerPlantType, string> = {
  [POWER_PLANT_TYPES.THERMAL]: POWER_PLANT_KEYS.THERMAL,
  [POWER_PLANT_TYPES.NUCLEAR]: POWER_PLANT_KEYS.NUCLEAR,
  [POWER_PLANT_TYPES.SOLAR]: POWER_PLANT_KEYS.SOLAR,
  [POWER_PLANT_TYPES.WIND]: POWER_PLANT_KEYS.WIND,
  [POWER_PLANT_TYPES.HYDRO]: POWER_PLANT_KEYS.HYDRO,
  [POWER_PLANT_TYPES.BIOMASS]: POWER_PLANT_KEYS.BIOMASS,
};
