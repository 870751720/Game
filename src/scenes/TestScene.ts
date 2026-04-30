import * as Phaser from 'phaser';
import { SceneKeys } from '../constants/SceneKeys';
import { AssetKeys } from '../constants/AssetKeys';

/**
 * 测试页面场景
 * 用于快速验证引擎功能、调试 UI 或展示开发工具
 */
export class TestScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private cardBg!: Phaser.GameObjects.Rectangle;
  private goButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: SceneKeys.TestScene });
  }

  preload(): void {
    // 加载 Barbarian 01 Idle 序列（12 帧）
    const baseKey = AssetKeys.Character.BarbarianIdle;
    for (let i = 1; i <= 12; i++) {
      const num = i.toString().padStart(3, '0');
      const frameKey = `${baseKey}_${num}`;
      const path = `assets/characters/barbarian/idle/barbarian_idle_${num}.png`;
      this.load.image(frameKey, path);
    }
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. 动态背景网格
    this.createGridBackground(width, height);

    // 2. 信息卡片背景（带半透明）
    this.cardBg = this.add.rectangle(
      width / 2,
      height / 2,
      480,
      320,
      0x1a1a2e,
      0.85
    );
    this.cardBg.setStrokeStyle(2, 0x3498db);

    // 3. 标题（带呼吸动画）
    this.titleText = this.add
      .text(width / 2, height / 2 - 110, '🧪 测试页面', {
        fontSize: '42px',
        color: '#f39c12',
        fontStyle: 'bold',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.titleText,
      scale: 1.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 4. 信息面板（逐行浮现）
    const infoLines = [
      `Phaser 版本 : ${Phaser.VERSION}`,
      `渲染模式   : ${this.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`,
      `画布尺寸   : ${Math.round(width)} × ${Math.round(height)}`,
      `当前场景   : ${SceneKeys.TestScene}`,
    ];

    this.infoText = this.add
      .text(width / 2, height / 2 - 10, infoLines.join('\n'), {
        fontSize: '18px',
        color: '#ecf0f1',
        align: 'center',
        lineSpacing: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.infoText,
      alpha: 1,
      y: height / 2 - 20,
      duration: 600,
      delay: 200,
      ease: 'Power2',
    });

    // 5. 提示文字
    this.hintText = this.add
      .text(width / 2, height / 2 + 90, '点击任意位置生成粒子 • 按钮进入正式游戏', {
        fontSize: '14px',
        color: '#95a5a6',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.hintText,
      alpha: 1,
      duration: 500,
      delay: 600,
    });

    // 6. 跳转按钮（带悬停动画）
    this.goButton = this.createButton(
      width / 2,
      height / 2 + 140,
      '▶ 进入 BootScene',
      () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SceneKeys.BootScene);
        });
      }
    );

    this.goButton.setAlpha(0);
    this.tweens.add({
      targets: this.goButton,
      alpha: 1,
      duration: 500,
      delay: 800,
    });

    // 7. 预生成粒子纹理（白色，通过 tint 上色）
    const particleGraphics = this.make.graphics({ x: 0, y: 0 });
    particleGraphics.fillStyle(0xffffff, 1);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture('particle', 8, 8);
    particleGraphics.destroy();

    // 8. 点击粒子特效
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // 避免点击按钮时也触发
      if (pointer.button === 0) {
        this.createBurst(pointer.x, pointer.y);
      }
    });

    // 8. 注册 Barbarian Idle 动画（仅首次）
    const animKey = `${AssetKeys.Character.BarbarianIdle}_anim`;
    if (!this.anims.exists(animKey)) {
      const idleFrames = [];
      for (let i = 1; i <= 12; i++) {
        const num = i.toString().padStart(3, '0');
        idleFrames.push({ key: `${AssetKeys.Character.BarbarianIdle}_${num}` });
      }
      this.anims.create({
        key: animKey,
        frames: idleFrames,
        frameRate: 10,
        repeat: -1,
      });
    }

    // 9. 播放角色动画（放在画面底部）
    const firstFrameKey = `${AssetKeys.Character.BarbarianIdle}_001`;
    const sprite = this.add.sprite(width / 2, height - 80, firstFrameKey);
    sprite.setName('barbarian_sprite');
    sprite.setScale(0.4);
    sprite.play(animKey);

    // 10. 进入动画
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // 监听窗口大小变化
    this.scale.on('resize', this.handleResize, this);
  }

  /**
   * 创建动态网格背景
   */
  private createGridBackground(width: number, height: number): void {
    const gridSize = 40;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x34495e, 0.3);

    for (let x = 0; x <= width; x += gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    graphics.strokePath();
  }

  /**
   * 在指定位置生成爆发粒子
   */
  private createBurst(x: number, y: number): void {
    const colors = [0xf39c12, 0x3498db, 0xe74c3c, 0x2ecc71, 0x9b59b6];
    const tint = Phaser.Utils.Array.GetRandom(colors);

    const emitter = this.add.particles(x, y, 'particle', {
      speed: { min: 80, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
      gravityY: 200,
      quantity: 12,
      tint,
      emitting: false,
    });

    emitter.explode(12);

    // 等所有粒子生命周期结束后再销毁发射器（800ms > 600ms lifespan）
    this.time.delayedCall(800, () => {
      emitter.destroy();
    });
  }

  /**
   * 创建一个带悬停/点击动画的按钮
   */
  private createButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const paddingX = 28;
    const paddingY = 14;

    const text = this.add.text(0, 0, label, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    const bg = this.add.rectangle(
      0,
      0,
      text.width + paddingX * 2,
      text.height + paddingY * 2,
      0x3498db
    );
    bg.setInteractive({ useHandCursor: true });

    const shadow = this.add.rectangle(
      4,
      4,
      text.width + paddingX * 2,
      text.height + paddingY * 2,
      0x1a5276,
      0.6
    );

    const container = this.add.container(x, y, [shadow, bg, text]);

    // 悬停效果
    bg.on('pointerover', () => {
      bg.setFillStyle(0x2980b9);
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x3498db);
      container.setScale(1);
    });
    bg.on('pointerdown', () => {
      container.setScale(0.95);
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 100,
        ease: 'Back.easeOut',
      });
      onClick();
    });

    return container;
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const w = gameSize.width;
    const h = gameSize.height;

    this.titleText.setPosition(w / 2, h / 2 - 110);
    this.infoText.setPosition(w / 2, h / 2 - 20);
    this.hintText.setPosition(w / 2, h / 2 + 90);
    this.goButton.setPosition(w / 2, h / 2 + 140);
    this.cardBg.setPosition(w / 2, h / 2);

    // 重新定位角色 sprite（通过场景查找）
    const sprite = this.children.getByName('barbarian_sprite') as Phaser.GameObjects.Sprite;
    if (sprite) {
      sprite.setPosition(w / 2, h - 80);
    }
  }
}
