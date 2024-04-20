import { Scene } from "phaser";
import { IMAGE_KEYS } from "~/constants/image-keys";

export class Marker extends Phaser.GameObjects.Sprite {
  upAndDownTween: Phaser.Tweens.Tween;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, IMAGE_KEYS.MARKER);
    scene.add.existing(this);

    this.upAndDownTween = this.scene.tweens.add({
      targets: this,
      y: "-=10",
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  public moveTo(x: number, y: number) {
    return new Promise<void>((resolve) => {
      this.scene.tweens.add({
        targets: this,
        x,
        y,
        duration: 1000,
        repeat: 0,
        onComplete: () => {
          this.upAndDownTween.destroy();
          this.upAndDownTween = this.scene.tweens.add({
            targets: this,
            y: "-=10",
            duration: 700,
            yoyo: true,
            repeat: -1,
          });
          resolve();
        },
      });
    });
  }
}
