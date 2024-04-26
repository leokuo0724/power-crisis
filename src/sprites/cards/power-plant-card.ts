import { COLORS } from "~/constants/colors";
import { DEPTH } from "~/constants/depth";
import { FONT_KEYS } from "~/constants/font-keys";
import { CARD_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { EVENTS, GameManager } from "~/states/game-manager";
import {
  CARD_EFFECT_TRIGGER_DESC_MAP,
  CARD_MATCHED_EVENT_DESC_MAP,
  CardEffect,
} from "~/types/effects";
import {
  POWER_PLANT_TEXTURE_MAP,
  POWER_PLANT_TYPES,
  PowerPlantInfo,
  PowerPlantType,
} from "~/types/power-plant";
import {
  CONSUMABLE_RESOURCES,
  ConsumableResource,
  RESOURCE_TEXTURE_MAP,
} from "~/types/resource";

const POWER_PLANT_BG_TEXTURE_MAP: Record<PowerPlantType, string> = {
  [POWER_PLANT_TYPES.THERMAL]: CARD_KEYS.THERMAL,
  [POWER_PLANT_TYPES.NUCLEAR]: CARD_KEYS.NUCLEAR,
  [POWER_PLANT_TYPES.SOLAR]: CARD_KEYS.SOLAR,
  [POWER_PLANT_TYPES.WIND]: CARD_KEYS.WIND,
  [POWER_PLANT_TYPES.HYDRO]: CARD_KEYS.HYDRO,
  [POWER_PLANT_TYPES.BIOMASS]: CARD_KEYS.BIOMASS,
};

type PowerPlantCardStage = "select" | "table" | "build" | "built" | "remove";

export class PowerPlantCard extends Phaser.GameObjects.Container {
  info: PowerPlantInfo;
  private bg: Phaser.GameObjects.Image;
  private gainPowerText: Phaser.GameObjects.Text;
  private costResourceText?: Phaser.GameObjects.Text;
  private buildCostText: Phaser.GameObjects.Text;
  private effectText: Phaser.GameObjects.Text;

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
    this.effectText = new Phaser.GameObjects.Text(
      scene,
      0,
      96,
      this._getEffectText(),
      {
        fontFamily: FONT_KEYS.NOTO_SANS,
        fontSize: 20,
        color: COLORS.WHITE_5,
        align: "center",
      }
    )
      .setWordWrapWidth(170)
      .setAlpha(0.8)
      .setOrigin(0.5);

    this.add([
      this.bg,
      this.gainPowerText,
      this.buildCostText,
      powerPlantImage,
      badge,
      name,
      this.effectText,
    ]);
    this.setDepth(DEPTH.SELECTING_CARD)
      .setSize(this.bg.width, this.bg.height)
      .setInteractive();

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
    gm.emitter.on(EVENTS.BUILD_MODE_UPDATED, this._onBuildModeUpdated, this);
    gm.emitter.on(
      EVENTS.CARD_REMOVE_MODE_UPDATED,
      this._onCardRemoveModeUpdated,
      this
    );
    gm.emitter.on(
      EVENTS.SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED,
      this._onSelectedPowerPlantToBuildIdUpdated,
      this
    );
    gm.emitter.on(
      EVENTS.SELECTED_POWER_PLANT_TO_REMOVE_IDS_UPDATED,
      this._onSelectedPowerPlantToRemoveIdsUpdate,
      this
    );
    // Trigger effects
    gm.emitter.on(EVENTS.ON_DICE_ROLLED, this._onDiceRolled, this);
    gm.emitter.on(EVENTS.ON_BUILD_POWER_PLANT, this._onBuildPowerPlant, this);
    gm.emitter.on(EVENTS.RESOURCE_COLLECTED, this._onResourceCollected, this);
  }

  private _onBuildModeUpdated() {
    const gm = GameManager.getInstance();
    if (this.stage === "built") return;
    if (gm.isBuildMode) {
      this.switchMode("build");
    } else {
      this.switchMode("table");
      this.setAlpha(1);
    }
  }
  private _onCardRemoveModeUpdated(enabled: boolean) {
    if (this.stage === "built") return;
    if (enabled) {
      this.switchMode("remove");
    } else {
      this.switchMode("table");
      this.setAlpha(1);
    }
  }
  private _onSelectedPowerPlantToBuildIdUpdated(id: string) {
    if (this.stage === "built") return;
    if (id === this.info.id && this.stage === "build") {
      this.setAlpha(1);
    } else {
      this.setAlpha(0.5);
    }
  }
  private _onSelectedPowerPlantToRemoveIdsUpdate() {
    if (this.stage === "built") return;
    const gm = GameManager.getInstance();
    if (gm.selectedPowerPlantToRemoveIds.has(this.info.id)) {
      this.setAlpha(1);
    } else {
      this.setAlpha(0.5);
    }
  }
  private _onDiceRolled(diceNum: number) {
    if (this.stage !== "built") return;
    this._checkEffects("on-dice-rolled", diceNum);
  }
  private _onBuildPowerPlant(id: string) {
    if (this.stage !== "built") return;
    const type = id.split("-")[0];
    this._checkEffects("on-build-power-plant", type);
  }
  private _onResourceCollected(_: number, type: ConsumableResource) {
    if (this.stage !== "built") return;
    this._checkEffects("resource-collected", type);
  }
  public destroy() {
    const gm = GameManager.getInstance();
    gm.emitter.off(EVENTS.BUILD_MODE_UPDATED, this._onBuildModeUpdated, this);
    gm.emitter.off(
      EVENTS.CARD_REMOVE_MODE_UPDATED,
      this._onCardRemoveModeUpdated,
      this
    );
    gm.emitter.off(
      EVENTS.SELECTED_POWER_PLANT_TO_BUILD_ID_UPDATED,
      this._onSelectedPowerPlantToBuildIdUpdated,
      this
    );
    gm.emitter.off(
      EVENTS.SELECTED_POWER_PLANT_TO_REMOVE_IDS_UPDATED,
      this._onSelectedPowerPlantToRemoveIdsUpdate,
      this
    );
    gm.emitter.off(EVENTS.ON_DICE_ROLLED, this._onDiceRolled, this);
    gm.emitter.off(EVENTS.ON_BUILD_POWER_PLANT, this._onBuildPowerPlant, this);
    gm.emitter.off(EVENTS.RESOURCE_COLLECTED, this._onResourceCollected, this);
    super.destroy();
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
    } else if (this.stage === "built") {
      this.setDepth(DEPTH.HOVERED_CARD);
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
    } else if (this.stage === "built") {
      this.setDepth(DEPTH.NORMAL);
    }
  }
  onPointerDown() {
    const gm = GameManager.getInstance();
    if (this.stage === "build") {
      gm.updateSelectedPowerPlantToBuildId(this.info.id);
    }
    if (this.stage === "remove") {
      gm.updateSelectedPowerPlantToRemoveIds(this.info.id);
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
      this.setDepth(DEPTH.TABLE_CARD);
    }
    if (
      (this.stage === "build" || this.stage === "remove") &&
      this.tableHiddenY
    ) {
      this.y = this.tableHiddenY - 172;
      this.setDepth(DEPTH.SELECTING_CARD);
    }
    if (this.stage === "built") {
      this.setDepth(DEPTH.NORMAL);
    }
  }

  private _getEffectText(): string {
    let result = "";
    for (const effect of this.info.effects) {
      // TODO: \n if effect length > 2
      result += CARD_MATCHED_EVENT_DESC_MAP[effect.causedBy.event].replace(
        "{}",
        effect.causedBy.value
      );
      const { event, buff } = effect.trigger;
      if (event) {
        result += CARD_EFFECT_TRIGGER_DESC_MAP[event.type].replace(
          "{}",
          event.value.toString()
        );
      }
      if (buff) {
        result += `${buff.desc} ${buff.operator}${buff.value}`;
      }
    }

    return result;
  }

  private _checkEffects(
    causedByEvent: CardEffect["causedBy"]["event"],
    causedByValue: any
  ) {
    const gm = GameManager.getInstance();
    for (const effect of this.info.effects) {
      if (effect.causedBy.event !== causedByEvent) continue;
      if (effect.causedBy.value !== causedByValue) continue;
      const { event, buff } = effect.trigger;
      if (event) gm.emitter.emit(event.type, event.value);
      if (buff) gm.doEffect(buff);
    }
  }
}
