export type TileType = "start" | "resource" | "power_plant" | "surprise";

export class TileBasic extends Phaser.GameObjects.Container {
  readonly index: number;
  readonly tileType: TileType;
  tileSprite: Phaser.GameObjects.Sprite;
  width: number;
  height: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    index: number,
    tileType: TileType
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.tileSprite = scene.add.sprite(0, 0, texture);
    this.add(this.tileSprite);
    this.width = this.tileSprite.width;
    this.height = this.tileSprite.height;

    this.index = index;
    this.tileType = tileType;
  }
}
