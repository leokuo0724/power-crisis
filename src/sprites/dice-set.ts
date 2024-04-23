import { Scene } from "phaser";
import { DICE_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { RollDiceButton } from "./ui/roll-dice-button";
import { EVENTS, GameManager } from "~/states/game-manager";
import { Dice } from "./dice";

export class DiceSet extends Phaser.GameObjects.Container {
  private dice: Dice;
  private button: RollDiceButton;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const gm = GameManager.getInstance();
    this.dice = new Dice(scene, 0, -84, [1, 2, 3]);
    this.button = new RollDiceButton(scene, 0, 48);
    this.button.setDisabled(!gm.isNextRollEnabled);

    this.button.onClick = async () => {
      gm.setNextRollEnabled(false);
      const diceResult = await this.dice.rollDice();
      const prevTileIndex = gm.currentTileIndex;

      // let nextTileIndex = prevTileIndex + diceResult;
      // if (prevTileIndex < 5) nextTileIndex = Math.min(5, nextTileIndex);
      // else if (prevTileIndex < 10) nextTileIndex = Math.min(10, nextTileIndex);
      // else if (prevTileIndex < 15) nextTileIndex = Math.min(15, nextTileIndex);
      // else nextTileIndex = nextTileIndex > 19 ? 0 : nextTileIndex;
      // FIXME: for testing
      let nextTileIndex = prevTileIndex + 5;
      if (nextTileIndex > 19) nextTileIndex = 0;

      gm.updateTileIndex(nextTileIndex);
    };

    this.add([this.dice, this.button]);

    gm.emitter.on(EVENTS.NEXT_ROLL_ENABLED, (isNextRollEnabled: boolean) => {
      if (isNextRollEnabled) {
        this.button.setDisabled(false);
      } else {
        this.button.setDisabled(true);
      }
    });
  }
}
