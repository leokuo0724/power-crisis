import { PowerPlantTile } from "~/sprites/tiles/power-plant-tile";
import { ResourceMetadata } from "~/sprites/tiles/resource-tile";
import { ConsumableResource } from "~/types/resource";

export const EVENTS = {
  NEXT_ROLL_ENABLED: "next-roll-enabled",
  CURRENT_TILE_INDEX_UPDATED: "current-tile-index-updated",
  CURRENT_TILE_RESOURCE_METADATA_UPDATED:
    "current-tile-resource-metadata-updated",
  CURRENT_TILE_POWER_PLANT_TILE_UPDATED:
    "current-tile-power-plant-tile-updated",
  RESOURCE_STORAGE_UPDATED: "resource-storage-updated",
  POWER_UPDATED: "power-updated",
  RESOURCE_COLLECTED: "resource-collected",
  BUILD_MODE_UPDATED: "build-mode-updated",
  SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED:
    "selected-power-plant-to-build-id-updated",
  ON_BUILD_POWER_PLANT: "on-build-power-plant",
};

export class GameManager {
  round: number = 1;
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
  currentPower: number = 20;
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
    amount: number,
    max?: number
  ) {
    this.resourceStorage[resourceType].current = amount;
    if (max !== undefined) this.resourceStorage[resourceType].max = max;
    this.emitter.emit(EVENTS.RESOURCE_STORAGE_UPDATED);
  }
  collectResource() {
    const metadata = this.currentTileResourceMetadata;
    if (!metadata) throw new Error("No resource to collect");

    // cost by power
    this.currentPower -= this.costUnit[metadata.type];
    this.emitter.emit(EVENTS.POWER_UPDATED);

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

    metadata.currentAmount =
      this.collectUnit[metadata.type] >= metadata.currentAmount
        ? 0
        : metadata.currentAmount - this.collectUnit[metadata.type];
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
    this.emitter.emit(
      EVENTS.ON_BUILD_POWER_PLANT,
      this.selectedPowerPlantToBuildId,
      this.currentTileIndex
    );
    this.updateBuildMode(false);
    this.updateCurrentTilePowerPlantTile(null);
  }
}
