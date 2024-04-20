import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";
import { ATLAS_KEYS, ICON_KEYS } from "~/constants/atlas-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";

export class StartTile extends TileBasic {
  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_5_TILE, index, "start");
    scene.add.existing(this);

    const image = new Phaser.GameObjects.Image(
      this.scene,
      0,
      -12,
      ATLAS_KEYS.ICONS,
      ICON_KEYS.UP_ARROW
    );

    const text = new Phaser.GameObjects.Text(this.scene, 0, 18, "START", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
      align: "center",
    }).setOrigin(0.5);

    this.add([image, text]);
  }
}
