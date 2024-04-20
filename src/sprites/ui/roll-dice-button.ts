import { Button } from "./shared/button";

export class RollDiceButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ROLL");
  }
  public onClick(): void {}
}
