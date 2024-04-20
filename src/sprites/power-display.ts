import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";

export class PowerDisplay extends Phaser.GameObjects.Container {
  private power: number = 20;
  private powerNumText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const powerText = new Phaser.GameObjects.Text(scene, 0, 0, "POWER", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 60,
      color: COLORS.BLUE_6,
      align: "center",
    }).setOrigin(0.5);
    powerText.y += 72;

    this.powerNumText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      this.power.toString(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 200,
        color: COLORS.BLUE_6,
        align: "center",
      }
    ).setOrigin(0.5);
    this.powerNumText.y -= 36;

    this.add([powerText, this.powerNumText]);
  }
}