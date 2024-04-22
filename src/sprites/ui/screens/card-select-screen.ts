import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { PowerPlantCard } from "../../cards/power-plant-card";
import { POWER_PLANT_TYPES } from "~/types/power-plant";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { Button } from "../shared/button";
import { GameScene } from "~/scenes/game-scene";
import { EVENTS, GameManager } from "~/states/game-manager";
import { v4 as uuidv4 } from "uuid";
import { DEPTH } from "~/constants/depth";

const TOP_LEFT_EXPLAIN_TEXT =
  "How many power will be generated with how many resources.";
const BOTTOM_RIGHT_EXPLAIN_TEXT =
  "How many power will take when building the power plant.";

export class CardSelectScreen extends Phaser.GameObjects.Container {
  private picked = new Set<number>();
  private checkedMarkers: Phaser.GameObjects.Image[] = [];
  private startButton: Button;
  private cards: PowerPlantCard[] = [];

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const gm = GameManager.getInstance();
    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_7_SCREEN_BG
    );
    const titleText = new Phaser.GameObjects.Text(
      scene,
      0,
      -320,
      `PICK ${gm.MAX_POWER_PLANT_CARD} POWER PLANT CARDS`,
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 60,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    const topLeftText = new Phaser.GameObjects.Text(
      scene,
      -810,
      -180,
      TOP_LEFT_EXPLAIN_TEXT,
      {
        fontFamily: FONT_KEYS.NOTO_SANS,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    )
      .setOrigin(0)
      .setWordWrapWidth(168);
    const bottomRightText = new Phaser.GameObjects.Text(
      scene,
      664,
      72,
      BOTTOM_RIGHT_EXPLAIN_TEXT,
      {
        fontFamily: FONT_KEYS.NOTO_SANS,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    )
      .setOrigin(0)
      .setWordWrapWidth(168);
    const line = new Phaser.GameObjects.Image(
      scene,
      0,
      188,
      TEXTURE_KEYS.WHITE_5_BOTTOM_LINE
    );

    for (let i = 0; i < 5; i++) {
      const marker = new Phaser.GameObjects.Image(
        scene,
        -520 + i * 260,
        228,
        IMAGE_KEYS.ICONS,
        ICON_KEYS.CHECKED
      )
        .setOrigin(0.5)
        .setVisible(false);
      this.checkedMarkers.push(marker);
    }

    this.startButton = new StartButton(scene, 0, 340).setVisible(false);
    this.startButton.onClick = this._handleStart.bind(this);

    this.add([
      bg,
      titleText,
      topLeftText,
      bottomRightText,
      line,
      ...this.checkedMarkers,
      this.startButton,
    ]).setDepth(DEPTH.OVERLAY);

    this._generateCards();

    gm.emitter.on(EVENTS.TOGGLE_CARD_SELECT_SCREEN, (visible: boolean) => {
      if (visible) {
        this.setVisible(true);
        const validNum =
          gm.MAX_POWER_PLANT_CARD -
          (this.scene as GameScene).tablePowerPlantCards.length;
        titleText.setText(`PICK ${validNum} POWER PLANT CARDS`);
        this._checkButtonValid();
        this._generateCards();
      } else {
        this.setVisible(false);
        this._reset();
      }
    });
  }

  private _generateCards() {
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;
    for (let i = 0; i < 5; i++) {
      const card = new PowerPlantCard(
        this.scene,
        centerX - 520 + i * 260,
        centerY - 24,
        {
          id: uuidv4(),
          type: POWER_PLANT_TYPES.HYDRO,
          buildCost: 3,
          powerGain: { gain: 1, cost: 0, resourceType: "hydro" },
        }
      );
      card.on("pointerdown", () => {
        if (this.picked.has(i)) {
          this.picked.delete(i);
          this.checkedMarkers[i].setVisible(false);
        } else {
          this.picked.add(i);
          this.checkedMarkers[i].setVisible(true);
        }
        this._checkButtonValid();
      });
      this.scene.add.existing(card);
      this.cards.push(card);
    }
  }

  private _checkButtonValid() {
    const gm = GameManager.getInstance();
    const validNum =
      gm.MAX_POWER_PLANT_CARD -
      (this.scene as GameScene).tablePowerPlantCards.length;
    if (this.picked.size === validNum) {
      this.startButton.setVisible(true);
    } else {
      this.startButton.setVisible(false);
    }
  }

  private _handleStart() {
    for (let i = 0; i < 5; i++) {
      if (!this.picked.has(i)) {
        this.cards[i].destroy();
      } else {
        (this.scene as GameScene).appendTablePowerPlantCards(this.cards[i]);
      }
    }
    const gm = GameManager.getInstance();
    gm.toggleCardSelectScreen(false);

    // TODO: first round: tutorial
    gm.setNextRollEnabled(true);
  }

  private _reset() {
    this.picked.clear();
    this.cards = [];
    this.checkedMarkers.forEach((marker) => marker.setVisible(false));
    this.startButton.setVisible(false);
  }
}

class StartButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "START", "white");
  }
  public onClick(): void {}
}
