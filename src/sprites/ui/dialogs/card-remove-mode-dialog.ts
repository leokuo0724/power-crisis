import { GameScene } from "~/scenes/game-scene";
import { Button } from "../shared/button";
import { Dialog } from "../shared/dialog";
import { EVENTS, GameManager } from "~/states/game-manager";

export class CardRemoveModeDialog extends Dialog {
  private skipButton: SkipButton;
  private confirmButton: ConfirmButton;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "Do you want to remove these cards?");
    this.scene.add.existing(this);

    this.skipButton = new SkipButton(scene, -100, 84);
    this.confirmButton = new ConfirmButton(scene, 100, 84);

    this.add([this.skipButton, this.confirmButton]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CARD_REMOVE_MODE_UPDATED, (enabled: boolean) => {
      enabled ? this.show() : this.hide();
    });
    gm.emitter.on(EVENTS.SELECTED_POWER_PLANT_TO_REMOVE_IDS_UPDATED, () => {
      this.confirmButton.setDisabled(
        gm.selectedPowerPlantToRemoveIds.size === 0
      );
    });
  }
}

class SkipButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "SKIP", "secondary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.toggleCardRemoveMode(false);
    gm.toggleCardSelectScreen(true);
  }
}

class ConfirmButton extends Button {
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "CONFIRM", "primary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.toggleCardRemoveMode(false);
    (this.scene as GameScene).removeSelectedCards();
    gm.toggleCardSelectScreen(true);
  }
}
