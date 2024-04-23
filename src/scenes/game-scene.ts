import { SCENE_KEYS } from "~/constants/scene-keys";
import { Board } from "~/sprites/board/board";
import { PowerDisplay } from "~/sprites/power-display";
import { Marker } from "~/sprites/marker";
import { DiceSet } from "~/sprites/dice-set";
import { ResourceTile } from "~/sprites/tiles/resource-tile";
import { CollectRecourseDialog } from "~/sprites/ui/dialogs/collect-resource-dialog";
import { GameInfoBoard } from "~/sprites/ui/boards/game-info-board";
import { PowerPlantCard } from "~/sprites/cards/power-plant-card";
import { EVENTS, GameManager } from "~/states/game-manager";
import { Scene } from "phaser";
import { CardSelectScreen } from "~/sprites/ui/screens/card-select-screen";
import { PowerPlantTile } from "~/sprites/tiles/power-plant-tile";
import { EmptyPowerPlantDialog } from "~/sprites/ui/dialogs/empty-power-plant-dialog";
import { BuildModeDialog } from "~/sprites/ui/dialogs/build-mode-dialog";
import { Overlay } from "~/sprites/ui/overlay";
import { NextRoundScreen } from "~/sprites/ui/screens/next-round-screen";
import { GameOverScreen } from "~/sprites/ui/screens/game-over-screen";
import { PolicySelectScreen } from "~/sprites/ui/screens/policy-select-screen";
import { ExistingPowerPlantDialog } from "~/sprites/ui/dialogs/existing-power-plant-dialog";
import { GeneratePowerDialog } from "~/sprites/ui/dialogs/generate-power-dialog";
import { PollutionCheckScreen } from "~/sprites/ui/screens/pollution-check-screen";

const POWER_PLANT_TILE_POS_MAP: Record<number, { x: number; y: number }> = {
  5: { x: 480, y: 200 },
  10: { x: 1440, y: 200 },
  15: { x: 1440, y: 660 },
};

export class GameScene extends Scene {
  marker!: Marker;
  board!: Board;
  powerDisplay!: PowerDisplay;
  overlay!: Overlay;

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

    new EmptyPowerPlantDialog(this, 2 * centerX + 288, centerY + 340);
    new Overlay(this, centerX, centerY);
    new NextRoundScreen(this, centerX, centerY);
    new GameOverScreen(this, centerX, centerY);
    new PolicySelectScreen(this, centerX, centerY);
    new ExistingPowerPlantDialog(this, 2 * centerX + 288, centerY + 340);
    new GeneratePowerDialog(this, 2 * centerX + 288, centerY + 340);
    new BuildModeDialog(this, 2 * centerX + 288, centerY + 340);
    new PollutionCheckScreen(this, centerX, centerY, "carbon");
    new PollutionCheckScreen(this, centerX, centerY, "nuclear");

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
          gm.updateCurrentTilePowerPlantTile(powerPlantTile);
          break;
      }
    });
    gm.emitter.on(
      EVENTS.ON_BUILD_POWER_PLANT,
      (cardId: string, tileIndex: number) => {
        const cardIndex = this.tablePowerPlantCards.findIndex(
          (card) => card.info.id === cardId
        );
        const card = this.tablePowerPlantCards[cardIndex];
        // put this card on the board
        card.switchMode("built");
        const pos = POWER_PLANT_TILE_POS_MAP[tileIndex];
        this.tweens.add({
          targets: card,
          x: pos.x,
          y: pos.y,
          duration: 500,
          ease: Phaser.Math.Easing.Quadratic.Out,
          onComplete: () => {
            gm.setNextRollEnabled(true);
          },
        });
        // update tile
        const tile = this.board.getTargetTile(
          gm.currentTileIndex
        ) as PowerPlantTile;
        tile.powerPlantCard = card;

        // remove this card index from tablePowerPlantCards
        this.tablePowerPlantCards.splice(cardIndex, 1);
        this._animateTablePowerPlantCards();

        // update cost
        gm.updatePower(gm.currentPower - card.info.buildCost);
      }
    );
    gm.emitter.on(EVENTS.ON_POLLUTED, (amount: number) => {
      let counter = 0;
      for (let i = 0; i < 20; i++) {
        if (counter >= amount) break;
        const tile = this.board.getTargetTile(i);
        if (tile instanceof ResourceTile && !tile.isPolluted) {
          tile.setPolluted(true);
          counter++;
        }
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

  private _animateTablePowerPlantCards() {
    const y = 1040;
    for (let i = 0; i < this.tablePowerPlantCards.length; i++) {
      const x = 128 + i * 252;
      this.tweens.add({
        targets: this.tablePowerPlantCards[i],
        x,
        y,
        duration: 500,
        ease: Phaser.Math.Easing.Quadratic.Out,
      });
    }
  }
}
