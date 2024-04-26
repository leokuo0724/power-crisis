import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { EVENTS, GameManager } from "~/states/game-manager";

export class TargetPowerBoard extends Phaser.GameObjects.Container {
  private titleText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const gm = GameManager.getInstance();
    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_6_HINT_BG
    );
    this.titleText = new Phaser.GameObjects.Text(
      scene,
      -130,
      -48,
      `TARGET POWER: ${gm.targetPower}`,
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    );
    const description = new Phaser.GameObjects.Text(
      scene,
      -130,
      -16,
      "You must maintain this level of power to advance to the next round.",
      {
        fontFamily: FONT_KEYS.NOTO_SANS,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    ).setWordWrapWidth(280);

    this.add([bg, this.titleText, description]);
    gm.emitter.on(EVENTS.TARGET_POWER_UPDATED, () => {
      this.titleText.setText(`TARGET POWER: ${gm.targetPower}`);
    });
  }
}
