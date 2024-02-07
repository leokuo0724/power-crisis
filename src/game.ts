import Phaser from "phaser";
import { Main } from "./scenes/main";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game",
  backgroundColor: "#333333",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Main],
};

export default new Phaser.Game(config);
