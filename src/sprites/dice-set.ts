import { Scene } from "phaser";
import { DICE_KEYS, ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { RollDiceButton } from "./ui/roll-dice-button";
import { EVENTS, GameManager } from "~/states/game-manager";

const DICE_NUM_TEXTURE_MAP: Record<number, string> = {
  1: DICE_KEYS.DICE_1,
  2: DICE_KEYS.DICE_2,
  3: DICE_KEYS.DICE_3,
};

export class DiceSet extends Phaser.GameObjects.Container {
  private dice: Phaser.GameObjects.Sprite;
  private button: RollDiceButton;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const gm = GameManager.getInstance();
    this.dice = new Phaser.GameObjects.Sprite(
      scene,
      0,
      -84,
      IMAGE_KEYS.DICE,
      DICE_KEYS.DICE_1
    );
    this.button = new RollDiceButton(scene, 0, 48);
    this.button.setDisabled(!gm.isNextRollEnabled);

    this.button.onClick = async () => {
      gm.setNextRollEnabled(false);
      const diceResult = await this.rollDice();
      const prevTileIndex = gm.currentTileIndex;
      let nextTileIndex = prevTileIndex + diceResult;
      if (prevTileIndex < 5) nextTileIndex = Math.min(5, nextTileIndex);
      else if (prevTileIndex < 10) nextTileIndex = Math.min(10, nextTileIndex);
      else if (prevTileIndex < 15) nextTileIndex = Math.min(15, nextTileIndex);
      else nextTileIndex = nextTileIndex > 19 ? 0 : nextTileIndex;
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

  private rollDice() {
    return new Promise<number>((resolve) => {
      let counter = 0;
      const timer = setInterval(() => {
        this.dice.setTexture(
          IMAGE_KEYS.DICE,
          DICE_NUM_TEXTURE_MAP[(counter % 3) + 1]
        );
        counter++;
        if (counter === 10) {
          const num = Phaser.Math.RND.pick([1, 2, 3]);
          this.dice.setTexture(IMAGE_KEYS.DICE, DICE_NUM_TEXTURE_MAP[num]);
          clearInterval(timer);
          resolve(num);
        }
      }, 80);
    });
  }
}
