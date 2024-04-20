import { createEffect } from "solid-js";
import { Button } from "./shared/button";
import { Dialog } from "./shared/dialog";
import { gameManager } from "~/states/game-manager";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { ConsumableResource } from "~/types/resource";

const RESOURCE_TYPE_MAP: Record<ConsumableResource, string> = {
  coal: ICON_KEYS.COAL,
  natural_gas: ICON_KEYS.NATURAL_GAS,
  oil: ICON_KEYS.OIL,
  uranium: ICON_KEYS.URANIUM,
  biomass: ICON_KEYS.BIOMASS,
};

export class CollectRecourseDialog extends Dialog {
  private skipButton: SkipButton;
  private collectButton: CollectButton;
  private lightningIcon: Phaser.GameObjects.Image;
  private costText: Phaser.GameObjects.Text;
  private resourceIcon: Phaser.GameObjects.Image;
  private gainText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Do you want to collect resource?");
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

    createEffect(() => {
      if (gameManager.currentTileResourceMetadata) {
        if (gameManager.currentTileResourceMetadata.currentAmount > 0) {
          const resourceType = gameManager.currentTileResourceMetadata.type;
          this.costText.setText(`-${gameManager.costUnit[resourceType]}`);
          this.resourceIcon.setTexture(
            IMAGE_KEYS.ICONS,
            RESOURCE_TYPE_MAP[resourceType]
          );
          this.gainText.setText(`+${gameManager.collectUnit[resourceType]}`);
        }
        this.show();
      }
    });
  }
}

class SkipButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "SKIP", "secondary");
    this.setScale(0.7);
  }

  public onClick(): void {}
}

class CollectButton extends Button {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "COLLECT", "primary");
    this.setScale(0.7);
  }

  public onClick(): void {}
}
