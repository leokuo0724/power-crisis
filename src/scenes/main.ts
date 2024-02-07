import { Scene } from "phaser";
import { createEffect } from "solid-js";
import { counter, setCounter } from "../states/counter";

const TEXT_STYLE = {
  fontFamily: "Arial Black",
  fontSize: 48,
  color: "#ffffff",
  align: "center",
};

export class Main extends Scene {
  constructor() {
    super("Game");
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

    const button = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 64,
        `Click`,
        TEXT_STYLE
      )
      .setOrigin(0.5)
      .setInteractive();
    button.on("pointerdown", () => {
      setCounter((prev) => prev + 1);
    });

    createEffect(() => {
      text.setText(`Hello World ${counter()}`);
    });
  }
}
