import { Scene } from "phaser";

import { RoundBoard } from "./round-board";
import { CollectUnitBoard } from "./collect-unit-board";
import { ResourceStorageBoard } from "./resource-storage-board";
import { PollutionBoard } from "./pollution-board";

export class GameInfoBoard extends Phaser.GameObjects.Container {
  private roundBoard: RoundBoard;
  private collectUnitBoard: CollectUnitBoard;
  private resourceStorageBoard: ResourceStorageBoard;
  private pollutionBoard: PollutionBoard;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.roundBoard = new RoundBoard(scene, 0, 0);
    this.collectUnitBoard = new CollectUnitBoard(scene, 0, 98);
    this.resourceStorageBoard = new ResourceStorageBoard(scene, 0, 200);
    this.pollutionBoard = new PollutionBoard(scene, 0, 302);
    this.add([
      this.roundBoard,
      this.collectUnitBoard,
      this.resourceStorageBoard,
      this.pollutionBoard,
    ]);
  }
}
