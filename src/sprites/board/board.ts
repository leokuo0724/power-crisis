import { ConsumableResource } from "~/types/resource";
import { ResourceTileSprite } from "../tiles/resource-tile";
import { StartTile } from "../tiles/start-tile";
import { boardData } from "./board-data";
import { PowerPlantTile } from "../tiles/power-plant-tile";
import { SurpriseTile } from "../tiles/surprise-tile";
import { TileBasic } from "../tiles/common";

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
  }

  private _initTiles() {
    for (const tile of boardData) {
      let tileInstance;
      switch (tile.tileType) {
        case "start":
          tileInstance = new StartTile(this.scene, 0, 0, tile.index);
          break;
        case "resource":
          tileInstance = new ResourceTileSprite(this.scene, 0, 0, tile.index, {
            type: tile.resourceType!,
            maxAmount: MAX_RESOURCE_AMOUNT[tile.resourceType!],
            currentAmount: MAX_RESOURCE_AMOUNT[tile.resourceType!],
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
}
