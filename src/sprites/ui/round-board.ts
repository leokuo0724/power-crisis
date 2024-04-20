import { Scene } from "phaser";
import { createEffect } from "solid-js";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { gameManager } from "~/states/game-manager";

export class RoundBoard extends Phaser.GameObjects.Container {
  roundText: Phaser.GameObjects.Text;
  // bestRecordText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_6_BOARD_BG
    );
    this.roundText = new Phaser.GameObjects.Text(scene, -120, -30, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 60,
      color: COLORS.WHITE_5,
    });
    this.add([bg, this.roundText]);
    this.setSize(bg.width, bg.height);

    createEffect(() => {
      this.roundText.setText(`ROUND ${gameManager.round}`);
    });
  }
}
