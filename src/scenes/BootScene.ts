import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 在这里预加载资源
    // 示例：this.load.image('player', 'assets/player.png');
  }

  create(): void {
    // 显示一个简单的文本，表示框架运行正常
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 40, 'Phaser 3 + TypeScript + Vite', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, '框架已就绪！', {
        fontSize: '24px',
        color: '#00ff88',
      })
      .setOrigin(0.5);

    // 创建一个可交互的示例方块
    const box = this.add.rectangle(width / 2, height / 2 + 100, 120, 120, 0x00aaff);
    this.physics.add.existing(box);

    const body = box.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1, 1);
    body.setVelocity(150, 120);

    // 点击方块时给一个向上的冲量
    box.setInteractive();
    box.on('pointerdown', () => {
      body.setVelocityY(-300);
      body.setVelocityX((Math.random() - 0.5) * 400);
    });
  }
}
