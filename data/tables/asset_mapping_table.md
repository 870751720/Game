# 资源映射表

## 表定义

| 属性 | 值 |
|:---|:---|
| 表ID | `asset_mapping_table` |
| 描述 | 纹理 key 与文件路径的映射表，用于场景 preload 时自动加载资源 |
| 主键 | `texture_key` |
| 使用场景 | 场景 preload 中通过 AssetLoader 自动遍历加载 |

## 字段定义

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| texture_key | string | ✅ | — | Phaser 纹理 key，全局唯一 |
| file_path | string | ✅ | — | 资源文件路径，相对于 public 目录，如 `assets/characters/barbarian_02/body.png` |
| category | string | ❌ | — | 资源分类，如 `character`、`item`、`ui`，便于按类别批量加载 |

## 数据

| texture_key | file_path | category |
|:---|:---|:---|
| common_body_02 | assets/characters/common/body/body_02.png | character |
| common_head_02 | assets/characters/common/head/head_02.png | character |
| common_left_arm_02 | assets/characters/common/left_arm/left_arm_02.png | character |
| common_left_hand_02 | assets/characters/common/left_hand/left_hand_02.png | character |
| common_left_leg_02 | assets/characters/common/left_leg/left_leg_02.png | character |
| common_right_arm_02 | assets/characters/common/right_arm/right_arm_02.png | character |
| common_right_hand_02 | assets/characters/common/right_hand/right_hand_02.png | character |
| common_right_leg_02 | assets/characters/common/right_leg/right_leg_02.png | character |
| common_off_hand_02 | assets/characters/common/off_hand/off_hand_02.png | character |
| common_main_hand_02 | assets/characters/common/main_hand/main_hand_02.png | character |
| common_body_01 | assets/characters/common/body/body_01.png | character |
| common_face_01 | assets/characters/common/face/face_01.png | character |
| common_face_02 | assets/characters/common/face/face_02.png | character |
| common_face_03 | assets/characters/common/face/face_03.png | character |
| common_head_01 | assets/characters/common/head/head_01.png | character |
| common_left_arm_01 | assets/characters/common/left_arm/left_arm_01.png | character |
| common_left_hand_01 | assets/characters/common/left_hand/left_hand_01.png | character |
| common_left_leg_01 | assets/characters/common/left_leg/left_leg_01.png | character |
| common_right_arm_01 | assets/characters/common/right_arm/right_arm_01.png | character |
| common_right_hand_01 | assets/characters/common/right_hand/right_hand_01.png | character |
| common_right_leg_01 | assets/characters/common/right_leg/right_leg_01.png | character |
| common_off_hand_01 | assets/characters/common/off_hand/off_hand_01.png | character |
| common_main_hand_01 | assets/characters/common/main_hand/main_hand_01.png | character |
| common_body_03 | assets/characters/common/body/body_03.png | character |
| common_head_03 | assets/characters/common/head/head_03.png | character |
| common_left_arm_03 | assets/characters/common/left_arm/left_arm_03.png | character |
| common_left_hand_03 | assets/characters/common/left_hand/left_hand_03.png | character |
| common_left_leg_03 | assets/characters/common/left_leg/left_leg_03.png | character |
| common_right_arm_03 | assets/characters/common/right_arm/right_arm_03.png | character |
| common_right_hand_03 | assets/characters/common/right_hand/right_hand_03.png | character |
| common_right_leg_03 | assets/characters/common/right_leg/right_leg_03.png | character |
| common_off_hand_03 | assets/characters/common/off_hand/off_hand_03.png | character |
| common_main_hand_03 | assets/characters/common/main_hand/main_hand_03.png | character |
