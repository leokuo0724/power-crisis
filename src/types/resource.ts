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
