/**
 * 资产键名常量
 * 所有 Phaser 加载/引用资源的 key 必须在这里定义，禁止硬编码
 *
 * 命名规范见: docs/asset-naming-convention.md
 */

export const AssetKeys = {
  /** 角色序列帧 */
  Character: {
    // 示例: HeroIdle: 'char_hero_idle',
  },

  /** 静态精灵 */
  Sprite: {
    // 示例: CoinGold: 'spr_coin_gold',
  },

  /** 纹理贴图 */
  Texture: {
    // 示例: BgForestDay: 'tex_bg_forest_day',
  },

  /** 音效 */
  Sfx: {
    // 示例: Click: 'sfx_click_001',
  },

  /** 背景音乐 */
  Bgm: {
    // 示例: Battle: 'bgm_battle_001',
  },
} as const;
