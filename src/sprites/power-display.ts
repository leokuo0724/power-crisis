import { Scene } from "phaser";
import { COLORS } from "~/constants/colors";
import { FONT_KEYS } from "~/constants/font-keys";
import { EVENTS, GameManager } from "~/states/game-manager";

export class PowerDisplay extends Phaser.GameObjects.Container {
  private cachedPower!: number;
  private powerNumText: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const powerText = new Phaser.GameObjects.Text(scene, 0, 0, "POWER", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 60,
      color: COLORS.BLUE_6,
      align: "center",
    }).setOrigin(0.5);
    powerText.y += 72;

    const gm = GameManager.getInstance();
    this.cachedPower = gm.initPower;
    this.powerNumText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      this.cachedPower.toString(),
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 200,
        color: COLORS.BLUE_6,
        align: "center",
      }
    ).setOrigin(0.5);
    this.powerNumText.y -= 36;

    this.add([powerText, this.powerNumText]);

    gm.emitter.on(EVENTS.POWER_UPDATED, () => {
      this.powerNumTween(this.cachedPower, gm.currentPower);
    });
  }

  powerNumTween(from: number, to: number) {
    this.scene.tweens.addCounter({
      from,
      to,
      duration: 300,
      onUpdate: (tween) => {
        const value = Math.round(tween.getValue());
        this.powerNumText.setText(value.toString());
      },
      onComplete: () => {
        this.cachedPower = to;
      },
    });
  }
}
