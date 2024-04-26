import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { Dice } from "~/sprites/dice";
import { EVENTS, GameManager } from "~/states/game-manager";
import { PollutionType } from "~/types/pollution";
import { Button } from "../shared/button";
import { DEPTH } from "~/constants/depth";

export class PollutionCheckScreen extends Phaser.GameObjects.Container {
  public type: PollutionType;
  private descriptionText: Phaser.GameObjects.Text;
  private dice1: Dice;
  private dice2: Dice;
  private rollDiceButton: RollDiceButton;
  private resultText: Phaser.GameObjects.Text;

  private lockedAmount: number;

  constructor(scene: Scene, x: number, y: number, type: PollutionType) {
    super(scene, x, y);
    scene.add.existing(this);
    this.type = type;
    this.lockedAmount = type === "nuclear" ? 4 : 2;

    const gm = GameManager.getInstance();
    const bg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_7_SCREEN_BG
    )
      .setInteractive()
      .on("pointerdown", () => {});
    const titleText = new Phaser.GameObjects.Text(
      scene,
      0,
      -320,
      `${type.toUpperCase()} POLLUTION CHECK`,
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 60,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    this.descriptionText = new Phaser.GameObjects.Text(scene, 0, -220, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
      align: "center",
    }).setOrigin(0.5);
    const range = [1, 2, 3, 4, 5, 6];
    this.dice1 = new Dice(scene, -200, 24, range).setScale(1.5);
    this.dice2 = new Dice(scene, 200, 24, range).setScale(1.5);
    this.rollDiceButton = new RollDiceButton(scene, 0, 320);
    this.rollDiceButton.onClick = this._rollDices.bind(this);
    this.resultText = new Phaser.GameObjects.Text(scene, 0, 24, "PASS", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 240,
      color: COLORS.WHITE_5,
    })
      .setOrigin(0.5)
      .setScale(0.8)
      .setAlpha(0);

    this.add([
      bg,
      titleText,
      this.descriptionText,
      this.dice1,
      this.dice2,
      this.rollDiceButton,
      this.resultText,
    ]);
    this._updateDescriptionText();
    this.setDepth(DEPTH.OVERLAY).setVisible(false);

    gm.emitter.on(EVENTS.OPEN_POLLUTION_CHECK, (type: PollutionType) => {
      if (type !== this.type) return;
      this.setVisible(true);
      this._updateDescriptionText();
    });
  }

  private _updateDescriptionText() {
    const gm = GameManager.getInstance();
    const value =
      this.type === "carbon"
        ? gm.pollution.carbonEmissions
        : gm.pollution.nuclearWaste;
    this.descriptionText.setText(
      `Must be greater than or equal to ${value}\nor it will cause pollution to lock ${this.lockedAmount} random tile.`
    );
  }

  private _reset() {
    this.resultText.setAlpha(0).setScale(0.8);
    this.rollDiceButton.setDisabled(false);
  }

  private async _rollDices() {
    const gm = GameManager.getInstance();
    this.rollDiceButton.setDisabled(true);
    const target =
      this.type === "carbon"
        ? gm.pollution.carbonEmissions
        : gm.pollution.nuclearWaste;

    const promise1 = this.dice1.rollDice();
    const promise2 = this.dice2.rollDice();
    const [value1, value2] = await Promise.all([promise1, promise2]);
    await sleep(800);
    const isPass = value1 + value2 >= target;
    this.resultText.setText(isPass ? "PASS" : "FAIL");
    this.scene.tweens.add({
      targets: this.resultText,
      scale: 1,
      duration: 500,
      alpha: 1,
      ease: Phaser.Math.Easing.Cubic.Out,
      completeDelay: 300,
      onComplete: () => {
        this.setVisible(false);
        this._reset();
        if (!isPass) gm.onPolluted(this.lockedAmount);
      },
    });
  }
}

class RollDiceButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "ROLL", "white");
    this.setDepth(501);
  }
  public onClick(): void {}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
