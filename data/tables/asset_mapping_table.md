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
| barbarian_02_body | assets/characters/barbarian_02/body.png | character |
| barbarian_02_face_01 | assets/characters/barbarian_02/face_01.png | character |
| barbarian_02_face_02 | assets/characters/barbarian_02/face_02.png | character |
| barbarian_02_face_03 | assets/characters/barbarian_02/face_03.png | character |
| barbarian_02_head | assets/characters/barbarian_02/head.png | character |
| barbarian_02_left_arm | assets/characters/barbarian_02/left_arm.png | character |
| barbarian_02_left_hand | assets/characters/barbarian_02/left_hand.png | character |
| barbarian_02_left_leg | assets/characters/barbarian_02/left_leg.png | character |
| barbarian_02_right_arm | assets/characters/barbarian_02/right_arm.png | character |
| barbarian_02_right_hand | assets/characters/barbarian_02/right_hand.png | character |
| barbarian_02_right_leg | assets/characters/barbarian_02/right_leg.png | character |
| barbarian_02_shield | assets/characters/barbarian_02/shield.png | character |
| barbarian_02_weapon | assets/characters/barbarian_02/weapon.png | character |
| barbarian_01_body | assets/characters/barbarian_01/body.png | character |
| barbarian_01_face_01 | assets/characters/barbarian_01/face_01.png | character |
| barbarian_01_face_02 | assets/characters/barbarian_01/face_02.png | character |
| barbarian_01_face_03 | assets/characters/barbarian_01/face_03.png | character |
| barbarian_01_head | assets/characters/barbarian_01/head.png | character |
| barbarian_01_left_arm | assets/characters/barbarian_01/left_arm.png | character |
| barbarian_01_left_hand | assets/characters/barbarian_01/left_hand.png | character |
| barbarian_01_left_leg | assets/characters/barbarian_01/left_leg.png | character |
| barbarian_01_right_arm | assets/characters/barbarian_01/right_arm.png | character |
| barbarian_01_right_hand | assets/characters/barbarian_01/right_hand.png | character |
| barbarian_01_right_leg | assets/characters/barbarian_01/right_leg.png | character |
| barbarian_01_shield | assets/characters/barbarian_01/shield.png | character |
| barbarian_01_weapon | assets/characters/barbarian_01/weapon.png | character |
| barbarian_03_body | assets/characters/barbarian_03/body.png | character |
| barbarian_03_face_01 | assets/characters/barbarian_03/face_01.png | character |
| barbarian_03_face_02 | assets/characters/barbarian_03/face_02.png | character |
| barbarian_03_face_03 | assets/characters/barbarian_03/face_03.png | character |
| barbarian_03_head | assets/characters/barbarian_03/head.png | character |
| barbarian_03_left_arm | assets/characters/barbarian_03/left_arm.png | character |
| barbarian_03_left_hand | assets/characters/barbarian_03/left_hand.png | character |
| barbarian_03_left_leg | assets/characters/barbarian_03/left_leg.png | character |
| barbarian_03_right_arm | assets/characters/barbarian_03/right_arm.png | character |
| barbarian_03_right_hand | assets/characters/barbarian_03/right_hand.png | character |
| barbarian_03_right_leg | assets/characters/barbarian_03/right_leg.png | character |
| barbarian_03_shield | assets/characters/barbarian_03/shield.png | character |
| barbarian_03_weapon | assets/characters/barbarian_03/weapon.png | character |
