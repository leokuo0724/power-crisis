import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

export class PollutionBoard extends Phaser.GameObjects.Container {
  private carbonEmissionsText: Phaser.GameObjects.Text;
  private nuclearWasteText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_5_BOARD_BG
    );
    this.carbonEmissionsText = new Phaser.GameObjects.Text(
      scene,
      -120,
      -18,
      "Carbon emissions: 0",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0, 0.5);
    this.nuclearWasteText = new Phaser.GameObjects.Text(
      scene,
      -120,
      18,
      "Nuclear waste: 0",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0, 0.5);
    this.add([bg, this.carbonEmissionsText, this.nuclearWasteText]);
  }
}
