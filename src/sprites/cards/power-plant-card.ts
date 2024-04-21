import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { CARD_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { EVENTS, GameManager } from "~/states/game-manager";
import {
  POWER_PLANT_TEXTURE_MAP,
  POWER_PLANT_TYPES,
  PowerPlantInfo,
  PowerPlantType,
} from "~/types/power-plant";
import { CONSUMABLE_RESOURCES, RESOURCE_TEXTURE_MAP } from "~/types/resource";

const POWER_PLANT_BG_TEXTURE_MAP: Record<PowerPlantType, string> = {
  [POWER_PLANT_TYPES.THERMAL]: CARD_KEYS.THERMAL,
  [POWER_PLANT_TYPES.NUCLEAR]: CARD_KEYS.NUCLEAR,
  [POWER_PLANT_TYPES.SOLAR]: CARD_KEYS.SOLAR,
  [POWER_PLANT_TYPES.WIND]: CARD_KEYS.WIND,
  [POWER_PLANT_TYPES.HYDRO]: CARD_KEYS.HYDRO,
  [POWER_PLANT_TYPES.BIOMASS]: CARD_KEYS.BIOMASS,
};

type PowerPlantCardStage = "select" | "table" | "build" | "built" | "discard";

export class PowerPlantCard extends Phaser.GameObjects.Container {
  info: PowerPlantInfo;
  private bg: Phaser.GameObjects.Image;
  private gainPowerText: Phaser.GameObjects.Text;
  private costResourceText?: Phaser.GameObjects.Text;
  private buildCostText: Phaser.GameObjects.Text;
  public stage!: PowerPlantCardStage;
  private tableHiddenX?: number;
  private tableHiddenY?: number;

  constructor(scene: Phaser.Scene, x: number, y: number, info: PowerPlantInfo) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.info = info;

    this.bg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      IMAGE_KEYS.CARD,
      POWER_PLANT_BG_TEXTURE_MAP[info.type]
    );
    this.gainPowerText = new Phaser.GameObjects.Text(
      scene,
      -100,
      -130,
      info.powerGain.gain.toString(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    this.buildCostText = new Phaser.GameObjects.Text(
      scene,
      98,
      130,
      info.buildCost.toString(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 18,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    const powerPlantImage = new Phaser.GameObjects.Image(
      scene,
      0,
      -72,
      IMAGE_KEYS.POWER_PLANT,
      POWER_PLANT_TEXTURE_MAP[info.type]
    ).setOrigin(0.5);
    const badge = new Phaser.GameObjects.Image(
      scene,
      0,
      4,
      IMAGE_KEYS.CARD,
      CARD_KEYS.BADGE
    ).setOrigin(0.5);
    const name = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      info.type.toUpperCase(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 29,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);

    this.add([
      this.bg,
      this.gainPowerText,
      this.buildCostText,
      powerPlantImage,
      badge,
      name,
    ]);
    this.setSize(this.bg.width, this.bg.height).setInteractive();

    if (
      info.powerGain.resourceType === CONSUMABLE_RESOURCES.COAL ||
      info.powerGain.resourceType === CONSUMABLE_RESOURCES.OIL ||
      info.powerGain.resourceType === CONSUMABLE_RESOURCES.NATURAL_GAS ||
      info.powerGain.resourceType === CONSUMABLE_RESOURCES.URANIUM ||
      info.powerGain.resourceType === CONSUMABLE_RESOURCES.BIOMASS
    ) {
      const costResourceIcon = new Phaser.GameObjects.Image(
        scene,
        -100,
        -102,
        IMAGE_KEYS.ICONS,
        RESOURCE_TEXTURE_MAP[info.powerGain.resourceType]
      )
        .setOrigin(0.5)
        .setScale(0.38);

      this.costResourceText = new Phaser.GameObjects.Text(
        scene,
        -100,
        -78,
        info.powerGain.cost.toString(),
        {
          fontFamily: FONT_KEYS.PASSION_ONE,
          fontSize: 18,
          color: COLORS.WHITE_5,
        }
      ).setOrigin(0.5);
      this.add([costResourceIcon, this.costResourceText]);
    }

    this.switchMode("select");
    this.on("pointerover", this.onPointerOver, this);
    this.on("pointerout", this.onPointerOut, this);
    this.on("pointerdown", this.onPointerDown, this);

    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, () => {
      if (this.stage !== "table") return;
      this.switchMode(gm.isBuildMode ? "build" : "table");
    });
  }

  onPointerOver() {
    if (this.stage === "select") {
      this.setScale(1.05);
    } else if (this.stage === "table" && this.tableHiddenY) {
      this.scene.tweens.add({
        targets: this,
        y: this.tableHiddenY - 172,
        duration: 100,
      });
    }
  }
  onPointerOut() {
    if (this.stage === "select") {
      this.setScale(1);
    } else if (this.stage === "table" && this.tableHiddenY) {
      this.scene.tweens.add({
        targets: this,
        y: this.tableHiddenY,
        duration: 100,
      });
    }
  }
  onPointerDown() {
    const gm = GameManager.getInstance();
    if (this.stage === "build") {
      gm.updateSelectedPowerPlantToBuildId(this.info.id);
    }
  }

  switchMode(
    stage: PowerPlantCardStage,
    config?: { hiddenX: number; hiddenY: number }
  ) {
    this.stage = stage;

    if (config?.hiddenX) this.tableHiddenX = config.hiddenX;
    if (config?.hiddenY) this.tableHiddenY = config.hiddenY;

    if (this.stage === "table" && this.tableHiddenY) {
      this.y = this.tableHiddenY;
    }
    if (this.stage === "build" && this.tableHiddenY) {
      this.y = this.tableHiddenY - 172;
    }
  }
}
