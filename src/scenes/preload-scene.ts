import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { ResizableScene } from "~/lib/resizable-scene";
import PassionOneFont from "~/assets/fonts/PassionOne-Regular.ttf";
import NotoSansSemiBoldFont from "~/assets/fonts/NotoSans-SemiBold.ttf";
import { hexToDecimal } from "~/lib/utils";
import { COLORS, ColorCode } from "~/constants/colors";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { ATLAS_KEYS } from "~/constants/atlas-keys";
import IconsPng from "~/assets/images/icons.png";
import IconsJson from "~/assets/images/icons.json";

export class PreloadScene extends ResizableScene {
  private isFontsLoaded = false;
  private isAssetsLoaded = false;

  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload() {
    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawTiles(graphics);

    this.load.atlas(ATLAS_KEYS.ICONS, IconsPng, IconsJson);

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

  private _drawTiles(graphics: Phaser.GameObjects.Graphics) {
    this._drawTile(graphics, COLORS.BLUE_5, TEXTURE_KEYS.BLUE_5_TILE);
    this._drawTile(graphics, COLORS.BROWN_4, TEXTURE_KEYS.BROWN_4_TILE);
    this._drawTile(graphics, COLORS.BROWN_6, TEXTURE_KEYS.BROWN_6_TILE);
    this._drawTile(graphics, COLORS.YELLOW_7, TEXTURE_KEYS.YELLOW_7_TILE);
    this._drawTile(graphics, COLORS.DARK_5, TEXTURE_KEYS.DARK_5_TILE);
    this._drawTile(graphics, COLORS.ORANGE_6, TEXTURE_KEYS.ORANGE_6_TILE);
    this._drawTile(graphics, COLORS.GREEN_5, TEXTURE_KEYS.GREEN_5_TILE);
  }
}
