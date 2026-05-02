// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/item_table.md
// 生成时间: 2026-05-02T06:43:08.551Z
// ============================================

/** 字段定义 */
export interface ItemTable {
  /** 程序侧唯一标识，全局唯一 */
  id: string;
  /** 道具显示名称 */
  name: string;
  /** 品级ID，引用 `tier_table.id` */
  tierId: string;
  /** 分类：consumable（消耗品）/ material（材料）/ gear（装备） */
  category: string;
  /** 是否可堆叠 */
  stackable?: boolean;
  /** 最大堆叠数量，仅当 stackable=true 时有效 */
  maxStack?: number;
  /** 是否可出售 */
  sellable?: boolean;
  /** 出售价格 */
  sellPrice?: number;
  /** 道具描述，用于背包 Tooltip */
  desc: string;
}

/** 运行时加载路径: assets/data/item_table.json */
export const itemTableData: ItemTable[] = [];
