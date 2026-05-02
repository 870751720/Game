// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/character_look_table.md
// 生成时间: 2026-05-02T12:55:13.596Z
// ============================================

/** 字段定义 */
export interface CharacterLookTable {
  /** 外观套装唯一标识 */
  id: string;
  /** 外观显示名称 */
  name: string;
  /** 动画骨架ID，对应 `assets/animations/` 下的目录名，如 `humanoid` */
  animationSet: string;
  /** 默认纹理前缀，当 outfit_part_table 中未指定某部件时回退使用该前缀构建纹理key */
  texturePrefix: string;
}

/** 导表数据，可直接 import 使用 */
export const characterLookTableData: CharacterLookTable[] = [
  {
    "id": "barbarian_default",
    "name": "野蛮人默认",
    "animationSet": "humanoid",
    "texturePrefix": "barbarian_02"
  },
  {
    "id": "barbarian_light",
    "name": "野蛮人轻装",
    "animationSet": "humanoid",
    "texturePrefix": "barbarian_02"
  }
];
