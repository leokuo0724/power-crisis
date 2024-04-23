import { Button } from "../shared/button";
import { Dialog } from "../shared/dialog";
import { EVENTS, GameManager } from "~/states/game-manager";
import { GameScene } from "~/scenes/game-scene";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";

export class BuildModeDialog extends Dialog {
  private cancelButton: CancelButton;
  private confirmButton: ConfirmButton;
  private costText: Phaser.GameObjects.Text;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "Do you want to build this?");
    this.scene.add.existing(this);

    this.cancelButton = new CancelButton(scene, -100, 84);
    this.confirmButton = new ConfirmButton(scene, 100, 84);
    const lightningIcon = new Phaser.GameObjects.Image(
      scene,
      -24,
      -12,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.LIGHTNING
    ).setOrigin(0.5);
    this.costText = new Phaser.GameObjects.Text(scene, 24, -12, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.add([
      this.cancelButton,
      this.confirmButton,
      lightningIcon,
      this.costText,
    ]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, () => {
      gm.isBuildMode ? this.show() : this.hide();
    });
    gm.emitter.on(EVENTS.SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED, () => {
      const card = scene.tablePowerPlantCards.find(
        (card) => card.info.id === gm.selectedPowerPlantToBuildId
      );
      if (card) {
        this.confirmButton.setDisabled(gm.currentPower < card.info.buildCost);
        this.costText.setText(`-${card.info.buildCost}`);
      }
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
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.onBuildPowerPlant();
  }
}
