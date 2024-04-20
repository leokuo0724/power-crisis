import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";

export class SurpriseTile extends TileBasic {
  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.DARK_5_TILE, index, "surprise");
    scene.add.existing(this);
  }
}
