export type BuffNerfType = {
  type: string;
  operator: "-" | "+";
  value: number;
  desc: string;
};

export type CardEffectTriggerEvent = {
  type:
    | "replenish-coal-resource"
    | "replenish-oil-resource"
    | "replenish-natural_gas-resource"
    | "replenish-uranium-resource"
    | "purify-pollution";
  value: number;
};

export type CardEffect = {
  causedBy: {
    event: "on-dice-rolled" | "on-build-power-plant" | "resource-collected";
    value: any;
  };
  trigger: {
    // 必有一個
    buff?: BuffNerfType;
    event?: CardEffectTriggerEvent;
  };
};

// @ts-ignore
export const CARD_MATCHED_EVENT_DESC_MAP: Record<
  CardEffect["causedBy"]["event"],
  string
> = {
  "on-dice-rolled": "When dice rolls a {}, ",
  "on-build-power-plant": "When building a {} power plant, ",
  "resource-collected": "When collecting {}, ",
};
export const CARD_EFFECT_TRIGGER_DESC_MAP: Record<
  CardEffectTriggerEvent["type"],
  string
> = {
  "replenish-coal-resource": "each coal tile +{} coal",
  "replenish-oil-resource": "each oil tile +{} oil",
  "replenish-natural_gas-resource": "each natural gas tile +{} natural gas",
  "replenish-uranium-resource": "each uranium tile +{} uranium",
  "purify-pollution": "purify {} polluted tile",
};
