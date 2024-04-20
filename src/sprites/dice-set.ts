import { Scene } from "phaser";
import { DICE_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { RollDiceButton } from "./ui/roll-dice-button";

export class DiceSet extends Phaser.GameObjects.Container {
  private dice: Phaser.GameObjects.Sprite;
  private button: RollDiceButton;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.dice = new Phaser.GameObjects.Sprite(
      scene,
      0,
      -84,
      IMAGE_KEYS.DICE,
      DICE_KEYS.DICE_1
    );
    this.button = new RollDiceButton(scene, 0, 48);

    // TODO: roll button
    this.add([this.dice, this.button]);
  }
}
