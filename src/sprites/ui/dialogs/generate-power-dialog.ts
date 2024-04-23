import { Scene } from "phaser";
import { Dialog } from "../shared/dialog";
import { Button } from "../shared/button";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { EVENTS, GameManager } from "~/states/game-manager";
import { RESOURCE_TEXTURE_MAP } from "~/types/resource";

export class GeneratePowerDialog extends Dialog {
  private cancelButton: CancelButton;
  private confirmButton: ConfirmButton;
  private lightningIcon: Phaser.GameObjects.Image;
  private resourceIcon: Phaser.GameObjects.Image;
  private costText: Phaser.GameObjects.Text;
  private gainText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "Do you want to generate power?");
    this.scene.add.existing(this);

    this.cancelButton = new CancelButton(scene, -100, 84);
    this.confirmButton = new ConfirmButton(scene, 100, 84);

    this.resourceIcon = new Phaser.GameObjects.Image(
      scene,
      -108,
      0,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.BIOMASS
    );
    this.costText = new Phaser.GameObjects.Text(scene, -56, 0, "-1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.lightningIcon = new Phaser.GameObjects.Image(
      scene,
      56,
      0,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.LIGHTNING
    );
    this.gainText = new Phaser.GameObjects.Text(scene, 108, 0, "+1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.add([
      this.cancelButton,
      this.confirmButton,
      this.resourceIcon,
      this.costText,
      this.lightningIcon,
      this.gainText,
    ]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.TOGGLE_GENERATE_POWER_DIALOG, (visible: boolean) => {
      if (visible) {
        // update cost and gain
        this._updateInfo();
        this.show();
      } else {
        this.hide();
      }
    });
  }

  private _updateInfo() {
    const gm = GameManager.getInstance();
    const ppTile = gm.currentTilePowerPlantTile;
    if (!ppTile?.powerPlantInfo) return;
    const resourceType = ppTile.powerPlantInfo.powerGain.resourceType;
    if (
      resourceType === "coal" ||
      resourceType === "natural_gas" ||
      resourceType === "oil" ||
      resourceType === "uranium" ||
      resourceType === "biomass"
    ) {
      this.resourceIcon
        .setVisible(true)
        .setTexture(IMAGE_KEYS.ICONS, RESOURCE_TEXTURE_MAP[resourceType]);
      this.costText.setVisible(true);
      this.lightningIcon.setPosition(56, 0);
      this.gainText.setPosition(108, 0);
    } else {
      this.resourceIcon.setVisible(false);
      this.costText.setVisible(false);
      this.lightningIcon.setPosition(-24, 0);
      this.gainText.setPosition(24, 0);
    }
    this.costText.setText(`-${ppTile.powerPlantInfo.powerGain.cost}`);
    this.gainText.setText(`+${ppTile.powerPlantInfo.powerGain.gain}`);
  }
}

class CancelButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "Cancel", "secondary");
    this.scene.add.existing(this);
    this.setScale(0.7);
  }
  public onClick() {
    const gm = GameManager.getInstance();
    gm.toggleGeneratePowerDialog(false);
  }
}
class ConfirmButton extends Button {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "Confirm", "primary");
    this.scene.add.existing(this);
    this.setScale(0.7);
  }
  public onClick() {
    const gm = GameManager.getInstance();
    gm.onGeneratePower();
  }
}
