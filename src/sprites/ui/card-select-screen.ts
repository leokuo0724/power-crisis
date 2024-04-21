import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { PowerPlantCard } from "../cards/power-plant-card";
import { POWER_PLANT_TYPES } from "~/types/power-plant";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { Button } from "./shared/button";

const TOP_LEFT_EXPLAIN_TEXT =
  "How many power will be generated with how many resources.";
const BOTTOM_RIGHT_EXPLAIN_TEXT =
  "How many power will take when building the power plant.";

export class CardSelectScreen extends Phaser.GameObjects.Container {
  private picked = new Set<number>();
  private checkedMarkers: Phaser.GameObjects.Image[] = [];
  private startButton: Button;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

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
      "PICK 4 POWER PLANT CARDS",
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

    this.add([
      bg,
      titleText,
      topLeftText,
      bottomRightText,
      line,
      ...this.checkedMarkers,
      this.startButton,
    ]);

    this.generateCards();
  }

  generateCards() {
    for (let i = 0; i < 5; i++) {
      const card = new PowerPlantCard(this.scene, -520 + i * 260, -24, {
        type: POWER_PLANT_TYPES.THERMAL,
        buildCost: 1,
        powerGain: { gain: 1, cost: 1, resourceType: "coal" },
      });
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
      this.add(card);
    }
  }

  private _checkButtonValid() {
    if (this.picked.size === 4) {
      this.startButton.setVisible(true);
    } else {
      this.startButton.setVisible(false);
    }
  }
}

class StartButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "START", "white");
  }
  public onClick(): void {}
}