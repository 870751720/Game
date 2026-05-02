/**
 * 角色外观存档数据类型
 *
 * 存档中只记录差异（overrides），默认部件从配表（character_look_table）读取。
 * 这样玩家只换了一件装备时，存档体积极小。
 */
export interface CharacterLookSave {
  /** 基础外观配置ID，对应 character_look_table.id */
  baseId: string;

  /** 玩家手动覆盖的部件映射：部件名 → Phaser 纹理 key */
  overrides: Record<string, string>;
}
