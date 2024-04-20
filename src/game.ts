import Phaser from "phaser";
import { GameScene } from "./scenes/game-scene";
import { COLORS } from "./constants/colors";
import { PreloadScene } from "./scenes/preload-scene";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  backgroundColor: COLORS.WHITE_6,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, GameScene],
};

export default new Phaser.Game(config);
