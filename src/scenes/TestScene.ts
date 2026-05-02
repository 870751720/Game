import * as Phaser from 'phaser';
import { SceneKeys } from '../constants/SceneKeys';
import { AssetKeys } from '../constants/AssetKeys';
import { SCMLParser, PlayerDisplay } from '../objects/player';

/**
 * 测试页面场景
 * 用于快速验证引擎功能、调试 UI 或展示开发工具
 *
 * 当前集成：PlayerDisplay + Spriter 骨骼动画演示
 */
export class TestScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private cardBg!: Phaser.GameObjects.Rectangle;
  private goButton!: Phaser.GameObjects.Container;

  /** 玩家显示对象 */
  private playerDisplay!: PlayerDisplay;

  /** 当前动画显示 */
  private animLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.TestScene });
  }

  preload(): void {
    // 加载 Barbarian 01 Idle 序列（12 帧）—— 保留作为参考对比
    const baseKey = AssetKeys.Character.BarbarianIdle;
    for (let i = 1; i <= 12; i++) {
      const num = i.toString().padStart(3, '0');
      const frameKey = `${baseKey}_${num}`;
      const path = `assets/characters/barbarian/idle/barbarian_idle_${num}.png`;
      this.load.image(frameKey, path);
    }

    // 加载 Barbarian 02 骨骼动画资源
    const prefix = 'barbarian_02';
    const partsPath = 'assets/characters/barbarian_02';

    this.load.text(`${prefix}_scml`, `${partsPath}/animations.scml`);

    const parts = [
      'body',
      'face_01',
      'face_02',
      'face_03',
      'head',
      'left_arm',
      'left_hand',
      'left_leg',
      'right_arm',
      'right_hand',
      'right_leg',
      'shield',
      'weapon',
    ];

    for (const part of parts) {
      this.load.image(`${prefix}_${part}`, `${partsPath}/${part}.png`);
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
      .text(width / 2, height / 2 + 90, '点击右侧按钮切换动画/表情 • 按钮进入正式游戏', {
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
      if (pointer.button === 0) {
        this.createBurst(pointer.x, pointer.y);
      }
    });

    // ========== 9. PlayerDisplay 骨骼动画演示 ==========
    this.setupPlayerDisplay(width, height);

    // 10. 进入动画
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // 监听窗口大小变化
    this.scale.on('resize', this.handleResize, this);
  }

  /**
   * 初始化 PlayerDisplay 和控制面板
   */
  private setupPlayerDisplay(width: number, height: number): void {
    // 解析 SCML
    const scmlText = this.cache.text.get('barbarian_02_scml') as string;
    const scmlData = SCMLParser.parse(scmlText);

    // 创建 PlayerDisplay
    this.playerDisplay = new PlayerDisplay({
      scene: this,
      x: width * 0.3,
      y: height * 0.65,
      scmlData,
      texturePrefix: 'barbarian_02',
      scale: 0.3,
    });

    // 默认播放 Idle
    this.playerDisplay.play('Idle');

    // 创建控制面板
    this.createControlPanel(width, height);
  }

  /**
   * 创建右侧控制面板（动画切换 + 表情切换）
   */
  private createControlPanel(width: number, height: number): void {
    const panelX = width * 0.72;
    const panelY = height * 0.18;

    // 面板背景
    const panelBg = this.add.rectangle(
      panelX,
      panelY + 180,
      300,
      440,
      0x1a1a2e,
      0.9
    );
    panelBg.setStrokeStyle(2, 0xe74c3c);

    // 面板标题
    this.add
      .text(panelX, panelY - 10, '⚔️ 骨骼动画演示', {
        fontSize: '22px',
        color: '#e74c3c',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // 当前动画标签
    this.animLabel = this.add
      .text(panelX, panelY + 20, '动画: Idle', {
        fontSize: '16px',
        color: '#f39c12',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // 冻结首帧按钮
    this.createSmallButton(
      panelX,
      panelY + 48,
      '⏸ 冻结首帧',
      () => {
        this.playerDisplay.stop();
        this.playerDisplay.setTime(0);
      },
      0xe67e22
    );

    // 动画切换按钮
    const animations = [
      'Idle',
      'Idle Blink',
      'Walking',
      'Attacking',
      'Taunt',
      'Jump Start',
      'Jump Loop',
      'Hurt',
      'Dying',
    ];

    let btnY = panelY + 82;
    const btnCols = 2;
    const btnSpacingX = 130;
    const btnSpacingY = 38;

    animations.forEach((animName, idx) => {
      const col = idx % btnCols;
      const row = Math.floor(idx / btnCols);
      const bx = panelX - btnSpacingX / 2 + col * btnSpacingX;
      const by = btnY + row * btnSpacingY;

      const btn = this.createSmallButton(bx, by, animName, () => {
        this.playerDisplay.play(animName);
        this.animLabel.setText(`动画: ${animName}`);
      });
      btn.setScale(0.85);
    });

    btnY += Math.ceil(animations.length / btnCols) * btnSpacingY + 20;

    // 表情切换区域
    this.add
      .text(panelX, btnY, '😊 表情切换', {
        fontSize: '18px',
        color: '#3498db',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 35;

    const faces = [
      { label: '表情 1', texture: 'barbarian_02_face_01' },
      { label: '表情 2', texture: 'barbarian_02_face_02' },
      { label: '表情 3', texture: 'barbarian_02_face_03' },
    ];

    faces.forEach((face, idx) => {
      const bx = panelX - 80 + idx * 80;
      const btn = this.createSmallButton(bx, btnY, face.label, () => {
        this.playerDisplay.setPartTexture('Face 01', face.texture);
      });
      btn.setScale(0.8);
    });

    btnY += 50;

    // 武器/盾牌切换
    this.add
      .text(panelX, btnY, '🛡️ 装备切换', {
        fontSize: '18px',
        color: '#2ecc71',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 35;

    const equipBtns = [
      { label: '持剑', action: () => this.playerDisplay.setPartTexture('Weapon', 'barbarian_02_weapon') },
      { label: '持盾', action: () => this.playerDisplay.setPartTexture('Shield', 'barbarian_02_shield') },
      { label: '无盾', action: () => this.playerDisplay.setPartTexture('Shield', '') },
    ];

    equipBtns.forEach((eq, idx) => {
      const bx = panelX - 80 + idx * 80;
      const btn = this.createSmallButton(bx, btnY, eq.label, eq.action);
      btn.setScale(0.8);
    });
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
    return this.createSmallButton(x, y, label, onClick, 0x3498db);
  }

  /**
   * 创建小型按钮（用于控制面板）
   */
  private createSmallButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    color: number = 0x3498db
  ): Phaser.GameObjects.Container {
    const paddingX = 12;
    const paddingY = 8;

    const text = this.add.text(0, 0, label, {
      fontSize: '13px',
      color: '#ffffff',
    });

    const bg = this.add.rectangle(
      0,
      0,
      text.width + paddingX * 2,
      text.height + paddingY * 2,
      color
    );
    bg.setInteractive({ useHandCursor: true });

    const container = this.add.container(x, y, [bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(Phaser.Display.Color.GetColor(
        Math.min(255, ((color >> 16) & 0xff) + 30),
        Math.min(255, ((color >> 8) & 0xff) + 30),
        Math.min(255, (color & 0xff) + 30)
      ));
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(color);
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

    // 重新定位 PlayerDisplay
    if (this.playerDisplay) {
      this.playerDisplay.setPosition(w * 0.3, h * 0.65);
    }
  }
}
