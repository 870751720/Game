import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TestScene } from './scenes/TestScene';
import { AppConfig } from './constants/AppConfig';

/**
 * 根据配置决定场景注册顺序
 * Phaser 默认启动 scene 数组的第一个场景
 */
const scenes =
  AppConfig.defaultScene === 'TestScene'
    ? [TestScene, BootScene]
    : [BootScene, TestScene];

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#2d2d2d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false,
    },
  },
};
