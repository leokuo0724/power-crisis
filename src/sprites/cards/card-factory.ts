import { GameManager } from "~/states/game-manager";
import {
  BuffNerfType,
  CardEffect,
  CardEffectTriggerEvent,
} from "~/types/effects";
import {
  POWER_PLANT_TYPES,
  PowerPlantInfo,
  PowerPlantType,
} from "~/types/power-plant";
import { ResourceType } from "~/types/resource";

export class CardFactory {
  private static instance: CardFactory;
  private constructor() {}
  static getInstance(): CardFactory {
    if (!CardFactory.instance) {
      CardFactory.instance = new CardFactory();
    }
    return CardFactory.instance;
  }

  private powerGenerateBase: Record<PowerPlantType, number> = {
    nuclear: 4,
    thermal: 3,
    hydro: 3,
    wind: 2,
    biomass: 2,
    solar: 1,
  };
  // Math.floor(factor * round)
  private powerGenerateRoundFactor: Record<PowerPlantType, number> = {
    nuclear: 1,
    thermal: 0.8,
    hydro: 0.8,
    wind: 0.6,
    biomass: 0.6,
    solar: 0.4,
  };

  private buildCostBase: Record<PowerPlantType, number> = {
    nuclear: 2,
    thermal: 1,
    hydro: 3,
    wind: 2,
    biomass: 2,
    solar: 1,
  };
  private buildCostRoundFactor: Record<PowerPlantType, number> = {
    nuclear: 0.6,
    thermal: 0.5,
    hydro: 0.6,
    wind: 0.5,
    biomass: 0.5,
    solar: 0.3,
  };

  // resource cost for generating power
  private resourceCostBase: Record<PowerPlantType, number> = {
    nuclear: 1,
    thermal: 1,
    hydro: 0,
    wind: 0,
    biomass: 1,
    solar: 0,
  };
  private resourceCostRoundFactor: Record<PowerPlantType, number> = {
    nuclear: 0.2,
    thermal: 0.5,
    hydro: 0,
    wind: 0,
    biomass: 0.3,
    solar: 0,
  };

  generatePowerPlantInfo(): PowerPlantInfo {
    const gm = GameManager.getInstance();
    const type = Phaser.Math.RND.pick(Object.values(POWER_PLANT_TYPES));
    const buildCost =
      this.buildCostBase[type] +
      Math.floor(this.buildCostRoundFactor[type] * (gm.round - 1));
    const gain =
      this.powerGenerateBase[type] +
      Math.floor(this.powerGenerateRoundFactor[type] * (gm.round - 1));
    const cost =
      this.resourceCostBase[type] +
      Math.floor(this.resourceCostRoundFactor[type] * (gm.round - 1));

    return {
      id: Phaser.Math.RND.uuid(),
      type,
      buildCost,
      powerGain: {
        gain,
        cost,
        resourceType: this._getResourceType(type),
      },
      effects: this._getEffects(type),
    };
  }

  private _getResourceType(type: PowerPlantType): ResourceType {
    switch (type) {
      case "biomass":
        return "biomass";
      case "nuclear":
        return "uranium";
      case "solar":
        return "solar";
      case "wind":
        return "wind";
      case "hydro":
        return "hydro";
      case "thermal":
        return Phaser.Math.RND.pick(["coal", "oil", "natural_gas"]);
    }
  }
  private _getEffects(type: PowerPlantType): CardEffect[] {
    const gm = GameManager.getInstance();
    const result: CardEffect[] = [];
    const casedByEvent: CardEffect["causedBy"]["event"] = Phaser.Math.RND.pick([
      "on-dice-rolled",
      "on-build-power-plant",
      "resource-collected",
    ]);

    if (type === "biomass") {
      result.push({
        causedBy: {
          event: casedByEvent,
          value: this._getCasedByEventValue(casedByEvent),
        },
        trigger: {
          event: {
            type: "purify-pollution",
            value: 1 * Math.floor(gm.round * 0.1),
          },
        },
      });
    }

    const targetEffects = gm.round >= 10 ? 2 : 1;
    while (result.length < targetEffects) {
      result.push({
        causedBy: {
          event: casedByEvent,
          value: this._getCasedByEventValue(casedByEvent),
        },
        trigger: this._getTriggerEffect(),
      });
    }
    return result;
  }
  private _getTriggerEffect(): CardEffect["trigger"] {
    const gm = GameManager.getInstance();

    let event, buff;
    const isEvent = Phaser.Math.RND.pick(["event", "buff", "buff"]) === "event";
    if (isEvent) {
      event = {
        type: Phaser.Math.RND.pick([
          "replenish-coal-resource",
          "replenish-oil-resource",
          "replenish-natural_gas-resource",
          "replenish-uranium-resource",
        ]),
        value: 1,
      } as CardEffectTriggerEvent;
    } else {
      buff = {
        type: "currentPower",
        operator: "+",
        value: 1 + Math.floor(gm.round * 0.2),
        desc: "current power",
      } as BuffNerfType;
    }

    return { event, buff };
  }
  private _getCasedByEventValue(event: CardEffect["causedBy"]["event"]): any {
    switch (event) {
      case "on-dice-rolled":
        return Phaser.Math.RND.pick([1, 2, 3]);
      case "on-build-power-plant":
        return Phaser.Math.RND.pick(Object.values(POWER_PLANT_TYPES));
      case "resource-collected":
        return Phaser.Math.RND.pick(["coal", "oil", "natural_gas", "uranium"]);
    }
  }
}
