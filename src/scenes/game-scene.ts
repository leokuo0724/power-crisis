import { ResizableScene } from "../lib/resizable-scene";
import { SCENE_KEYS } from "~/constants/scene-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";
import { Marker } from "~/sprites/marker";
import { createEffect, createSignal } from "solid-js";
import { gameManager } from "~/states/game-manager";

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
    this.board = new Board(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );
    this.powerDisplay = new PowerDisplay(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );
    const startTileBounds = this.board.getTileBoundsByIndex(0);
    this.marker = new Marker(
      this,
      startTileBounds.centerX - this.markerOffsetX,
      startTileBounds.centerY - this.markerOffsetY
    );

    createEffect(() => {
      const bounds = this.board.getTileBoundsByIndex(
        gameManager.currentTileIndex
      );
      this.marker.moveTo(
        bounds.centerX - this.markerOffsetX,
        bounds.centerY - this.markerOffsetY
      );
    });
  }
}
