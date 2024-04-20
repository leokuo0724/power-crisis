import { ICON_KEYS } from "~/constants/image-keys";

export const CONSUMABLE_RESOURCES = {
  COAL: "coal",
  NATURAL_GAS: "natural_gas",
  OIL: "oil",
  URANIUM: "uranium",
  BIOMASS: "biomass",
} as const;

export type ConsumableResource =
  (typeof CONSUMABLE_RESOURCES)[keyof typeof CONSUMABLE_RESOURCES];

const RENEWABLE_RESOURCES = {
  SOLAR: "solar",
  WIND: "wind",
  HYDRO: "hydro",
} as const;

type RenewableResource =
  (typeof RENEWABLE_RESOURCES)[keyof typeof RENEWABLE_RESOURCES];

export type ResourceType = ConsumableResource | RenewableResource;

export const RESOURCE_TEXTURE_MAP: Record<ConsumableResource, string> = {
  [CONSUMABLE_RESOURCES.COAL]: ICON_KEYS.COAL,
  [CONSUMABLE_RESOURCES.NATURAL_GAS]: ICON_KEYS.NATURAL_GAS,
  [CONSUMABLE_RESOURCES.OIL]: ICON_KEYS.OIL,
  [CONSUMABLE_RESOURCES.URANIUM]: ICON_KEYS.URANIUM,
  [CONSUMABLE_RESOURCES.BIOMASS]: ICON_KEYS.BIOMASS,
};
