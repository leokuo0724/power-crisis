import { Scene } from "phaser";
import { Dialog } from "../shared/dialog";
import { Button } from "../shared/button";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { EVENTS, GameManager } from "~/states/game-manager";
import { RESOURCE_TEXTURE_MAP } from "~/types/resource";
import { TPollutionInfo } from "~/types/pollution";

export class GeneratePowerDialog extends Dialog {
  private cancelButton: CancelButton;
  private confirmButton: ConfirmButton;
  private lightningIcon: Phaser.GameObjects.Image;
  private resourceIcon: Phaser.GameObjects.Image;
  private costText: Phaser.GameObjects.Text;
  private gainText: Phaser.GameObjects.Text;
  private pollutionText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "Do you want to generate power?");
    this.scene.add.existing(this);

    this.cancelButton = new CancelButton(scene, -100, 84);
    this.confirmButton = new ConfirmButton(scene, 100, 84);

    this.resourceIcon = new Phaser.GameObjects.Image(
      scene,
      -108,
      -12,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.URANIUM
    );
    this.costText = new Phaser.GameObjects.Text(scene, -56, -12, "-1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.lightningIcon = new Phaser.GameObjects.Image(
      scene,
      56,
      -12,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.LIGHTNING
    );
    this.gainText = new Phaser.GameObjects.Text(scene, 108, -12, "+1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    this.pollutionText = new Phaser.GameObjects.Text(
      scene,
      -108,
      30,
      "Carbon emission +1",
      {
        fontFamily: FONT_KEYS.NOTO_SANS,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    )
      .setOrigin(0.5)
      .setVisible(false);

    this.add([
      this.cancelButton,
      this.confirmButton,
      this.resourceIcon,
      this.costText,
      this.lightningIcon,
      this.gainText,
      this.pollutionText,
    ]);

    const gm = GameManager.getInstance();
    // this.show();
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
    if (!ppTile?.powerPlantCard) return;
    const resourceType = ppTile.powerPlantCard.info.powerGain.resourceType;
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
      this.lightningIcon.setPosition(56, -12);
      this.gainText.setPosition(108, -12);
    } else {
      this.resourceIcon.setVisible(false);
      this.costText.setVisible(false);
      this.lightningIcon.setPosition(-24, -12);
      this.gainText.setPosition(24, -12);
    }
    this.costText.setText(`-${ppTile.powerPlantCard.info.powerGain.cost}`);
    this.gainText.setText(`+${ppTile.powerPlantCard.info.powerGain.gain}`);

    // set pollution text
    // @ts-ignore
    const pollutionInfo = gm.pollutionUnit[resourceType] as
      | TPollutionInfo
      | undefined;
    if (pollutionInfo) {
      this.pollutionText
        .setVisible(true)
        .setText(
          `${
            pollutionInfo.type === "carbon"
              ? "carbon emission"
              : "nuclear waste"
          } +${pollutionInfo.value}`
        );
    } else {
      this.pollutionText.setVisible(false);
    }
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
