import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic, TileType } from "./common";

export class StartTile extends Phaser.GameObjects.Sprite implements TileBasic {
  readonly index: number;
  readonly tileType: TileType = "start";

  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_5_TILE);
    scene.add.existing(this);

    this.index = index;
  }
}
