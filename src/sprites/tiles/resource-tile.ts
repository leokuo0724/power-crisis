import { Scene } from "phaser";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import {
  CONSUMABLE_RESOURCES,
  ConsumableResource,
  RESOURCE_TEXTURE_MAP,
} from "~/types/resource";
import { TileBasic } from "./common";
import { IMAGE_KEYS, ICON_KEYS } from "~/constants/image-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";

export type ResourceMetadata = {
  tileIndex: number;
  type: ConsumableResource;
  maxAmount: number;
  currentAmount: number;
};

const RESOURCE_GRID_TEXTURE_MAP: Record<ConsumableResource, string> = {
  [CONSUMABLE_RESOURCES.COAL]: TEXTURE_KEYS.BROWN_6_TILE,
  [CONSUMABLE_RESOURCES.NATURAL_GAS]: TEXTURE_KEYS.YELLOW_7_TILE,
  [CONSUMABLE_RESOURCES.OIL]: TEXTURE_KEYS.BROWN_4_TILE,
  [CONSUMABLE_RESOURCES.URANIUM]: TEXTURE_KEYS.ORANGE_6_TILE,
  [CONSUMABLE_RESOURCES.BIOMASS]: TEXTURE_KEYS.GREEN_5_TILE,
};

export class ResourceTile extends TileBasic {
  public resource: ResourceMetadata;
  private amountText: Phaser.GameObjects.Text;
  public isPolluted: boolean = false;
  private pollutedMask: Phaser.GameObjects.Image;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    index: number,
    resource: ResourceMetadata
  ) {
    const texture = RESOURCE_GRID_TEXTURE_MAP[resource.type];
    super(scene, x, y, texture, index, "resource");
    scene.add.existing(this);
    this.resource = resource;

    const icon = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      IMAGE_KEYS.ICONS,
      RESOURCE_TEXTURE_MAP[resource.type]
    );
    this.amountText = new Phaser.GameObjects.Text(
      this.scene,
      0,
      0,
      resource.currentAmount === Infinity
        ? "∞"
        : resource.currentAmount.toString(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    )
      .setOrigin(0.5)
      .setPosition(36, 36);
    this.pollutedMask = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      TEXTURE_KEYS.DARK_5_TILE
    )
      .setAlpha(0.8)
      .setVisible(false);

    this.add([icon, this.amountText, this.pollutedMask]);
  }

  updateAmountText() {
    this.amountText.setText(
      this.resource.currentAmount === Infinity
        ? "∞"
        : this.resource.currentAmount.toString()
    );
  }

  setPolluted(isPolluted: boolean) {
    console.log("setPolluted", isPolluted);
    this.isPolluted = isPolluted;
    this.pollutedMask.setVisible(isPolluted);
  }
}
