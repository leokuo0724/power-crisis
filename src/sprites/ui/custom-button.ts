import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

export abstract class CustomButton extends Phaser.GameObjects.Container {
  private buttonBg: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  protected isDisabled = false;

  public abstract onClick(): void;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);

    this.buttonBg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_5_BUTTON_BG
    ).setOrigin(0.5);
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, text, {
      color: COLORS.WHITE_5,
      fontSize: 60,
      fontFamily: FONT_KEYS.PASSION_ONE,
    }).setOrigin(0.5);
    this.add([this.buttonBg, this.text]);

    this.setSize(this.buttonBg.width, this.buttonBg.height);
    this.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        if (this.isDisabled) return;
        this.buttonBg.setTexture(TEXTURE_KEYS.DARK_5_BUTTON_BG);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        if (this.isDisabled) return;
        this.buttonBg.setTexture(TEXTURE_KEYS.BLUE_5_BUTTON_BG);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        if (this.isDisabled) return;
        this.onClick();
      });
  }

  setDisabled(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.buttonBg.setTexture(
      isDisabled
        ? TEXTURE_KEYS.WHITE_7_BUTTON_BG
        : TEXTURE_KEYS.BLUE_5_BUTTON_BG
    );
  }
}
