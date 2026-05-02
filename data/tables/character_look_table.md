# 角色外观配置表

## 表定义

| 属性 | 值 |
|:---|:---|
| 表ID | `character_look_table` |
| 描述 | 角色与NPC的默认外观套装主表，定义动画骨架与纹理前缀 |
| 主键 | `id` |
| 使用场景 | 角色创建、NPC生成、存档回读时恢复默认造型 |

## 字段定义

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 外观套装唯一标识 |
| name | string | ✅ | — | 外观显示名称 |
| animation_set | string | ✅ | — | 动画骨架ID，对应 `assets/animations/` 下的目录名，如 `humanoid` |
| texture_prefix | string | ✅ | — | 默认纹理前缀，当 outfit_part_table 中未指定某部件时回退使用该前缀构建纹理key |

## 数据

| id | name | animation_set | texture_prefix |
|:---|:---|:---|:---|
| barbarian_01_default | 野蛮人01 | humanoid | common |
| barbarian_02_default | 野蛮人02 | humanoid | common |
| barbarian_03_default | 野蛮人03 | humanoid | common |
