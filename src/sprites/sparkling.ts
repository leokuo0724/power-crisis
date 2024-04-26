import { Scene } from "phaser";
import { IMAGE_KEYS } from "~/constants/image-keys";

export class Sparkling extends Phaser.GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, IMAGE_KEYS.SPARKLING, "sparkling_00000.png");

    this.anims.create({
      key: "sparkling",
      frames: this.anims.generateFrameNames(IMAGE_KEYS.SPARKLING, {
        prefix: "sparkling_",
        suffix: ".png",
        start: 0,
        end: 9,
        zeroPad: 5,
      }),
      frameRate: 10,
    });
  }

  playSparkling() {
    this.play("sparkling");
  }
}
