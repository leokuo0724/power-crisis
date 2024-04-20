export type TileType = "start" | "resource" | "power_plant" | "surprise";

export class TileBasic extends Phaser.GameObjects.Sprite {
  readonly index: number;
  readonly tileType: TileType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    index: number,
    tileType: TileType
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.index = index;
    this.tileType = tileType;
  }
}
