import { CARD_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import {
  POWER_PLANT_TYPES,
  PowerPlantInfo,
  PowerPlantType,
} from "~/types/power-plant";

const POWER_PLANT_CARD_TEXTURE_MAP: Record<PowerPlantType, string> = {
  [POWER_PLANT_TYPES.THERMAL]: CARD_KEYS.THERMAL,
  [POWER_PLANT_TYPES.NUCLEAR]: CARD_KEYS.NUCLEAR,
  [POWER_PLANT_TYPES.SOLAR]: CARD_KEYS.SOLAR,
  [POWER_PLANT_TYPES.WIND]: CARD_KEYS.WIND,
  [POWER_PLANT_TYPES.HYDRO]: CARD_KEYS.HYDRO,
  [POWER_PLANT_TYPES.BIOMASS]: CARD_KEYS.BIOMASS,
};

export class PowerPlantCard extends Phaser.GameObjects.Container {
  info: PowerPlantInfo;
  private bg: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, info: PowerPlantInfo) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.info = info;

    this.bg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      IMAGE_KEYS.CARD,
      POWER_PLANT_CARD_TEXTURE_MAP[info.type]
    );
    this.add(this.bg);
  }
}
