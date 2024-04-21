import { Scene } from "phaser";
import { Button } from "./shared/button";
import { Dialog } from "./shared/dialog";
import { EVENTS, GameManager } from "~/states/game-manager";

export class BuildModeDialog extends Dialog {
  private cancelButton: CancelButton;
  private confirmButton: ConfirmButton;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "Do you want to build this?");
    this.scene.add.existing(this);

    this.cancelButton = new CancelButton(scene, -100, 84);
    this.confirmButton = new ConfirmButton(scene, 100, 84);

    this.add([this.cancelButton, this.confirmButton]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, () => {
      gm.isBuildMode ? this.show() : this.hide();
    });
  }
}

class CancelButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "CANCEL", "secondary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.updateBuildMode(false);
  }
}
class ConfirmButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "CONFIRM", "primary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {}
}
