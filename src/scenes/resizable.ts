import { Scene } from "phaser";
import { setResizeCounter } from "../states/screen";

export class ResizableScene extends Scene {
  constructor(key: string) {
    super(key);
  }

  init() {
    this.scale.on("resize", this.resize, this);
  }

  resize() {
    // Modify value to resize DOM elements
    setResizeCounter((prev) => prev + 1);
  }
}
