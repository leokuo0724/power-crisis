import { SCENE_KEYS } from "~/constants/scene-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";
import { Marker } from "~/sprites/marker";
import { DiceSet } from "~/sprites/dice-set";
import { ResourceTileSprite } from "~/sprites/tiles/resource-tile";
import { CollectRecourseDialog } from "~/sprites/ui/collect-resource-dialog";
import { GameInfoBoard } from "~/sprites/ui/game-info-board";
import { PowerPlantCard } from "~/sprites/cards/power-plant-card";
import { EVENTS, GameManager } from "~/states/game-manager";
import { Scene } from "phaser";
import { CardSelectScreen } from "~/sprites/ui/card-select-screen";

export class GameScene extends Scene {
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
    new CollectRecourseDialog(this, 2 * centerX + 288, centerY + 340);
    new GameInfoBoard(this, 146, 100);
    new PowerPlantCard(this, centerX, centerY, {
      type: "thermal",
      buildCost: 1,
      powerGain: {
        resourceType: "coal",
        cost: 1,
        gain: 1,
      },
    });

    new CardSelectScreen(this, centerX, centerY);

    GameManager.getInstance().emitter.on(
      EVENTS.CURRENT_TILE_INDEX_UPDATED,
      async () => {
        // Move marker based on current tile index
        const bounds = this.board.getTileBoundsByIndex(
          GameManager.getInstance().currentTileIndex
        );
        await this.marker.moveTo(
          bounds.centerX - this.markerOffsetX,
          bounds.centerY - this.markerOffsetY
        );
        if (
          GameManager.getInstance().currentTileIndex === 0 &&
          GameManager.getInstance().round === 1
        )
          return;
        const tile = this.board.getTargetTile(
          GameManager.getInstance().currentTileIndex
        );
        switch (tile.tileType) {
          case "resource":
            const resourceTile = tile as ResourceTileSprite;
            GameManager.getInstance().updateCurrentTileResourceMetadata(
              resourceTile.resource
            );
            break;
        }
      }
    );
  }
}
