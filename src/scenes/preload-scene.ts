import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";

import PassionOneFont from "~/assets/fonts/PassionOne-Regular.ttf";
import NotoSansSemiBoldFont from "~/assets/fonts/NotoSans-SemiBold.ttf";
import { hexToDecimal } from "~/lib/utils";
import { COLORS, ColorCode } from "~/constants/colors";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { IMAGE_KEYS } from "~/constants/image-keys";
import IconsPng from "~/assets/images/icons.png";
import IconsJson from "~/assets/images/icons.json";
import MarkerPng from "~/assets/images/marker.png";
import DicePng from "~/assets/images/dice.png";
import DiceJson from "~/assets/images/dice.json";
import CardPng from "~/assets/images/card.png";
import CardJson from "~/assets/images/card.json";
import PowerPlantPng from "~/assets/images/power-plant.png";
import PowerPlantJson from "~/assets/images/power-plant.json";
import { Scene } from "phaser";

export class PreloadScene extends Scene {
  private isFontsLoaded = false;
  private isAssetsLoaded = false;

  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload() {
    const centerX = this.sys.canvas.width / 2;
    const centerY = this.sys.canvas.height / 2;
    const progressBar = this.add.graphics().setDepth(1);
    const progressBox = this.add.graphics();
    progressBox.fillStyle(hexToDecimal(COLORS.BLUE_6), 1);
    progressBox.fillRect(centerX - 160, centerY - 25, 320, 40);
    this.load.on("progress", function (value: number) {
      progressBar.clear();
      progressBar.fillStyle(hexToDecimal(COLORS.BLUE_4), 1);
      progressBar.fillRect(
        centerX - 160 + 5,
        centerY - 25 + 5,
        310 * value,
        30
      );
    });

    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawTile(graphics, COLORS.BLUE_5, TEXTURE_KEYS.BLUE_5_TILE);
    this._drawTile(graphics, COLORS.BROWN_4, TEXTURE_KEYS.BROWN_4_TILE);
    this._drawTile(graphics, COLORS.BROWN_6, TEXTURE_KEYS.BROWN_6_TILE);
    this._drawTile(graphics, COLORS.YELLOW_7, TEXTURE_KEYS.YELLOW_7_TILE);
    this._drawTile(graphics, COLORS.DARK_5, TEXTURE_KEYS.DARK_5_TILE);
    this._drawTile(graphics, COLORS.ORANGE_6, TEXTURE_KEYS.ORANGE_6_TILE);
    this._drawTile(graphics, COLORS.GREEN_5, TEXTURE_KEYS.GREEN_5_TILE);
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.BLUE_4,
      TEXTURE_KEYS.BLUE_4_BUTTON_BG
    );
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.BLUE_5,
      TEXTURE_KEYS.BLUE_5_BUTTON_BG
    );
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.BLUE_6,
      TEXTURE_KEYS.BLUE_6_BUTTON_BG
    );
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.DARK_5,
      TEXTURE_KEYS.DARK_5_BUTTON_BG
    );
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.WHITE_5,
      TEXTURE_KEYS.WHITE_5_BUTTON_BG
    );
    this._drawBg(
      graphics,
      250,
      80,
      COLORS.WHITE_7,
      TEXTURE_KEYS.WHITE_7_BUTTON_BG
    );
    this._drawBg(
      graphics,
      575,
      272,
      COLORS.BLUE_5,
      TEXTURE_KEYS.BLUE_5_DIALOG_BG
    );
    this._drawBg(
      graphics,
      320,
      104,
      COLORS.BLUE_6,
      TEXTURE_KEYS.BLUE_6_BOARD_BG
    );
    this._drawBg(
      graphics,
      320,
      92,
      COLORS.BLUE_5,
      TEXTURE_KEYS.BLUE_5_BOARD_BG
    );
    this._drawBg(
      graphics,
      320,
      120,
      COLORS.BLUE_4,
      TEXTURE_KEYS.BLUE_4_BOARD_BG
    );
    this._drawBg(
      graphics,
      1920,
      1080,
      COLORS.BLUE_7,
      TEXTURE_KEYS.BLUE_7_SCREEN_BG,
      0.9
    );
    this._drawBg(
      graphics,
      1264,
      8,
      COLORS.WHITE_5,
      TEXTURE_KEYS.WHITE_5_BOTTOM_LINE
    );
    this._drawBg(
      graphics,
      400,
      480,
      COLORS.BLUE_5,
      TEXTURE_KEYS.BLUE_5_CONTAINER
    );
    this._drawBg(
      graphics,
      300,
      128,
      COLORS.BLUE_6,
      TEXTURE_KEYS.BLUE_6_HINT_BG
    );

    this.load.atlas(IMAGE_KEYS.ICONS, IconsPng, IconsJson);
    this.load.atlas(IMAGE_KEYS.DICE, DicePng, DiceJson);
    this.load.atlas(IMAGE_KEYS.CARD, CardPng, CardJson);
    this.load.atlas(IMAGE_KEYS.POWER_PLANT, PowerPlantPng, PowerPlantJson);
    this.load.image(IMAGE_KEYS.MARKER, MarkerPng);

    this.load.on("complete", () => {
      this.isAssetsLoaded = true;
    });

    const loadPassionOneFont = this._loadFont(
      FONT_KEYS.PASSION_ONE,
      PassionOneFont
    );
    const loadNotoSansFont = this._loadFont(
      FONT_KEYS.NOTO_SANS,
      NotoSansSemiBoldFont
    );
    Promise.allSettled([loadPassionOneFont, loadNotoSansFont])
      .catch((error) => console.log(error))
      .finally(() => {
        this.isFontsLoaded = true;
      });
  }

  create() {
    const timer = setInterval(() => {
      if (this.isFontsLoaded && this.isAssetsLoaded) {
        clearInterval(timer);
        this.scene.start(SCENE_KEYS.GAME);
      }
    }, 100);
  }

  private _loadFont(key: string, path: string) {
    const font = new FontFace(key, `url(${path})`);
    document.fonts.add(font);
    return font.load();
  }

  private _drawTile(
    graphics: Phaser.GameObjects.Graphics,
    color: ColorCode,
    textureKey: string
  ) {
    graphics.clear();
    const width = 110;
    const height = 110;
    graphics.fillStyle(hexToDecimal(color)).fillRect(0, 0, width, height);
    graphics.generateTexture(textureKey, width, height);
  }

  private _drawBg(
    graphics: Phaser.GameObjects.Graphics,
    width: number,
    height: number,
    color: ColorCode,
    textureKey: string,
    opacity: number = 1
  ) {
    graphics.clear();
    graphics
      .fillStyle(hexToDecimal(color), opacity)
      .fillRect(0, 0, width, height);
    graphics.generateTexture(textureKey, width, height);
  }
}
