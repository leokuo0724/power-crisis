import { Dialog } from "./shared/dialog";

export class CollectRecourseDialog extends Dialog {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Do you want to collect resource?");
    this.scene.add.existing(this);
  }
}
