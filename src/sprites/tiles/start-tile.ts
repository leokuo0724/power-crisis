import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";

export class StartTile extends TileBasic {
  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_5_TILE, index, "start");
    scene.add.existing(this);
  }
}
