# 道具表

## 表定义

| 属性 | 值 |
|:---|:---|
| 表ID | `item_table` |
| 描述 | 游戏内基础道具定义，包含消耗品、材料、基础装备 |
| 主键 | `id` |
| 使用场景 | 背包系统、商店系统、掉落系统、合成系统 |

## 字段定义

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 程序侧唯一标识，全局唯一 |
| name | string | ✅ | — | 道具显示名称 |
| tier_id | string | ✅ | — | 品级ID，引用 `tier_table.id` |
| category | string | ✅ | — | 分类：consumable（消耗品）/ material（材料）/ gear（装备） |
| stackable | boolean | ❌ | false | 是否可堆叠 |
| max_stack | number | ❌ | 1 | 最大堆叠数量，仅当 stackable=true 时有效 |
| sellable | boolean | ❌ | true | 是否可出售 |
| sell_price | number | ❌ | 0 | 出售价格 |
| desc | string | ✅ | — | 道具描述，用于背包 Tooltip |

## 数据

| id | name | tier_id | category | stackable | max_stack | sellable | sell_price | desc |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| wooden_sword | 木剑 | white | gear | | | true | 5 | 粗糙的木制短剑，新人冒险者的第一课 |
| healing_potion | 治疗药水 | white | consumable | true | 20 | true | 10 | 回复少量生命值的常见药剂，冒险者公会批量发放 |
| mana_potion | 法力药水 | white | consumable | true | 20 | true | 10 | 回复少量法力值的常见药剂，法师学徒的常备品 |
| iron_ore | 铁矿石 | white | material | true | 99 | true | 3 | 常见的矿石原料，可用于锻造各类金属装备 |
| wood | 木材 | white | material | true | 99 | true | 2 | 普通的木料，用途广泛，从建筑到武器都需要 |
| leather | 皮革 | white | material | true | 99 | true | 4 | 野兽皮毛制成的皮革，制作防具的基础材料 |
| herb | 草药 | white | material | true | 99 | true | 2 | 野外常见的药草，炼金术和药水制作的基础材料 |
| bread | 面包 | white | consumable | true | 10 | true | 3 | 简单的食物，能略微恢复体力，穷人的盛宴 |
