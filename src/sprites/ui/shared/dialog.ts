import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

export abstract class Dialog extends Phaser.GameObjects.Container {
  protected dialogBg: Phaser.GameObjects.Image;
  protected titleText: Phaser.GameObjects.Text;
  private hiddenX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, title: string) {
    super(scene, x, y);
    this.hiddenX = x;

    this.dialogBg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_5_BG
    ).setOrigin(0.5);
    this.titleText = new Phaser.GameObjects.Text(scene, 0, -88, title, {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.add([this.dialogBg, this.titleText]);

    this.setSize(this.dialogBg.width, this.dialogBg.height);
  }

  show() {
    this.scene.tweens.add({
      targets: this,
      startDelay: 700,
      x: this.scene.cameras.main.width - 288,
      duration: 500,
      ease: Phaser.Math.Easing.Cubic.Out,
    });
  }
  hide() {
    this.scene.tweens.add({
      targets: this,
      x: this.hiddenX,
      duration: 500,
      ease: Phaser.Math.Easing.Cubic.Out,
    });
  }
}
