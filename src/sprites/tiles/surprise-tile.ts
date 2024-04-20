import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";
import { IMAGE_KEYS, ICON_KEYS } from "~/constants/image-keys";

export class SurpriseTile extends TileBasic {
  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.DARK_5_TILE, index, "surprise");
    scene.add.existing(this);

    const image = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.SURPRISE
    );
    this.add(image);
  }
}
