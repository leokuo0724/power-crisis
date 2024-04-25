import { ConsumableResource } from "~/types/resource";
import { ResourceTile } from "../tiles/resource-tile";
import { StartTile } from "../tiles/start-tile";
import { boardData } from "../../data/board-data";
import { PowerPlantTile } from "../tiles/power-plant-tile";
import { SurpriseTile } from "../tiles/surprise-tile";
import { TileBasic } from "../tiles/common";
import { EVENTS, GameManager } from "~/states/game-manager";

const MAX_RESOURCE_AMOUNT: Record<ConsumableResource, number> = {
  coal: 13,
  natural_gas: 8,
  oil: 5,
  uranium: 3,
  biomass: Infinity,
};

export class Board extends Phaser.GameObjects.Container {
  private gridMargin: number = 8;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this._initTiles();
    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.RESOURCE_COLLECTED, (index: number) => {
      const tile = this.getTargetTile(index);
      if (tile instanceof ResourceTile) tile.updateAmountText();
    });
    gm.emitter.on(EVENTS.ON_POLLUTED, (amount: number) => {
      let counter = 0;
      for (const tile of this.list) {
        if (counter >= amount) break;
        if (tile instanceof ResourceTile && !tile.resource.isPolluted) {
          tile.setPolluted(true);
          counter++;
        }
      }
    });
    gm.emitter.on(EVENTS.PURIFY_POLLUTION, (amount: number) => {
      let counter = 0;
      for (const tile of this.list) {
        if (counter >= amount) break;
        if (tile instanceof ResourceTile && tile.resource.isPolluted) {
          tile.setPolluted(false);
          counter++;
        }
      }
    });

    this._subscribeReplenishResource("coal");
    this._subscribeReplenishResource("natural_gas");
    this._subscribeReplenishResource("oil");
    this._subscribeReplenishResource("uranium");
  }

  private _initTiles() {
    for (const tile of boardData) {
      let tileInstance;
      switch (tile.tileType) {
        case "start":
          tileInstance = new StartTile(this.scene, 0, 0, tile.index);
          break;
        case "resource":
          tileInstance = new ResourceTile(this.scene, 0, 0, tile.index, {
            tileIndex: tile.index,
            type: tile.resourceType!,
            maxAmount: MAX_RESOURCE_AMOUNT[tile.resourceType!],
            currentAmount: MAX_RESOURCE_AMOUNT[tile.resourceType!],
            isPolluted: false,
          });
          break;
        case "power_plant":
          tileInstance = new PowerPlantTile(this.scene, 0, 0, tile.index);
          break;
        case "surprise":
          tileInstance = new SurpriseTile(this.scene, 0, 0, tile.index);
          break;
      }
      this.add(tileInstance);
      const width = tileInstance.width;
      const height = tileInstance.height;
      let x, y;
      if (tile.index < 5) {
        x = -2.5 * (width + this.gridMargin);
        y = 2.5 * height - tile.index * (this.gridMargin + height);
      } else if (tile.index >= 5 && tile.index < 10) {
        x =
          -2.5 * (width + this.gridMargin) +
          (tile.index - 5) * (this.gridMargin + width);
        y = -2.5 * (height + 2 * this.gridMargin);
      } else if (tile.index >= 10 && tile.index < 15) {
        x = 2.5 * (width + this.gridMargin);
        y =
          -2.5 * (height + 2 * this.gridMargin) +
          (tile.index - 10) * (this.gridMargin + height);
      } else {
        x =
          2.5 * (width + this.gridMargin) -
          (tile.index - 15) * (this.gridMargin + width);
        y = 2.5 * height;
      }
      tileInstance.setPosition(x, y);
    }
    this.list.forEach((obj) => {
      if (obj instanceof TileBasic) obj.y += 2 * this.gridMargin;
    });
  }

  public getTileBoundsByIndex(index: number) {
    const tile = this.list.find(
      (obj) => obj instanceof TileBasic && obj.index === index
    ) as TileBasic;
    if (!tile) throw new Error(`Tile with index ${index} not found`);
    return tile.getBounds();
  }

  public getTargetTile(index: number) {
    return this.list.find(
      (obj) => obj instanceof TileBasic && obj.index === index
    ) as TileBasic;
  }

  private _subscribeReplenishResource(type: ConsumableResource) {
    const gm = GameManager.getInstance();
    gm.emitter.on(`replenish-${type}-resource`, () => {
      this.list.forEach((obj) => {
        if (obj instanceof ResourceTile && obj.resource.type === type) {
          obj.resource.currentAmount = Math.min(
            obj.resource.maxAmount,
            obj.resource.currentAmount + 1
          );
          obj.updateAmountText();
        }
      });
    });
  }
}
