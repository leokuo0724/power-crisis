import { SCENE_KEYS } from "~/constants/scene-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { ResizableScene } from "~/lib/resizable-scene";
import PassionOneFont from "~/assets/fonts/PassionOne-Regular.ttf";
import NotoSansSemiBoldFont from "~/assets/fonts/NotoSans-SemiBold.ttf";

export class PreloadScene extends ResizableScene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload() {
    const loadPassionOneFont = this.loadFont(
      FONT_KEYS.PASSION_ONE,
      PassionOneFont
    );
    const loadNotoSansFont = this.loadFont(
      FONT_KEYS.NOTO_SANS,
      NotoSansSemiBoldFont
    );
    Promise.allSettled([loadPassionOneFont, loadNotoSansFont])
      .catch((error) => console.log(error))
      .finally(() => {
        this.scene.start(SCENE_KEYS.GAME);
      });
  }

  loadFont(key: string, path: string) {
    const font = new FontFace(key, `url(${path})`);
    document.fonts.add(font);
    return font.load();
  }
}
