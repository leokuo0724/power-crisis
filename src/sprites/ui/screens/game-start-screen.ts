import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { DEPTH } from "~/constants/depth";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { Button } from "../shared/button";

export class GameStartScreen extends Phaser.GameObjects.Container {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.START_BG
    );
    const titleText = new Phaser.GameObjects.Text(
      scene,
      0,
      -280,
      "POWER CRISIS",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 132,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    const descriptionText = new Phaser.GameObjects.Text(
      scene,
      0,
      24,
      "In a world facing darkness, energy grids are failing.\nAs a leader, your mission is to manage resources, build power plants, and innovate to keep the lights on. Every decision counts. Lead your country to a brighter future.",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 48,
        color: COLORS.WHITE_5,
        align: "center",
        lineSpacing: 20,
      }
    )
      .setOrigin(0.5)
      .setWordWrapWidth(1220);
    const startButton = new StartButton(scene, 0, 320);
    startButton.onClick = () => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          this.setVisible(false);
        },
      });
    };

    this.add([bg, titleText, descriptionText, startButton]).setDepth(
      DEPTH.GAME_START_SCREEN
    );
    this.setSize(bg.width, bg.height).setInteractive();
  }
}

class StartButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "START", "white");
  }
  public onClick(): void {}
}
