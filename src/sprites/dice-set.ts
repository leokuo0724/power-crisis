import { Scene } from "phaser";
import { DICE_KEYS, ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { RollDiceButton } from "./ui/roll-dice-button";
import { setGameManager } from "~/states/game-manager";

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

    this.dice = new Phaser.GameObjects.Sprite(
      scene,
      0,
      -84,
      IMAGE_KEYS.DICE,
      DICE_KEYS.DICE_1
    );
    this.button = new RollDiceButton(scene, 0, 48);
    this.button.onClick = async () => {
      this.button.setDisabled(true);
      const diceResult = await this.rollDice();
      setGameManager("currentTileIndex", (prev) => {
        const next = prev + diceResult;
        if (prev < 5) return Math.min(5, next);
        if (prev < 10) return Math.min(10, next);
        if (prev < 15) return Math.min(15, next);
        return next > 19 ? 0 : next;
      });
    };

    this.add([this.dice, this.button]);
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
      }, 50);
    });
  }
}
