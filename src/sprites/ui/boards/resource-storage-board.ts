import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { IMAGE_KEYS } from "~/constants/image-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { EVENTS, GameManager } from "~/states/game-manager";

import {
  CONSUMABLE_RESOURCES,
  ConsumableResource,
  RESOURCE_TEXTURE_MAP,
} from "~/types/resource";

export class ResourceStorageBoard extends Phaser.GameObjects.Container {
  coalSet: ResourceSet;
  oilSet: ResourceSet;
  naturalGasSet: ResourceSet;
  uraniumSet: ResourceSet;
  biomassSet: ResourceSet;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_4_BOARD_BG
    );

    const titleText = new Phaser.GameObjects.Text(
      scene,
      -120,
      -48,
      "Resource storage",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    );

    this.coalSet = new ResourceSet(scene, -108, 0, CONSUMABLE_RESOURCES.COAL);

    this.oilSet = new ResourceSet(scene, -24, 0, CONSUMABLE_RESOURCES.OIL);

    this.naturalGasSet = new ResourceSet(
      scene,
      60,
      0,
      CONSUMABLE_RESOURCES.NATURAL_GAS
    );

    this.uraniumSet = new ResourceSet(
      scene,
      -108,
      32,
      CONSUMABLE_RESOURCES.URANIUM
    );

    this.biomassSet = new ResourceSet(
      scene,
      -24,
      32,
      CONSUMABLE_RESOURCES.BIOMASS
    );
    this.add([
      bg,
      titleText,
      this.coalSet,
      this.oilSet,
      this.naturalGasSet,
      this.uraniumSet,
      this.biomassSet,
    ]);
    this._updateResourceStorageText();

    const gm = GameManager.getInstance();
    gm.emitter.on(
      EVENTS.RESOURCE_STORAGE_UPDATED,
      this._updateResourceStorageText.bind(this)
    );
  }

  private _updateResourceStorageText() {
    const gm = GameManager.getInstance();
    this.coalSet.updateAmount(
      gm.resourceStorage.coal.current,
      gm.resourceStorage.coal.max
    );
    this.oilSet.updateAmount(
      gm.resourceStorage.oil.current,
      gm.resourceStorage.oil.max
    );
    this.naturalGasSet.updateAmount(
      gm.resourceStorage.natural_gas.current,
      gm.resourceStorage.natural_gas.max
    );
    this.uraniumSet.updateAmount(
      gm.resourceStorage.uranium.current,
      gm.resourceStorage.uranium.max
    );
    this.biomassSet.updateAmount(
      gm.resourceStorage.biomass.current,
      gm.resourceStorage.biomass.max
    );
  }
}

class ResourceSet extends Phaser.GameObjects.Container {
  amountText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    resourceType: ConsumableResource
  ) {
    super(scene, x, y);

    const icon = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      IMAGE_KEYS.ICONS,
      RESOURCE_TEXTURE_MAP[resourceType]
    ).setScale(0.4);
    this.amountText = new Phaser.GameObjects.Text(scene, 18, 0, "0/0", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
    }).setOrigin(0, 0.5);

    this.add([icon, this.amountText]);
  }

  updateAmount(current: number, max: number) {
    this.amountText.setText(`${current}/${max}`);
  }
}
