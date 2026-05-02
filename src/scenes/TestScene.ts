import * as Phaser from 'phaser';
import { SceneKeys } from '../constants/SceneKeys';
import { SCMLParser, PlayerDisplay } from '../objects/player';
import { CharacterLookManager } from '../managers/CharacterLookManager';
import { AssetLoader } from '../utils/AssetLoader';
import { characterLookTableData } from '../data/characterLookTable';
import { outfitPartTableData } from '../data/outfitPartTable';
import type { CharacterLookSave } from '../types/character-look';

/**
 * 角色外观切换测试场景
 *
 * 用于验证 PlayerDisplay 各部位独立切换功能
 */
export class TestScene extends Phaser.Scene {
  /** 玩家显示对象 */
  private playerDisplay!: PlayerDisplay;

  /** 当前动画显示标签 */
  private animLabel!: Phaser.GameObjects.Text;

  /** 外观管理器 */
  private lookManager!: CharacterLookManager;

  constructor() {
    super({ key: SceneKeys.TestScene });
  }

  preload(): void {
    // 加载共享骨骼动画（按动画拆分后的独立文件）
    const animNames = [
      'idle',
      'idle_blink',
      'walking',
      'attacking',
      'taunt',
      'jump_start',
      'jump_loop',
      'hurt',
      'dying',
    ];
    for (const name of animNames) {
      this.load.text(`anim_${name}`, `assets/animations/humanoid/${name}.scml`);
    }

    // 从配表自动加载角色图片资源
    AssetLoader.preloadImages(this, 'character');
  }

  create(): void {
    const { width, height } = this.scale;

    // 深色纯色背景
    this.cameras.main.setBackgroundColor('#111827');

    // 初始化 PlayerDisplay 和控制面板
    this.setupPlayerDisplay(width, height);
    this.createControlPanel(width, height);

    // 进入淡入动画
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // 监听窗口大小变化
    this.scale.on('resize', this.handleResize, this);
  }

  /**
   * 初始化 PlayerDisplay
   */
  private setupPlayerDisplay(width: number, height: number): void {
    // 解析并合并多个 SCML 动画文件
    const animNames = [
      'idle',
      'idle_blink',
      'walking',
      'attacking',
      'taunt',
      'jump_start',
      'jump_loop',
      'hurt',
      'dying',
    ];
    const scmlDatas = animNames.map((name) =>
      SCMLParser.parse(this.cache.text.get(`anim_${name}`) as string)
    );
    const scmlData = SCMLParser.mergeAnimations(scmlDatas);

    // 初始化外观管理器并加载两张配表
    const lookManager = new CharacterLookManager();
    lookManager.loadLooks(characterLookTableData);
    lookManager.loadParts(outfitPartTableData);

    // 构造默认存档
    const defaultSave: CharacterLookSave = CharacterLookManager.createEmptySave('barbarian_02_default');
    const config = lookManager.getConfig(defaultSave.baseId);

    // 创建 PlayerDisplay
    this.playerDisplay = new PlayerDisplay({
      scene: this,
      x: width * 0.3,
      y: height * 0.6,
      scmlData,
      texturePrefix: config?.texturePrefix ?? 'common',
      scale: 0.35,
    });

    // 应用配表默认外观
    lookManager.applyToDisplay(defaultSave, this.playerDisplay);

    // 默认播放 Idle
    this.playerDisplay.play('Idle');

    this.lookManager = lookManager;
  }

  /**
   * 创建右侧控制面板
   */
  private createControlPanel(width: number, height: number): void {
    const panelX = width * 0.76;
    const startY = height * 0.06;

    // 面板背景
    const panelBg = this.add.rectangle(
      panelX,
      startY + 320,
      340,
      640,
      0x1f2937,
      0.95
    );
    panelBg.setStrokeStyle(2, 0x374151);

    let btnY = startY;

    // 当前动画标签
    this.animLabel = this.add
      .text(panelX, btnY, '动画: Idle', {
        fontSize: '16px',
        color: '#f39c12',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 28;

    // 冻结首帧按钮
    this.createSmallButton(panelX, btnY, '⏸ 冻结首帧', () => {
      this.playerDisplay.stop();
      this.playerDisplay.setTime(0);
    });

    btnY += 40;

    // 动画切换
    this.add
      .text(panelX, btnY, '🎬 动画切换', {
        fontSize: '14px',
        color: '#9ca3af',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 22;

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

    const animCols = 2;
    const animSpacingX = 150;
    const animSpacingY = 32;

    animations.forEach((animName, idx) => {
      const col = idx % animCols;
      const row = Math.floor(idx / animCols);
      const bx = panelX - animSpacingX / 2 + col * animSpacingX;
      const by = btnY + row * animSpacingY;

      const btn = this.createSmallButton(bx, by, animName, () => {
        this.playerDisplay.play(animName);
        this.animLabel.setText(`动画: ${animName}`);
      });
      btn.setScale(0.75);
    });

    btnY += Math.ceil(animations.length / animCols) * animSpacingY + 16;

    // 配表外观配置
    this.add
      .text(panelX, btnY, '📋 外观配置', {
        fontSize: '14px',
        color: '#9ca3af',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 22;

    const configBtns = [
      {
        label: '野蛮人01',
        action: () => {
          const save = CharacterLookManager.createEmptySave('barbarian_01_default');
          this.lookManager.applyToDisplay(save, this.playerDisplay);
        },
      },
      {
        label: '野蛮人02',
        action: () => {
          const save = CharacterLookManager.createEmptySave('barbarian_02_default');
          this.lookManager.applyToDisplay(save, this.playerDisplay);
        },
      },
      {
        label: '野蛮人03',
        action: () => {
          const save = CharacterLookManager.createEmptySave('barbarian_03_default');
          this.lookManager.applyToDisplay(save, this.playerDisplay);
        },
      },
    ];

    configBtns.forEach((cfg, idx) => {
      const bx = panelX - 80 + idx * 80;
      const btn = this.createSmallButton(bx, btnY, cfg.label, cfg.action);
      btn.setScale(0.75);
    });

    btnY += 40;

    // 表情切换
    this.add
      .text(panelX, btnY, '😊 表情切换', {
        fontSize: '14px',
        color: '#9ca3af',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 22;

    const faces = [
      { label: '表情 1', texture: 'common_face_01' },
      { label: '表情 2', texture: 'common_face_02' },
      { label: '表情 3', texture: 'common_face_03' },
    ];

    faces.forEach((face, idx) => {
      const bx = panelX - 80 + idx * 80;
      const btn = this.createSmallButton(bx, btnY, face.label, () => {
        this.playerDisplay.setPartTexture('Face 01', face.texture);
      });
      btn.setScale(0.75);
    });

    btnY += 40;

    // 各部位切换
    this.add
      .text(panelX, btnY, '👤 部位切换', {
        fontSize: '14px',
        color: '#9ca3af',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    btnY += 22;

    const partConfigs = [
      {
        label: '身体',
        timeline: 'Body',
        textures: ['common_body_01', 'common_body_02', 'common_body_03'],
      },
      {
        label: '头部',
        timeline: 'Head',
        textures: ['common_head_01', 'common_head_02', 'common_head_03'],
      },
      {
        label: '左臂',
        timeline: 'Left Arm',
        textures: ['common_left_arm_01', 'common_left_arm_02', 'common_left_arm_03'],
      },
      {
        label: '右臂',
        timeline: 'Right Arm',
        textures: ['common_right_arm_01', 'common_right_arm_02', 'common_right_arm_03'],
      },
      {
        label: '左手',
        timeline: 'Left Hand',
        textures: ['common_left_hand_01', 'common_left_hand_02', 'common_left_hand_03'],
      },
      {
        label: '右手',
        timeline: 'Right Hand',
        textures: ['common_right_hand_01', 'common_right_hand_02', 'common_right_hand_03'],
      },
      {
        label: '左腿',
        timeline: 'Left Leg',
        textures: ['common_left_leg_01', 'common_left_leg_02', 'common_left_leg_03'],
      },
      {
        label: '右腿',
        timeline: 'Right Leg',
        textures: ['common_right_leg_01', 'common_right_leg_02', 'common_right_leg_03'],
      },
      {
        label: '武器',
        timeline: 'Weapon',
        textures: ['common_weapon_01', 'common_weapon_02', 'common_weapon_03'],
      },
      {
        label: '盾牌',
        timeline: 'Shield',
        textures: ['common_shield_01', 'common_shield_02', 'common_shield_03'],
      },
    ];

    const partSpacingX = 70;

    partConfigs.forEach((part) => {
      // 部位标签（左对齐，在面板左侧）
      this.add
        .text(panelX - 140, btnY, part.label, {
          fontSize: '12px',
          color: '#d1d5db',
        })
        .setOrigin(0, 0.5);

      // 三个变体按钮
      part.textures.forEach((texture, idx) => {
        const bx = panelX - 60 + idx * partSpacingX;
        const btn = this.createSmallButton(bx, btnY, String(idx + 1), () => {
          this.playerDisplay.setPartTexture(part.timeline, texture);
        });
        btn.setScale(0.65);
      });

      btnY += 30;
    });
  }

  /**
   * 创建小型按钮
   */
  private createSmallButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    color: number = 0x3b82f6
  ): Phaser.GameObjects.Container {
    const paddingX = 10;
    const paddingY = 6;

    const text = this.add.text(0, 0, label, {
      fontSize: '12px',
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

    // 重新定位 PlayerDisplay
    if (this.playerDisplay) {
      this.playerDisplay.setPosition(w * 0.3, h * 0.6);
    }

    // 重新创建控制面板（简单起见，移除旧面板并重建）
    // 实际项目中可优化为仅更新位置
    this.scene.restart();
  }
}
