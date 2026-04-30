# 资产命名规范（Asset Naming Convention）

> 本规范适用于 `public/assets/` 下所有资源，以及代码中对应的 Phaser Asset Key。
> 新增资源必须严格遵循，存量资源迁移时逐步整改。

---

## 1. 通用原则

| 规则 | 要求 |
|------|------|
| 大小写 | **全部小写** |
| 分隔符 | **下划线 `_`** |
| 空格 | **禁止** |
| 序号 | **从 `001` 开始**，固定 3 位数字补零（`001` ~ `999`） |
| 语言 | 文件名与键名均使用 **英文** |
| 扩展名 | 保留原始扩展名（`.png` / `.jpg` / `.wav` / `.json` 等） |

---

## 2. 目录结构规范

```
public/assets/
├── characters/              # 角色动画（逐帧序列）
│   └── {entity}/            # 实体名，如 barbarian / knight / slime
│       └── {action}/        # 动作名，如 idle / walk / attack / die
├── sprites/                 # 静态精灵图（道具、UI 元素、不可动物体）
│   ├── items/               # 物品
│   ├── ui/                  # UI 组件
│   └── environment/         # 环境物件
├── textures/                # 大尺寸贴图（背景、瓦片、材质）
│   ├── backgrounds/         # 背景图
│   └── tiles/               # 瓦片图
├── audio/                   # 音频
│   ├── sfx/                 # 短音效（<= 3s）
│   └── music/               # 背景音乐（循环）
├── fonts/                   # 字体文件
└── data/                    # JSON / XML / 关卡数据
```

> **原则**：目录层级不超过 4 层，避免过深。

---

## 3. 文件命名规范

### 3.1 角色动画（Characters）

```
{entity}_{action}_{frame}.png
```

- `entity`：实体标识，完整单词，禁止缩写（`barbarian` ✓，`b01` ✗）
- `action`：动作标识，使用统一动词（见下表）
- `frame`：帧序号，3 位数字

**动作动词对照表（强制）**

| 动作 | 标识 | 说明 |
|------|------|------|
| 待机 | `idle` | 站立呼吸 |
| 行走 | `walk` | 走路/移动 |
| 跑步 | `run` | 奔跑 |
| 攻击 | `attack` | 普通攻击 |
| 受击 | `hurt` | 被击中 |
| 死亡 | `die` | 死亡动画 |
| 跳跃起跳 | `jump_start` | 跳跃开始 |
| 跳跃循环 | `jump_loop` | 空中悬停循环 |
| 挑衅/技能 | `taunt` | 特殊动作 |

**示例**：
```
characters/barbarian/idle/barbarian_idle_001.png
characters/barbarian/walk/barbarian_walk_001.png
characters/slime/die/slime_die_001.png
```

### 3.2 静态精灵（Sprites）

```
{entity}_{variant}.png
```

- 无帧序号（单张图）
- `variant` 可选，用于区分同实体不同样式

**示例**：
```
sprites/items/coin_gold.png
sprites/ui/button_blue.png
sprites/environment/tree_oak.png
```

### 3.3 纹理贴图（Textures）

```
{category}_{name}_{variant}.png
```

**示例**：
```
textures/backgrounds/bg_forest_day.png
textures/tiles/tile_grass_001.png
```

### 3.4 音频（Audio）

```
{audio_type}_{description}.[wav|mp3|ogg]
```

**示例**：
```
audio/sfx/sfx_click_001.wav
audio/sfx/sfx_attack_sword_001.wav
audio/music/music_battle_001.mp3
```

---

## 4. Phaser Asset Key 规范

代码中加载资源时使用的字符串键名，必须与文件命名对应，并增加 **类别前缀** 防止全局冲突。

### 4.1 键名格式

```
{prefix}_{entity}_{action}
```

| 资产类型 | 前缀 | 示例键名 |
|----------|------|----------|
| 角色序列帧 | `char` | `char_barbarian_idle` |
| 静态精灵 | `spr` | `spr_coin_gold` |
| 纹理贴图 | `tex` | `tex_bg_forest_day` |
| 音效 | `sfx` | `sfx_click_001` |
| 音乐 | `bgm` | `bgm_battle_001` |
| 数据/JSON | `data` | `data_level_01` |

### 4.2 常量定义

所有 Asset Key 必须集中在 `src/constants/AssetKeys.ts` 中定义，**禁止在代码中硬编码字符串**。

```typescript
export const AssetKeys = {
  Character: {
    BarbarianIdle: 'char_barbarian_idle',
    BarbarianWalk: 'char_barbarian_walk',
  },
  Sprite: {
    CoinGold: 'spr_coin_gold',
  },
  Texture: {
    BgForestDay: 'tex_bg_forest_day',
  },
} as const;
```

---

## 5. 迁移与新增流程

1. **新资源入库前**：对照本规范重命名文件，确认目录归属正确
2. **更新 AssetKeys.ts**：新增对应的常量定义
3. **代码引用**：使用常量，禁止手写字符串
4. **旧资源迁移**：存量资源按批次逐步迁移，迁移后更新对应代码路径

---

## 6. 反例对照

| ❌ 错误 | ✅ 正确 | 说明 |
|---------|---------|------|
| `b01_idle_000.png` | `barbarian_idle_001.png` | 不用缩写，序号从 001 起 |
| `Idle Blink/` | `idle_blink/` | 目录名小写，空格改下划线 |
| `PNG Sequences/` | `characters/` | 按资产类型组织，不按来源格式 |
| `'barbarian_idle'` 硬编码 | `AssetKeys.Character.BarbarianIdle` | 使用常量定义 |

---

**最后更新**：2026-05-01
