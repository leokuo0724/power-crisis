import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { ICON_KEYS, IMAGE_KEYS } from "~/constants/image-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

const ICON_SCALE = 0.4;

export class CollectUnitBoard extends Phaser.GameObjects.Container {
  coalAmountText: Phaser.GameObjects.Text;
  oilAmountText: Phaser.GameObjects.Text;
  naturalGasAmountText: Phaser.GameObjects.Text;
  uraniumAmountText: Phaser.GameObjects.Text;
  biomassAmountText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_5_BOARD_BG
    );
    const titleText = new Phaser.GameObjects.Text(
      scene,
      -120,
      -36,
      "Collect unit",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    );
    const coalIcon = new Phaser.GameObjects.Image(
      scene,
      -108,
      18,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.COAL
    ).setScale(ICON_SCALE);
    this.coalAmountText = new Phaser.GameObjects.Text(scene, -84, 18, "1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    const oilIcon = new Phaser.GameObjects.Image(
      scene,
      -56,
      18,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.OIL
    ).setScale(ICON_SCALE);
    this.oilAmountText = new Phaser.GameObjects.Text(scene, -32, 18, "1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    const naturalGasIcon = new Phaser.GameObjects.Image(
      scene,
      -4,
      18,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.NATURAL_GAS
    ).setScale(ICON_SCALE);
    this.naturalGasAmountText = new Phaser.GameObjects.Text(
      scene,
      22,
      18,
      "1",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    const uraniumIcon = new Phaser.GameObjects.Image(
      scene,
      50,
      18,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.URANIUM
    ).setScale(ICON_SCALE);
    this.uraniumAmountText = new Phaser.GameObjects.Text(scene, 78, 18, "1", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 24,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    const biomassIcon = new Phaser.GameObjects.Image(
      scene,
      102,
      18,
      IMAGE_KEYS.ICONS,
      ICON_KEYS.BIOMASS
    ).setScale(ICON_SCALE);
    this.biomassAmountText = new Phaser.GameObjects.Text(
      scene,
      132,
      18,
      "ALL",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 24,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);

    this.add([
      bg,
      titleText,
      coalIcon,
      this.coalAmountText,
      oilIcon,
      this.oilAmountText,
      naturalGasIcon,
      this.naturalGasAmountText,
      uraniumIcon,
      this.uraniumAmountText,
      biomassIcon,
      this.biomassAmountText,
    ]);
    this.setSize(bg.width, bg.height);
  }
}
