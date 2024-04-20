import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { ResizableScene } from "~/lib/resizable-scene";
import PassionOneFont from "~/assets/fonts/PassionOne-Regular.ttf";
import NotoSansSemiBoldFont from "~/assets/fonts/NotoSans-SemiBold.ttf";
import { hexToDecimal } from "~/lib/utils";
import { COLORS } from "~/constants/colors";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

export class PreloadScene extends ResizableScene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload() {
    const graphics = new Phaser.GameObjects.Graphics(this);
    this._drawBlue5Tile(graphics);

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
        this.scene.start(SCENE_KEYS.GAME);
      });
  }

  private _loadFont(key: string, path: string) {
    const font = new FontFace(key, `url(${path})`);
    document.fonts.add(font);
    return font.load();
  }

  private _drawBlue5Tile(graphics: Phaser.GameObjects.Graphics) {
    graphics.clear();
    const width = 110;
    const height = 110;
    graphics
      .fillStyle(hexToDecimal(COLORS.BLUE_5))
      .fillRect(0, 0, width, height);
    graphics.generateTexture(TEXTURE_KEYS.BLUE_5_TILE, width, height);
  }
}
