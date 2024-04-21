import { SCENE_KEYS } from "~/constants/scene-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";
import { Marker } from "~/sprites/marker";
import { DiceSet } from "~/sprites/dice-set";
import { ResourceTile } from "~/sprites/tiles/resource-tile";
import { CollectRecourseDialog } from "~/sprites/ui/collect-resource-dialog";
import { GameInfoBoard } from "~/sprites/ui/game-info-board";
import { PowerPlantCard } from "~/sprites/cards/power-plant-card";
import { EVENTS, GameManager } from "~/states/game-manager";
import { Scene } from "phaser";
import { CardSelectScreen } from "~/sprites/ui/card-select-screen";
import { PowerPlantTile } from "~/sprites/tiles/power-plant-tile";

export class GameScene extends Scene {
  marker!: Marker;
  board!: Board;
  powerDisplay!: PowerDisplay;

  private markerOffsetX = 24;
  private markerOffsetY = 36;

  tablePowerPlantCards: PowerPlantCard[] = [];

  constructor() {
    super(SCENE_KEYS.GAME);
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.board = new Board(this, centerX, centerY - 48);
    this.powerDisplay = new PowerDisplay(this, centerX, centerY - 48);
    const startTileBounds = this.board.getTileBoundsByIndex(0);
    this.marker = new Marker(
      this,
      startTileBounds.centerX - this.markerOffsetX,
      startTileBounds.centerY - this.markerOffsetY
    );

    new DiceSet(this, centerX + 750, centerY + 360);
    new CollectRecourseDialog(this, 2 * centerX + 288, centerY + 340);
    new GameInfoBoard(this, 146, 100);

    new CardSelectScreen(this, centerX, centerY);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.CURRENT_TILE_INDEX_UPDATED, async () => {
      // Move marker based on current tile index
      const bounds = this.board.getTileBoundsByIndex(gm.currentTileIndex);
      await this.marker.moveTo(
        bounds.centerX - this.markerOffsetX,
        bounds.centerY - this.markerOffsetY
      );
      if (gm.currentTileIndex === 0 && gm.round === 1) return;
      const tile = this.board.getTargetTile(gm.currentTileIndex);
      switch (tile.tileType) {
        case "resource":
          const resourceTile = tile as ResourceTile;
          gm.updateCurrentTileResourceMetadata(resourceTile.resource);
          break;
        case "power_plant":
          const powerPlantTile = tile as PowerPlantTile;
          gm.updateCurrentTilePowerPlantInfo(powerPlantTile.powerPlantInfo);
          break;
      }
    });
  }

  appendTablePowerPlantCards(card: PowerPlantCard) {
    this.tablePowerPlantCards.push(card);
    const x = 128 + (this.tablePowerPlantCards.length - 1) * 252;
    const y = 1040;
    this.tweens.add({
      targets: card,
      x,
      y,
      duration: 500,
      delay: (this.tablePowerPlantCards.length - 1) * 50,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => {
        card.switchMode("table", { hiddenX: x, hiddenY: y });
      },
    });
  }
}
