import { Scene } from "phaser";
import { TEXTURE_KEYS } from "~/constants/texture-keys";
import { FONT_KEYS } from "~/constants/font-keys";
import { COLORS } from "~/constants/colors";
import { DEPTH } from "~/constants/depth";
import {
  BuffNerfType,
  PERMANENT_BUFFS,
  PERMANENT_NERFS,
} from "~/types/effects";
import { EVENTS, GameManager } from "~/states/game-manager";

export class PolicySelectScreen extends Phaser.GameObjects.Container {
  private policy1: PolicyContainer;
  private policy2: PolicyContainer;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_7_SCREEN_BG
    );
    const titleText = new Phaser.GameObjects.Text(
      scene,
      0,
      -320,
      "ANNOUNCE A PERMANENT POLICY",
      {
        fontFamily: FONT_KEYS.PASSION_ONE,
        fontSize: 60,
        color: COLORS.WHITE_5,
      }
    ).setOrigin(0.5);
    this.policy1 = new PolicyContainer(
      scene,
      -320,
      48,
      PERMANENT_BUFFS[0],
      PERMANENT_NERFS[0]
    );
    this.policy2 = new PolicyContainer(
      scene,
      320,
      48,
      PERMANENT_BUFFS[0],
      PERMANENT_NERFS[0]
    );
    this._updatePolicies();

    this.add([bg, titleText, this.policy1, this.policy2])
      .setDepth(DEPTH.RESULT_SCREEN)
      .setVisible(false);
    const gm = GameManager.getInstance();
    gm.emitter.on(EVENTS.TOGGLE_POLICY_SCREEN, (visible: boolean) => {
      if (visible) {
        this.setVisible(true);
        this._updatePolicies();
      } else {
        this.setVisible(false);
        gm.toggleCardSelectScreen(true);
      }
    });
  }

  private _updatePolicies() {
    const { buff, nerf } = this._pickPolicySet();
    this.policy1.updatePolicy(buff, nerf);
    const { buff: buff2, nerf: nerf2 } = this._pickPolicySet();
    this.policy2.updatePolicy(buff2, nerf2);
  }

  private _pickPolicySet() {
    let buff = Phaser.Math.RND.pick(PERMANENT_BUFFS);
    let nerf;
    while (true) {
      nerf = Phaser.Math.RND.pick(PERMANENT_NERFS);
      if (buff.type !== nerf.type) break;
    }
    return { buff, nerf };
  }
}

class PolicyContainer extends Phaser.GameObjects.Container {
  private buffText: Phaser.GameObjects.Text;
  buff!: BuffNerfType;
  private nerfText: Phaser.GameObjects.Text;
  nerf!: BuffNerfType;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    buff: BuffNerfType,
    nerf: BuffNerfType
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      TEXTURE_KEYS.BLUE_5_CONTAINER
    ).setOrigin(0.5);
    this.buffText = new Phaser.GameObjects.Text(scene, 0, -100, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 48,
      color: COLORS.WHITE_5,
      align: "center",
    })
      .setOrigin(0.5)
      .setWordWrapWidth(360);
    const butText = new Phaser.GameObjects.Text(scene, 0, 0, "BUT", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 36,
      color: COLORS.WHITE_5,
    }).setOrigin(0.5);
    this.nerfText = new Phaser.GameObjects.Text(scene, 0, 100, "", {
      fontFamily: FONT_KEYS.PASSION_ONE,
      fontSize: 48,
      color: COLORS.WHITE_5,
      align: "center",
    })
      .setOrigin(0.5)
      .setWordWrapWidth(360);

    this.add([bg, this.buffText, butText, this.nerfText]);
    this.setSize(bg.width, bg.height)
      .setInteractive()
      .on("pointerover", () => this.setScale(1.1))
      .on("pointerout", () => this.setScale(1))
      .on("pointerdown", () => {
        const gm = GameManager.getInstance();
        gm.selectPolicy(this.buff, this.nerf);
      });
    this.updatePolicy(buff, nerf);
  }

  updatePolicy(buff: BuffNerfType, nerf: BuffNerfType) {
    this.buff = buff;
    this.nerf = nerf;
    this.buffText.setText(buff.desc);
    this.nerfText.setText(nerf.desc);
  }
}
