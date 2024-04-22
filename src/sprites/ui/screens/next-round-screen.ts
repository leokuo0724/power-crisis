import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { Button } from "../shared/button";
import { EVENTS, GameManager } from "~/states/game-manager";
import { DEPTH } from "~/constants/depth";

export class NextRoundScreen extends Phaser.GameObjects.Container {
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
    const titleText = new Phaser.GameObjects.Text(scene, 0, -240, "CONGRATS", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 60,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    const descriptionText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      `You have reached the target power\nand moved to round ${gm.round}\n\nNext round target: ${gm.targetPower}`,
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 60,
        color: COLORS.WHITE_5,
        align: "center",
      }
    ).setOrigin(0.5);

    const nextButton = new NextButton(scene, 0, 320);
    nextButton.onClick = () => {
      this.setVisible(false);
      gm.togglePolicyScreen(true);
    };

    this.add([bg, titleText, descriptionText, nextButton])
      .setDepth(DEPTH.RESULT_SCREEN)
      .setVisible(false);
    gm.emitter.on(EVENTS.NEXT_ROUND_UPDATED, () => {
      this.setVisible(true);
    });
  }
}

class NextButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "NEXT", "white");
  }
  public onClick(): void {}
}
