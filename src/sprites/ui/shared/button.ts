import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { TEXTURE_KEYS } from "~/constants/texture-keys";

type ButtonType = "primary" | "secondary";
type ButtonStates = "normal" | "hover" | "disabled";

const BUTTON_TYPE_TEXTURE_MAP: Record<
  ButtonType,
  Record<ButtonStates, string>
> = {
  primary: {
    normal: TEXTURE_KEYS.DARK_5_BUTTON_BG,
    hover: TEXTURE_KEYS.BLUE_6_BUTTON_BG,
    disabled: TEXTURE_KEYS.WHITE_7_BUTTON_BG,
  },
  secondary: {
    normal: TEXTURE_KEYS.BLUE_4_BUTTON_BG,
    hover: TEXTURE_KEYS.WHITE_7_BUTTON_BG,
    disabled: TEXTURE_KEYS.WHITE_7_BUTTON_BG,
  },
};

export abstract class Button extends Phaser.GameObjects.Container {
  private buttonBg: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  protected isDisabled = false;
  private buttonType: ButtonType;

  public abstract onClick(): void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    type: "primary" | "secondary"
  ) {
    super(scene, x, y);

    this.buttonType = type;
    this.buttonBg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      BUTTON_TYPE_TEXTURE_MAP[type].normal
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
        this.buttonBg.setTexture(BUTTON_TYPE_TEXTURE_MAP[type].hover);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        if (this.isDisabled) return;
        this.buttonBg.setTexture(BUTTON_TYPE_TEXTURE_MAP[type].normal);
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
        ? BUTTON_TYPE_TEXTURE_MAP[this.buttonType].disabled
        : BUTTON_TYPE_TEXTURE_MAP[this.buttonType].normal
    );
  }
}
