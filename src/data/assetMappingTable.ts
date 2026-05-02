// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/asset_mapping_table.md
// 生成时间: 2026-05-02T12:55:13.592Z
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
  },
  {
    "textureKey": "barbarian_02_face_01",
    "filePath": "assets/characters/barbarian_02/face_01.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_face_02",
    "filePath": "assets/characters/barbarian_02/face_02.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_face_03",
    "filePath": "assets/characters/barbarian_02/face_03.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_head",
    "filePath": "assets/characters/barbarian_02/head.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_left_arm",
    "filePath": "assets/characters/barbarian_02/left_arm.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_left_hand",
    "filePath": "assets/characters/barbarian_02/left_hand.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_left_leg",
    "filePath": "assets/characters/barbarian_02/left_leg.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_right_arm",
    "filePath": "assets/characters/barbarian_02/right_arm.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_right_hand",
    "filePath": "assets/characters/barbarian_02/right_hand.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_right_leg",
    "filePath": "assets/characters/barbarian_02/right_leg.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_shield",
    "filePath": "assets/characters/barbarian_02/shield.png",
    "category": "character"
  },
  {
    "textureKey": "barbarian_02_weapon",
    "filePath": "assets/characters/barbarian_02/weapon.png",
    "category": "character"
  }
];
