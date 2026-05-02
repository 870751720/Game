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
| barbarian_default | body | barbarian_02_body |
| barbarian_default | head | barbarian_02_head |
| barbarian_default | left_arm | barbarian_02_left_arm |
| barbarian_default | left_hand | barbarian_02_left_hand |
| barbarian_default | right_arm | barbarian_02_right_arm |
| barbarian_default | right_hand | barbarian_02_right_hand |
| barbarian_default | left_leg | barbarian_02_left_leg |
| barbarian_default | right_leg | barbarian_02_right_leg |
| barbarian_default | weapon | barbarian_02_weapon |
| barbarian_default | shield | barbarian_02_shield |
| barbarian_default | face_01 | barbarian_02_face_01 |
| barbarian_light | body | barbarian_02_body |
| barbarian_light | head | barbarian_02_head |
| barbarian_light | left_arm | barbarian_02_left_arm |
| barbarian_light | left_hand | barbarian_02_left_hand |
| barbarian_light | right_arm | barbarian_02_right_arm |
| barbarian_light | right_hand | barbarian_02_right_hand |
| barbarian_light | left_leg | barbarian_02_left_leg |
| barbarian_light | right_leg | barbarian_02_right_leg |
| barbarian_light | weapon | barbarian_02_weapon |
| barbarian_light | face_01 | barbarian_02_face_01 |
