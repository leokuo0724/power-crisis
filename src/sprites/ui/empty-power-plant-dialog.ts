import { EVENTS, GameManager } from "~/states/game-manager";
import { Button } from "./shared/button";
import { Dialog } from "./shared/dialog";
import { GameScene } from "~/scenes/game-scene";

export class EmptyPowerPlantDialog extends Dialog {
  private passButton: PassButton;
  private buildButton: BuildButton;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "Do you want to build a power plant?");
    this.scene.add.existing(this);

    this.passButton = new PassButton(scene, -100, 84);
    this.buildButton = new BuildButton(scene, 100, 84);

    this.add([this.passButton, this.buildButton]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CURRENT_TILE_POWER_PLANT_TILE_UPDATED, () => {
      const ppTile = gm.currentTilePowerPlantTile;
      if (ppTile && !ppTile.powerPlantInfo) {
        // check if there is a card on the table
        if ((this.scene as GameScene).tablePowerPlantCards.length === 0) {
          this.buildButton.setDisabled(true);
        }
        this.show();
      }
      if (!ppTile) this.hide();
    });
    // for resetting the dialog
    gm.emitter.on(EVENTS.NEXT_ROLL_ENABLED, this._reset.bind(this));
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, () => {
      this.passButton.setDisabled(gm.isBuildMode);
      this.buildButton.setDisabled(gm.isBuildMode);
    });
  }

  private _reset() {
    this.buildButton.setDisabled(false);
  }
}

class PassButton extends Button {
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "PASS", "secondary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.updateCurrentTilePowerPlantTile(null);
    gm.setNextRollEnabled(true);
  }
}
class BuildButton extends Button {
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "BUILD", "primary");
    this.setScale(0.7);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    const firstCard = (this.scene as GameScene).tablePowerPlantCards[0];
    if (!firstCard) throw new Error("No card on the table");
    gm.updateBuildMode(true, firstCard.info.id);
  }
}
