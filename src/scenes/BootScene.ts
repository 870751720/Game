import * as Phaser from 'phaser';


export class BootScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private box!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 在这里预加载资源
    // 示例：this.load.image('player', 'assets/player.png');
  }

  create(): void {
    const { width, height } = this.scale;

    this.titleText = this.add
      .text(width / 2, height / 2 - 40, 'Phaser 3 + TypeScript + Vite', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(width / 2, height / 2 + 20, '框架已就绪！', {
        fontSize: '24px',
        color: '#00ff88',
      })
      .setOrigin(0.5);

    // 创建一个可交互的示例方块
    this.box = this.add.rectangle(width / 2, height / 2 + 100, 120, 120, 0x00aaff);
    this.physics.add.existing(this.box);

    const body = this.box.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1, 1);
    body.setVelocity(150, 120);

    // 点击方块时给一个向上的冲量
    this.box.setInteractive();
    this.box.on('pointerdown', () => {
      body.setVelocityY(-300);
      body.setVelocityX((Math.random() - 0.5) * 400);
    });

    // 监听窗口大小变化，重新布局元素
    this.scale.on('resize', this.handleResize, this);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const width = gameSize.width;
    const height = gameSize.height;

    this.titleText.setPosition(width / 2, height / 2 - 40);
    this.statusText.setPosition(width / 2, height / 2 + 20);
    this.box.setPosition(width / 2, height / 2 + 100);
  }
}
