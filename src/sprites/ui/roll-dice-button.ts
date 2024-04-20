import { CustomButton } from "./custom-button";

export class RollDiceButton extends CustomButton {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ROLL");
  }
  public onClick(): void {}
}
