import { Scene } from "phaser";
import { IMAGE_KEYS } from "~/constants/image-keys";

export class PowerGen extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, IMAGE_KEYS.POWER_GEN, "power-gen_00000.png");

    this.anims.create({
      key: "gen",
      frames: this.anims.generateFrameNames(IMAGE_KEYS.POWER_GEN, {
        prefix: "power-gen_",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 5,
      }),
      frameRate: 20,
      repeat: 1,
    });
  }

  playGen() {
    this.play("gen");
  }
}
