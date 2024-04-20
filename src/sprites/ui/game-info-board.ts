import { Scene } from "phaser";

import { RoundBoard } from "./round-board";
import { CollectUnitBoard } from "./collect-unit-board";
import { ResourceStorageBoard } from "./resource-storage-board";

export class GameInfoBoard extends Phaser.GameObjects.Container {
  roundBoard: RoundBoard;
  collectUnitBoard: CollectUnitBoard;
  resourceStorageBoard: ResourceStorageBoard;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.roundBoard = new RoundBoard(scene, 0, 0);
    this.collectUnitBoard = new CollectUnitBoard(scene, 0, 98);
    this.resourceStorageBoard = new ResourceStorageBoard(scene, 0, 200);
    this.add([
      this.roundBoard,
      this.collectUnitBoard,
      this.resourceStorageBoard,
    ]);
  }
}
