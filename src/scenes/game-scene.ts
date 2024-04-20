import { ResizableScene } from "../lib/resizable-scene";
import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";

export class GameScene extends ResizableScene {
  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create() {
    new Board(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
    new PowerDisplay(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );
  }
}
