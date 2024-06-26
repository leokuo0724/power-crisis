import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { PowerPlantCard } from "../cards/power-plant-card";

export class PowerPlantTile extends TileBasic {
  powerPlantCard: PowerPlantCard | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_5_TILE, index, "power_plant");
    scene.add.existing(this);

    const text = new Phaser.GameObjects.Text(this.scene, 0, 0, "POWER\nPLANT", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
      align: "center",
    }).setOrigin(0.5);
    this.add(text);
  }
}
