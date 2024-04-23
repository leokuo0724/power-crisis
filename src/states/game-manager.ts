import { PowerPlantTile } from "~/sprites/tiles/power-plant-tile";
import { ResourceMetadata } from "~/sprites/tiles/resource-tile";
import { BuffNerfType } from "~/types/effects";
import { ConsumableResource } from "~/types/resource";

export const EVENTS = {
  NEXT_ROLL_ENABLED: "next-roll-enabled",
  CURRENT_TILE_INDEX_UPDATED: "current-tile-index-updated",
  CURRENT_TILE_RESOURCE_METADATA_UPDATED:
    "current-tile-resource-metadata-updated",
  CURRENT_TILE_POWER_PLANT_TILE_UPDATED:
    "current-tile-power-plant-tile-updated",

  RESOURCE_STORAGE_UPDATED: "resource-storage-updated",
  COLLECT_UNIT_UPDATED: "collect-unit-updated",
  COST_UNIT_UPDATED: "cost-unit-updated",
  POWER_UPDATED: "power-updated",
  TARGET_POWER_UPDATED: "target-power-updated",

  RESOURCE_COLLECTED: "resource-collected",
  BUILD_MODE_UPDATED: "build-mode-updated",
  SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED:
    "selected-power-plant-to-build-id-updated",
  ON_BUILD_POWER_PLANT: "on-build-power-plant",
  NEXT_ROUND_UPDATED: "next-round-updated",
  ON_GAME_OVER: "on-game-over",

  POLLUTION_UPDATED: "pollution-updated",

  TOGGLE_POLICY_SCREEN: "toggle-policy-screen",
  TOGGLE_CARD_SELECT_SCREEN: "toggle-card-select-screen",
  TOGGLE_GENERATE_POWER_DIALOG: "toggle-generate-power-dialog",
};

export class GameManager {
  readonly INIT_POWER: number = 20;
  readonly MAX_POWER_PLANT_CARD: number = 4;

  round: number = 1;
  targetPower: number = 5; // power to reach to the next round
  currentTileIndex: number = 0;
  currentTileResourceMetadata: ResourceMetadata | null = null;
  currentTilePowerPlantTile: PowerPlantTile | null = null;
  costUnit: Record<ConsumableResource, number> = {
    coal: 1,
    natural_gas: 1,
    oil: 1,
    uranium: 1,
    biomass: 0,
  };
  collectUnit: Record<ConsumableResource, number> = {
    coal: 1,
    natural_gas: 1,
    oil: 1,
    uranium: 1,
    biomass: Infinity,
  };
  resourceStorage: Record<
    ConsumableResource,
    { current: number; max: number }
  > = {
    coal: { current: 0, max: 5 },
    natural_gas: { current: 0, max: 5 },
    oil: { current: 0, max: 5 },
    uranium: { current: 0, max: 3 },
    biomass: { current: 0, max: 3 },
  };
  pollution: {
    carbonEmissions: number;
    nuclearWaste: number;
  } = {
    carbonEmissions: 0,
    nuclearWaste: 0,
  };
  currentPower: number = this.INIT_POWER;
  isNextRollEnabled: boolean = false;

  isBuildMode: boolean = false;
  selectedPowerPlantToBuildId: string | null = null;

  emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

  private static instance: GameManager;
  private constructor() {}
  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setNextRollEnabled(enabled: boolean) {
    this.isNextRollEnabled = enabled;
    this.emitter.emit(EVENTS.NEXT_ROLL_ENABLED, enabled);
  }
  updateTileIndex(index: number) {
    this.currentTileIndex = index;
    this.emitter.emit(EVENTS.CURRENT_TILE_INDEX_UPDATED);
  }
  updateCurrentTileResourceMetadata(metadata: ResourceMetadata | null) {
    this.currentTileResourceMetadata = metadata;
    this.emitter.emit(EVENTS.CURRENT_TILE_RESOURCE_METADATA_UPDATED);
  }
  updateResourceStorage(
    resourceType: ConsumableResource,
    current?: number,
    max?: number
  ) {
    if (max !== undefined) this.resourceStorage[resourceType].max = max;
    if (current !== undefined)
      this.resourceStorage[resourceType].current = Math.min(
        Math.max(0, current),
        this.resourceStorage[resourceType].max
      );
    this.emitter.emit(EVENTS.RESOURCE_STORAGE_UPDATED);
  }
  updatePower(value: number) {
    this.currentPower = value;
    this.emitter.emit(EVENTS.POWER_UPDATED);
  }
  collectResource() {
    const metadata = this.currentTileResourceMetadata;
    if (!metadata) throw new Error("No resource to collect");

    // cost by power
    this.updatePower(this.currentPower - this.costUnit[metadata.type]);

    // add resource to storage
    const collectedAmount = Math.min(
      metadata.currentAmount,
      this.collectUnit[metadata.type]
    );
    this.resourceStorage[metadata.type].current = Math.min(
      this.resourceStorage[metadata.type].current + collectedAmount,
      this.resourceStorage[metadata.type].max
    );
    this.emitter.emit(EVENTS.RESOURCE_STORAGE_UPDATED);

    if (metadata.currentAmount !== Infinity) {
      metadata.currentAmount =
        this.collectUnit[metadata.type] >= metadata.currentAmount
          ? 0
          : metadata.currentAmount - this.collectUnit[metadata.type];
    }
    // pass the tile index and collected amount to the event
    this.emitter.emit(EVENTS.RESOURCE_COLLECTED, metadata.tileIndex);

    this.updateCurrentTileResourceMetadata(null);
    this.setNextRollEnabled(true);
  }
  updateCurrentTilePowerPlantTile(tile: PowerPlantTile | null) {
    this.currentTilePowerPlantTile = tile;
    this.emitter.emit(EVENTS.CURRENT_TILE_POWER_PLANT_TILE_UPDATED);
  }
  updateBuildMode(isBuildMode: boolean, id?: string) {
    this.isBuildMode = isBuildMode;
    this.emitter.emit(EVENTS.BUILD_MODE_UPDATED);
    if (id) this.updateSelectedPowerPlantToBuildId(id);
  }
  updateSelectedPowerPlantToBuildId(id: string) {
    this.selectedPowerPlantToBuildId = id;
    this.emitter.emit(EVENTS.SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED, id);
  }
  onBuildPowerPlant() {
    // Remove card instance and effects
    const currentCard = this.currentTilePowerPlantTile?.powerPlantCard;
    if (currentCard) {
      currentCard.destroy();
      // TODO: remove effects if needed
    }

    this.emitter.emit(
      EVENTS.ON_BUILD_POWER_PLANT,
      this.selectedPowerPlantToBuildId,
      this.currentTileIndex
    );
    this.updateBuildMode(false);
    this.updateCurrentTilePowerPlantTile(null);
  }
  setNextRound(enabled: boolean) {
    if (enabled) {
      this.round++;

      this.targetPower += 5;
      this.emitter.emit(EVENTS.TARGET_POWER_UPDATED);
      this.emitter.emit(EVENTS.NEXT_ROUND_UPDATED);
    } else {
      this.emitter.emit(EVENTS.ON_GAME_OVER);
    }
  }
  togglePolicyScreen(visible: boolean) {
    this.emitter.emit(EVENTS.TOGGLE_POLICY_SCREEN, visible);
  }
  selectPolicy(buff: BuffNerfType, nerf: BuffNerfType) {
    // effects
    this._doEffect(buff);
    this._doEffect(nerf);
    this.emitter.emit(EVENTS.POWER_UPDATED);
    this.emitter.emit(EVENTS.TARGET_POWER_UPDATED);
    this.emitter.emit(EVENTS.COLLECT_UNIT_UPDATED);
    this.emitter.emit(EVENTS.RESOURCE_STORAGE_UPDATED);

    // close the policy screen
    this.togglePolicyScreen(false);
  }
  private _doEffect(bnt: BuffNerfType) {
    const { type, operator, value } = bnt;
    const props: string[] = type.split(".");
    if (props.length === 1) {
      operator === "+" // @ts-ignore
        ? (this[props[0]] += bnt.value) // @ts-ignore
        : (this[props[0]] = Math.max(this[props[0]] - bnt.value, 0));
    } else if (props.length === 2) {
      // @ts-ignore
      operator === "+" // @ts-ignore
        ? (this[props[0]][props[1]] += bnt.value) // @ts-ignore
        : (this[props[0]][props[1]] = Math.max(
            // @ts-ignore
            this[props[0]][props[1]] - bnt.value,
            0
          ));
    } else if (props.length === 3) {
      // @ts-ignore
      operator === "+" // @ts-ignore
        ? (this[props[0]][props[1]][props[2]] += bnt.value) // @ts-ignore
        : (this[props[0]][props[1]][props[2]] = Math.max(
            // @ts-ignore
            this[props[0]][props[1]][props[2]] - bnt.value,
            0
          ));
    }
  }
  toggleCardSelectScreen(visible: boolean) {
    this.emitter.emit(EVENTS.TOGGLE_CARD_SELECT_SCREEN, visible);
  }
  toggleGeneratePowerDialog(visible: boolean) {
    this.emitter.emit(EVENTS.TOGGLE_GENERATE_POWER_DIALOG, visible);
  }
  onGeneratePower() {
    const ppTile = this.currentTilePowerPlantTile;
    if (!ppTile?.powerPlantCard)
      throw new Error("No power plant tile to generate power");
    // cost by resource
    const resourceType = ppTile.powerPlantCard.info.powerGain.resourceType;
    if (
      resourceType === "coal" ||
      resourceType === "natural_gas" ||
      resourceType === "oil" ||
      resourceType === "uranium" ||
      resourceType === "biomass"
    ) {
      this.updateResourceStorage(
        resourceType,
        this.resourceStorage[resourceType].current -
          ppTile.powerPlantCard.info.powerGain.cost
      );

      // update pollution
      const carbonType = ["natural_gas", "oil", "coal"];
      if (carbonType.includes(resourceType)) {
        const polluteNum = carbonType.indexOf(resourceType) + 1;
        this.updatePollution(
          "carbon",
          this.pollution.carbonEmissions + polluteNum
        );
      } else if (resourceType === "uranium") {
        this.updatePollution("nuclear", this.pollution.nuclearWaste + 1);
      }
    }
    // gain power
    this.updatePower(
      this.currentPower + ppTile.powerPlantCard.info.powerGain.gain
    );
    this.toggleGeneratePowerDialog(false);
    this.setNextRollEnabled(true);
    this.updateCurrentTilePowerPlantTile(null);
  }
  updatePollution(type: "carbon" | "nuclear", amount: number) {
    if (type === "carbon") {
      this.pollution.carbonEmissions = amount;
    } else {
      this.pollution.nuclearWaste = amount;
    }
    this.emitter.emit(EVENTS.POLLUTION_UPDATED);
  }
}
