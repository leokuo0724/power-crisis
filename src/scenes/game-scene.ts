import { ResizableScene } from "../lib/resizable-scene";
import { SCENE_KEYS } from "~/constants/scene-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";
import { Marker } from "~/sprites/marker";
import { createEffect } from "solid-js";
import { gameManager } from "~/states/game-manager";
import { DiceSet } from "~/sprites/dice-set";

export class GameScene extends ResizableScene {
  marker!: Marker;
  board!: Board;
  powerDisplay!: PowerDisplay;

  private markerOffsetX = 24;
  private markerOffsetY = 36;

  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.board = new Board(this, centerX, centerY);
    this.powerDisplay = new PowerDisplay(this, centerX, centerY);
    const startTileBounds = this.board.getTileBoundsByIndex(0);
    this.marker = new Marker(
      this,
      startTileBounds.centerX - this.markerOffsetX,
      startTileBounds.centerY - this.markerOffsetY
    );

    new DiceSet(this, centerX + 750, centerY + 360);

    createEffect(async () => {
      const bounds = this.board.getTileBoundsByIndex(
        gameManager.currentTileIndex
      );
      await this.marker.moveTo(
        bounds.centerX - this.markerOffsetX,
        bounds.centerY - this.markerOffsetY
      );
    });
  }
}
