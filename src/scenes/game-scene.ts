import { createEffect } from "solid-js";
import { counter, setCounter } from "../states/counter";
import { ResizableScene } from "../lib/resizable-scene";
import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { Board } from "~/sprites/board/board";

const TEXT_STYLE = {
  fontFamily: FONT_KEYS.PASSION_ONE,
  fontSize: 48,
  color: "#ffffff",
  align: "center",
};

export class GameScene extends ResizableScene {
  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create() {
    const text = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        `Hello World ${counter()}`,
        TEXT_STYLE
      )
      .setOrigin(0.5);

    createEffect(() => {
      text.setText(`Hello World ${counter()}`);
    });

    new Board(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
  }
}
