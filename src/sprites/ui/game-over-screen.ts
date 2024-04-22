import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { DEPTH } from "~/constants/depth";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { EVENTS, GameManager } from "~/states/game-manager";
import { Button } from "./shared/button";

export class GameOverScreen extends Phaser.GameObjects.Container {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const gm = GameManager.getInstance();
    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_7_SCREEN_BG
    );
    const titleText = new Phaser.GameObjects.Text(scene, 0, -240, "GAME OVER", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 60,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    const descriptionText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      `You have successfully navigated the world of\n energy resources and survived for ${gm.round} rounds.`,
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 60,
        color: COLORS.WHITE_5,
        align: "center",
      }
    ).setOrigin(0.5);
    const restartButton = new RestartButton(scene, 0, 320);
    this.add([bg, titleText, descriptionText, restartButton])
      .setDepth(DEPTH.RESULT_SCREEN)
      .setVisible(false);

    gm.emitter.on(EVENTS.ON_GAME_OVER, () => {
      this.setVisible(true);
    });
  }
}

class RestartButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "RESTART", "white");
  }
  public onClick(): void {
    window.location.reload();
  }
}
