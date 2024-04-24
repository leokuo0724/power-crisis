import { Button } from "../shared/button";
import { Dialog } from "../shared/dialog";
import { EVENTS, GameManager } from "~/states/game-manager";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { RESOURCE_TEXTURE_MAP } from "~/types/resource";

const COLLECT_RESOURCE_DIALOG_TITLE = "Do you want to collect resource?";

export class CollectRecourseDialog extends Dialog {
  private skipButton: SkipButton;
  private collectButton: CollectButton;
  private lightningIcon: Phaser.GameObjects.Image;
  private costText: Phaser.GameObjects.Text;
  private resourceIcon: Phaser.GameObjects.Image;
  private gainText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, COLLECT_RESOURCE_DIALOG_TITLE);
    this.scene.add.existing(this);

    this.skipButton = new SkipButton(scene, -100, 84);
    this.collectButton = new CollectButton(scene, 100, 84);
    this.lightningIcon = new Phaser.GameObjects.Image(
      scene,
      -108,
      0,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.LIGHTNING
    );
    this.costText = new Phaser.GameObjects.Text(scene, -56, 0, "-1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    this.resourceIcon = new Phaser.GameObjects.Image(
      scene,
      56,
      0,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.BIOMASS
    );
    this.gainText = new Phaser.GameObjects.Text(scene, 108, 0, "+1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);

    this.add([
      this.skipButton,
      this.collectButton,
      this.lightningIcon,
      this.costText,
      this.resourceIcon,
      this.gainText,
    ]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CURRENT_TILE_RESOURCE_METADATA_UPDATED, () => {
      if (gm.currentTileResourceMetadata) {
        const isFullStorage =
          gm.resourceStorage[gm.currentTileResourceMetadata.type].current >=
          gm.resourceStorage[gm.currentTileResourceMetadata.type].max;
        if (
          gm.currentTileResourceMetadata.currentAmount > 0 &&
          !isFullStorage &&
          !gm.currentTileResourceMetadata.isPolluted
        ) {
          const resourceType = gm.currentTileResourceMetadata.type;
          this.costText.setText(`-${gm.costUnit[resourceType]}`);
          this.resourceIcon.setTexture(
            IMAGE_KEYS.ICONS,
            RESOURCE_TEXTURE_MAP[resourceType]
          );
          const collectableAmount = Math.min(
            gm.currentTileResourceMetadata.currentAmount,
            gm.collectUnit[resourceType]
          );
          this.gainText.setText(
            collectableAmount === Infinity ? "ALL" : `+${collectableAmount}`
          );
        } else {
          this.titleText.setText("Unable to collect. :(");
          this.collectButton.setDisabled(true);
          this.lightningIcon.setVisible(false);
          this.costText.setVisible(false);
          this.resourceIcon.setVisible(false);
          this.gainText.setVisible(false);
        }
        this.show();
      } else {
        this._resetDialog();
        this.hide();
      }
    });
  }

  private _resetDialog() {
    this.titleText.setText(COLLECT_RESOURCE_DIALOG_TITLE);
    this.collectButton.setDisabled(false);
    this.lightningIcon.setVisible(true);
    this.costText.setVisible(true);
    this.resourceIcon.setVisible(true);
    this.gainText.setVisible(true);
  }
}

class SkipButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "SKIP", "secondary");
    this.setScale(0.7);
  }

  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.updateCurrentTileResourceMetadata(null);
    gm.setNextRollEnabled(true);
  }
}

class CollectButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "COLLECT", "primary");
    this.setScale(0.7);
  }

  public onClick(): void {
    const gm = GameManager.getInstance();
    gm.collectResource();
  }
}
