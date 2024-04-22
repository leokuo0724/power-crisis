import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { TileBasic } from "./common";
import { IMAGE_KEYS, ICON_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { EVENTS, GameManager } from "~/states/game-manager";

export class StartTile extends TileBasic {
  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_5_TILE, index, "start");
    scene.add.existing(this);

    const image = new Phaser.GameObjects.Image(
      this.scene,
      0,
      -12,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.UP_ARROW
    );

    const text = new Phaser.GameObjects.Text(this.scene, 0, 18, "START", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
      align: "center",
    }).setOrigin(0.5);

    this.add([image, text]);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CURRENT_TILE_INDEX_UPDATED, () => {
      if (gm.currentTileIndex !== 0) return;
      const nextPower = gm.currentPower - gm.targetPower;
      gm.updatePower(nextPower);
      setTimeout(() => {
        // Check result
        gm.setNextRound(nextPower >= 0);
      }, 1500);
    });
  }
}
