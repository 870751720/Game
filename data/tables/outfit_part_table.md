# 外观部件明细表

## 表定义

| 属性 | 值 |
|:---|:---|
| 表ID | `outfit_part_table` |
| 描述 | 外观套装的部件映射明细，每行定义一个部件使用的纹理 |
| 主键 | `outfit_id` + `part_name` 联合主键 |
| 使用场景 | 与 character_look_table 关联，构建完整角色外观 |

## 字段定义

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| outfit_id | string | ✅ | — | 外观套装ID，引用 `character_look_table.id` |
| part_name | string | ✅ | — | 部件名，与 SCML 中的 file.name 规范化后一致，如 `body`、`face_01` |
| texture_key | string | ✅ | — | Phaser 纹理 key，如 `barbarian_02_body` |

## 数据

| outfit_id | part_name | texture_key |
|:---|:---|:---|
| barbarian_01_default | body | barbarian_01_body |
| barbarian_01_default | head | barbarian_01_head |
| barbarian_01_default | left_arm | barbarian_01_left_arm |
| barbarian_01_default | left_hand | barbarian_01_left_hand |
| barbarian_01_default | right_arm | barbarian_01_right_arm |
| barbarian_01_default | right_hand | barbarian_01_right_hand |
| barbarian_01_default | left_leg | barbarian_01_left_leg |
| barbarian_01_default | right_leg | barbarian_01_right_leg |
| barbarian_01_default | weapon | barbarian_01_weapon |
| barbarian_01_default | shield | barbarian_01_shield |
| barbarian_01_default | face | barbarian_01_face |
| barbarian_02_default | body | barbarian_02_body |
| barbarian_02_default | head | barbarian_02_head |
| barbarian_02_default | left_arm | barbarian_02_left_arm |
| barbarian_02_default | left_hand | barbarian_02_left_hand |
| barbarian_02_default | right_arm | barbarian_02_right_arm |
| barbarian_02_default | right_hand | barbarian_02_right_hand |
| barbarian_02_default | left_leg | barbarian_02_left_leg |
| barbarian_02_default | right_leg | barbarian_02_right_leg |
| barbarian_02_default | weapon | barbarian_02_weapon |
| barbarian_02_default | shield | barbarian_02_shield |
| barbarian_02_default | face | barbarian_02_face |
| barbarian_03_default | body | barbarian_03_body |
| barbarian_03_default | head | barbarian_03_head |
| barbarian_03_default | left_arm | barbarian_03_left_arm |
| barbarian_03_default | left_hand | barbarian_03_left_hand |
| barbarian_03_default | right_arm | barbarian_03_right_arm |
| barbarian_03_default | right_hand | barbarian_03_right_hand |
| barbarian_03_default | left_leg | barbarian_03_left_leg |
| barbarian_03_default | right_leg | barbarian_03_right_leg |
| barbarian_03_default | weapon | barbarian_03_weapon |
| barbarian_03_default | shield | barbarian_03_shield |
| barbarian_03_default | face | barbarian_03_face |
