import { EVENTS, GameManager } from "~/states/game-manager";
import { Button } from "../shared/button";
import { Dialog } from "../shared/dialog";
import { GameScene } from "~/scenes/game-scene";

export class ExistingPowerPlantDialog extends Dialog {
  private passButton: PassButton;
  private replaceButton: ReplaceButton;
  private generateButton: GenerateButton;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "WHICH ACTION DO YOU WANT TO TAKE?");
    this.scene.add.existing(this);

    this.passButton = new PassButton(scene, -160, 84);
    this.replaceButton = new ReplaceButton(scene, 0, 84);
    this.generateButton = new GenerateButton(scene, 160, 84);

    this.add([this.passButton, this.replaceButton, this.generateButton]);
    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CURRENT_TILE_POWER_PLANT_TILE_UPDATED, () => {
      const ppTile = gm.currentTilePowerPlantTile;
      if (ppTile && ppTile.powerPlantCard) {
        this.generateButton.setDisabled(
          ppTile.powerPlantCard.info.buildCost > gm.currentPower
        );
        this.replaceButton.setDisabled(
          (this.scene as GameScene).tablePowerPlantCards.length === 0
        );
        this.show();
      }
      if (!ppTile) this.hide();
    });
  }
}

class PassButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "PASS", "secondary");
    this.setScale(0.6);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.updateCurrentTilePowerPlantTile(null);
    gm.setNextRollEnabled(true);
  }
}
class ReplaceButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "REPLACE", "secondary");
    this.setScale(0.6);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    const firstCard = (this.scene as GameScene).tablePowerPlantCards[0];
    if (!firstCard) throw new Error("No card on the table");
    gm.updateBuildMode(true, firstCard.info.id);
  }
}
class GenerateButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "GENERATE", "primary");
    this.setScale(0.6);
    return this;
  }
  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.toggleGeneratePowerDialog(true);
  }
}
