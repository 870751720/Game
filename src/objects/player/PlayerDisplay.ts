import * as Phaser from 'phaser';
import { SpriterRuntime } from './SpriterRuntime';
import type { SCMLData, SCMLFile } from './spriter-types';

export interface PlayerDisplayConfig {
  /** 所属场景 */
  scene: Phaser.Scene;

  /** X 坐标 */
  x: number;

  /** Y 坐标 */
  y: number;

  /** SCML 动画数据 */
  scmlData: SCMLData;

  /** 纹理 key 前缀（如 'barbarian_02'） */
  texturePrefix: string;

  /** 整体缩放，默认 1 */
  scale?: number;
}

/**
 * Spriter 骨骼动画玩家显示对象
 *
 * 基于 Phaser Container + 多层 Sprite 实现：
 * - 解析 SCML 数据，为每个部件创建 Sprite
 * - 使用 SpriterRuntime 计算骨骼变换
 * - 每帧同步更新各 Sprite 的位置、旋转、缩放
 *
 * 使用方式：
 * 1. 场景 preload 中加载 SCML 和各部件 PNG
 * 2. 创建 PlayerDisplay 实例
 * 3. 调用 play() 播放动画
 */
export class PlayerDisplay extends Phaser.GameObjects.Container {
  private runtime: SpriterRuntime;

  /** timelineName → Sprite 映射 */
  private sprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  /** timelineName → 文件信息（用于设置 origin） */
  private fileInfos: Map<string, SCMLFile> = new Map();

  /** 当前动画中可见的部件名称集合 */
  private visibleParts: Set<string> = new Set();

  /** 纹理前缀 */
  private texturePrefix: string;

  constructor(config: PlayerDisplayConfig) {
    const { scene, x, y, scmlData, texturePrefix, scale = 1 } = config;
    super(scene, x, y);

    this.texturePrefix = texturePrefix;

    scene.add.existing(this);
    scene.events.on('update', this.handleSceneUpdate, this);

    this.setScale(scale);

    // 初始化运行时
    this.runtime = new SpriterRuntime(scmlData);

    // 为所有可能的部件预创建 Sprite
    this.createSprites(scmlData);
  }

  /**
   * 播放指定动画
   */
  play(animationName: string): void {
    this.runtime.setAnimation(animationName);
    this.runtime.play();
  }

  /**
   * 暂停动画
   */
  pause(): void {
    this.runtime.pause();
  }

  /**
   * 恢复动画
   */
  resume(): void {
    this.runtime.play();
  }

  /**
   * 停止动画（回到起始帧）
   */
  stop(): void {
    this.runtime.stop();
    this.updateSprites();
  }

  /**
   * 设置动画时间（毫秒）
   */
  setTime(time: number): void {
    this.runtime.setTime(time);
    this.updateSprites();
  }

  /**
   * 获取当前动画名
   */
  getCurrentAnimation(): string | null {
    return this.runtime.getCurrentAnimationName();
  }

  /**
   * 切换指定 timeline 的纹理（用于换装/换表情）
   * @param timelineName SCML timeline 名称（如 'Face 01'）
   * @param textureKey Phaser 纹理 key，空字符串或不存在的 key 会隐藏该部件
   */
  setPartTexture(timelineName: string, textureKey: string): void {
    const sprite = this.sprites.get(timelineName);
    if (!sprite) return;

    if (!textureKey || !this.scene.textures.exists(textureKey)) {
      sprite.setVisible(false);
      return;
    }

    sprite.setTexture(textureKey);
    sprite.setVisible(true);
  }

  /**
   * 设置指定 timeline 部件的可见性
   */
  setPartVisible(timelineName: string, visible: boolean): void {
    const sprite = this.sprites.get(timelineName);
    if (sprite) {
      sprite.setVisible(visible);
    }
  }

  /**
   * 销毁对象
   */
  destroy(fromScene?: boolean): void {
    this.scene.events.off('update', this.handleSceneUpdate, this);
    this.sprites.clear();
    this.fileInfos.clear();
    super.destroy(fromScene);
  }

  // ========== 私有方法 ==========

  /**
   * 预创建所有部件 Sprite
   *
   * 遍历第一个动画的所有 timeline，为每个 object timeline 创建一个 Sprite。
   * 初始状态为不可见，等动画开始后再根据 getParts() 结果显示。
   */
  private createSprites(data: SCMLData): void {
    const firstAnim = data.entity.animations[0];
    if (!firstAnim) return;

    const structureKey = firstAnim.mainlineKeys[0];
    if (!structureKey) return;

    // 遍历所有 object_ref，为每个引用的 timeline 创建一个 sprite
    for (const objRef of structureKey.objectRefs) {
      const timeline = firstAnim.timelines.find((tl) => tl.id === objRef.timeline);
      if (!timeline) continue;

      const timelineName = timeline.name;
      if (this.sprites.has(timelineName)) continue;

      // 获取第一个 key 中的 folder/file 信息
      const firstKey = timeline.keys[0];
      const folderId = firstKey?.object?.folder ?? 0;
      const fileId = firstKey?.object?.file ?? 0;

      const folder = data.folders.find((f) => f.id === folderId);
      const fileInfo = folder?.files.find((f) => f.id === fileId);

      if (fileInfo) {
        this.fileInfos.set(timelineName, fileInfo);
      }

      // 构建纹理 key
      const textureKey = this.buildTextureKey(fileInfo?.name ?? timelineName);

      // 创建 Sprite
      const sprite = this.scene.add.sprite(0, 0, textureKey);

      // 设置 origin 为 SCML 定义的 pivot
      if (fileInfo) {
        // Spriter pivot_y=1 是图片顶部（Y 向上），Phaser originY=0 是顶部（Y 向下）
        sprite.setOrigin(fileInfo.pivotX, 1 - fileInfo.pivotY);
      } else {
        sprite.setOrigin(0.5, 0.5);
      }

      sprite.setVisible(false);
      this.add(sprite);
      this.sprites.set(timelineName, sprite);
    }
  }

  /**
   * 场景 update 回调
   */
  private handleSceneUpdate = (_time: number, delta: number): void => {
    this.runtime.update(delta);
    this.updateSprites();
  };

  /**
   * 根据 runtime 计算结果更新所有 Sprite
   */
  private updateSprites(): void {
    const parts = this.runtime.getParts();
    this.visibleParts.clear();

    for (const part of parts) {
      const sprite = this.sprites.get(part.timelineName);
      if (!sprite) continue;

      sprite.setPosition(part.transform.x, part.transform.y);
      // Spriter 逆时针为正，Phaser setAngle 顺时针为正，需要取反
      sprite.setAngle(-part.transform.angle);
      sprite.setScale(part.transform.scaleX, part.transform.scaleY);
      sprite.setDepth(part.zIndex);
      sprite.setVisible(true);

      this.visibleParts.add(part.timelineName);
    }

    // 隐藏不在当前帧中的部件
    for (const [name, sprite] of this.sprites) {
      if (!this.visibleParts.has(name)) {
        sprite.setVisible(false);
      }
    }
  }

  /**
   * 构建纹理 key
   *
   * 将 SCML 文件名（如 'body.png'）转换为 Phaser 纹理 key（如 'barbarian_02_body'）
   */
  private buildTextureKey(fileName: string): string {
    // 去掉扩展名，空格转下划线，小写化
    const base = fileName
      .replace(/\.png$/i, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    return `${this.texturePrefix}_${base}`;
  }
}
