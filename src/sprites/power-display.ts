import { Scene } from "phaser";
import { createEffect } from "solid-js";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { gameManager } from "~/states/game-manager";

export class PowerDisplay extends Phaser.GameObjects.Container {
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

    this.powerNumText = new Phaser.GameObjects.Text(scene, 0, 0, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 200,
      color: COLORS.BLUE_6,
      align: "center",
    }).setOrigin(0.5);
    this.powerNumText.y -= 36;

    this.add([powerText, this.powerNumText]);

    createEffect(() => {
      this.powerNumText.setText(gameManager.currentPower.toString());
    });
  }
}
