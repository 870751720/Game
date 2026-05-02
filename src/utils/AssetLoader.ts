import { assetMappingTableData } from '../data/assetMappingTable';

/**
 * 资源自动加载器
 *
 * 从 asset_mapping_table 配表读取纹理 key 与文件路径的映射，
 * 在场景 preload 中自动遍历调用 Phaser 加载器。
 *
 * 使用方式：
 * ```typescript
 * preload(): void {
 *   AssetLoader.preloadImages(this, 'character');
 * }
 * ```
 */
export class AssetLoader {
  /**
   * 自动加载图片资源
   * @param scene 当前 Phaser 场景
   * @param category 可选，只加载指定分类的资源
   */
  static preloadImages(scene: Phaser.Scene, category?: string): void {
    for (const row of assetMappingTableData) {
      if (category && row.category !== category) {
        continue;
      }
      scene.load.image(row.textureKey, row.filePath);
    }
  }

  /**
   * 获取指定纹理 key 对应的文件路径
   */
  static getFilePath(textureKey: string): string | undefined {
    return assetMappingTableData.find((r) => r.textureKey === textureKey)?.filePath;
  }

  /**
   * 按分类获取所有纹理 key 列表
   */
  static getKeysByCategory(category: string): string[] {
    return assetMappingTableData.filter((r) => r.category === category).map((r) => r.textureKey);
  }
}
