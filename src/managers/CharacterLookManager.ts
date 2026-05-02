import type { CharacterLookTable } from '../data/characterLookTable';
import type { OutfitPartTable } from '../data/outfitPartTable';
import type { CharacterLookSave } from '../types/character-look';
import { PlayerDisplay } from '../objects/player';

/**
 * 角色外观管理器
 *
 * 负责从配表加载默认外观、合并存档覆盖项、应用到 PlayerDisplay。
 *
 * 数据来源两张配表：
 * - character_look_table：外观套装主表（id / name / animation_set / texture_prefix）
 * - outfit_part_table：部件明细表（outfit_id / part_name / texture_key）
 *
 * 使用流程：
 * 1. 场景 preload 中加载两张 JSON 配表
 * 2. create 中调用 `manager.loadLooks()` + `manager.loadParts()` 初始化
 * 3. 创建角色时，从存档获取 `CharacterLookSave`，调用 `manager.applyToDisplay()`
 * 4. 若无存档，构造一个 `baseId=角色默认配置`、overrides={} 的 save 即可
 */
export class CharacterLookManager {
  private configs: Map<string, CharacterLookTable> = new Map();

  /** outfitId → 部件映射表 */
  private parts: Map<string, Record<string, string>> = new Map();

  /**
   * 从 character_look_table 加载外观套装主表
   */
  loadLooks(rows: CharacterLookTable[]): void {
    this.configs.clear();
    for (const row of rows) {
      this.configs.set(row.id, row);
    }
  }

  /**
   * 从 outfit_part_table 加载部件明细并关联到对应套装
   */
  loadParts(rows: OutfitPartTable[]): void {
    this.parts.clear();
    for (const row of rows) {
      const map = this.parts.get(row.outfitId) ?? {};
      map[row.partName] = row.textureKey;
      this.parts.set(row.outfitId, map);
    }
  }

  /**
   * 获取指定外观配表配置
   */
  getConfig(id: string): CharacterLookTable | undefined {
    return this.configs.get(id);
  }

  /**
   * 获取指定外观套装的完整部件映射（不含存档覆盖）
   */
  getBaseParts(outfitId: string): Record<string, string> {
    return { ...(this.parts.get(outfitId) ?? {}) };
  }

  /**
   * 解析最终应使用的部件映射
   *
   * 合并规则：配表默认部件 + 存档覆盖项（覆盖项优先）
   */
  resolveParts(save: CharacterLookSave): Record<string, string> {
    const baseParts = this.getBaseParts(save.baseId);
    return { ...baseParts, ...save.overrides };
  }

  /**
   * 将外观配置直接应用到 PlayerDisplay
   */
  applyToDisplay(save: CharacterLookSave, display: PlayerDisplay): void {
    const parts = this.resolveParts(save);
    display.applyLook(parts);
  }

  /**
   * 构建一个空的存档对象（用于新角色初始化）
   */
  static createEmptySave(baseId: string): CharacterLookSave {
    return { baseId, overrides: {} };
  }
}
