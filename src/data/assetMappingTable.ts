// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/asset_mapping_table.md
// 生成时间: 2026-05-02T13:26:16.464Z
// ============================================

/** 字段定义 */
export interface AssetMappingTable {
  /** Phaser 纹理 key，全局唯一 */
  textureKey: string;
  /** 资源文件路径，相对于 public 目录，如 `assets/characters/barbarian_02/body.png` */
  filePath: string;
  /** 资源分类，如 `character`、`item`、`ui`，便于按类别批量加载 */
  category?: string;
}

/** 导表数据，可直接 import 使用 */
export const assetMappingTableData: AssetMappingTable[] = [
  {
    "textureKey": "barbarian_02_body",
    "filePath": "assets/characters/barbarian_02/body.png",
    "category": "character"
  }
];
