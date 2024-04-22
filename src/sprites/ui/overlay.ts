import { Scene } from "phaser";
import { DEPTH } from "~/constants/depth";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { EVENTS, GameManager } from "~/states/game-manager";

export class Overlay extends Phaser.GameObjects.Image {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.BLUE_7_SCREEN_BG);
    this.scene.add.existing(this);
    this.setVisible(false).setDepth(DEPTH.OVERLAY);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, () => {
      gm.isBuildMode ? this.setVisible(true) : this.setVisible(false);
    });
  }
}
