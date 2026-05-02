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
| texture_key | string | ✅ | — | Phaser 纹理 key，如 `common_body_02` |

## 数据

| outfit_id | part_name | texture_key |
|:---|:---|:---|
| barbarian_01_default | body | common_body_01 |
| barbarian_01_default | head | common_head_01 |
| barbarian_01_default | left_arm | common_left_arm_01 |
| barbarian_01_default | left_hand | common_left_hand_01 |
| barbarian_01_default | right_arm | common_right_arm_01 |
| barbarian_01_default | right_hand | common_right_hand_01 |
| barbarian_01_default | left_leg | common_left_leg_01 |
| barbarian_01_default | right_leg | common_right_leg_01 |
| barbarian_01_default | main_hand | common_main_hand_01 |
| barbarian_01_default | off_hand | common_off_hand_01 |
| barbarian_01_default | face | common_face_03 |
| barbarian_02_default | body | common_body_02 |
| barbarian_02_default | head | common_head_02 |
| barbarian_02_default | left_arm | common_left_arm_02 |
| barbarian_02_default | left_hand | common_left_hand_02 |
| barbarian_02_default | right_arm | common_right_arm_02 |
| barbarian_02_default | right_hand | common_right_hand_02 |
| barbarian_02_default | left_leg | common_left_leg_02 |
| barbarian_02_default | right_leg | common_right_leg_02 |
| barbarian_02_default | main_hand | common_main_hand_02 |
| barbarian_02_default | off_hand | common_off_hand_02 |
| barbarian_02_default | face | common_face_03 |
| barbarian_03_default | body | common_body_03 |
| barbarian_03_default | head | common_head_03 |
| barbarian_03_default | left_arm | common_left_arm_03 |
| barbarian_03_default | left_hand | common_left_hand_03 |
| barbarian_03_default | right_arm | common_right_arm_03 |
| barbarian_03_default | right_hand | common_right_hand_03 |
| barbarian_03_default | left_leg | common_left_leg_03 |
| barbarian_03_default | right_leg | common_right_leg_03 |
| barbarian_03_default | main_hand | common_main_hand_03 |
| barbarian_03_default | off_hand | common_off_hand_03 |
| barbarian_03_default | face | common_face_03 |
