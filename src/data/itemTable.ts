// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/item_table.md
// 生成时间: 2026-05-02T13:26:16.470Z
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

/** 导表数据，可直接 import 使用 */
export const itemTableData: ItemTable[] = [
  {
    "id": "wooden_sword",
    "name": "木剑",
    "tierId": "white",
    "category": "gear",
    "stackable": false,
    "maxStack": 1,
    "sellable": true,
    "sellPrice": 5,
    "desc": "粗糙的木制短剑，新人冒险者的第一课"
  },
  {
    "id": "healing_potion",
    "name": "治疗药水",
    "tierId": "white",
    "category": "consumable",
    "stackable": true,
    "maxStack": 20,
    "sellable": true,
    "sellPrice": 10,
    "desc": "回复少量生命值的常见药剂，冒险者公会批量发放"
  },
  {
    "id": "mana_potion",
    "name": "法力药水",
    "tierId": "white",
    "category": "consumable",
    "stackable": true,
    "maxStack": 20,
    "sellable": true,
    "sellPrice": 10,
    "desc": "回复少量法力值的常见药剂，法师学徒的常备品"
  },
  {
    "id": "iron_ore",
    "name": "铁矿石",
    "tierId": "white",
    "category": "material",
    "stackable": true,
    "maxStack": 99,
    "sellable": true,
    "sellPrice": 3,
    "desc": "常见的矿石原料，可用于锻造各类金属装备"
  },
  {
    "id": "wood",
    "name": "木材",
    "tierId": "white",
    "category": "material",
    "stackable": true,
    "maxStack": 99,
    "sellable": true,
    "sellPrice": 2,
    "desc": "普通的木料，用途广泛，从建筑到武器都需要"
  },
  {
    "id": "leather",
    "name": "皮革",
    "tierId": "white",
    "category": "material",
    "stackable": true,
    "maxStack": 99,
    "sellable": true,
    "sellPrice": 4,
    "desc": "野兽皮毛制成的皮革，制作防具的基础材料"
  },
  {
    "id": "herb",
    "name": "草药",
    "tierId": "white",
    "category": "material",
    "stackable": true,
    "maxStack": 99,
    "sellable": true,
    "sellPrice": 2,
    "desc": "野外常见的药草，炼金术和药水制作的基础材料"
  },
  {
    "id": "bread",
    "name": "面包",
    "tierId": "white",
    "category": "consumable",
    "stackable": true,
    "maxStack": 10,
    "sellable": true,
    "sellPrice": 3,
    "desc": "简单的食物，能略微恢复体力，穷人的盛宴"
  }
];
