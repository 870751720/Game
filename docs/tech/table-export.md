# 导表系统技术文档

> 记录 Markdown 配表 → TypeScript 数据的导出流程、核心函数设计与测试方案。

---

## 概述

游戏配表以 **Markdown GFM 表格** 作为人工维护的源文件，通过 Node.js 脚本一键解析、校验、转换，最终生成 **TypeScript Interface + 内联常量数据**，供游戏代码直接 import 使用。

| 环节 | 路径 | 说明 |
|------|------|------|
| 配表源文件 | `data/tables/*.md` | 三段式 Markdown，人工维护 |
| 导表脚本 | `scripts/export-tables.js` | CLI 入口 |
| 核心逻辑 | `scripts/export-tables-core.js` | 纯函数，可测试 |
| 单元测试 | `scripts/export-tables.test.js` | Vitest + mock fs |
| 导出产物 | `src/data/*.ts` | TS Interface + const 数据 |

---

## 配表文件格式

每个 `.md` 文件包含三个固定二级标题区块：

### 1. `## 表定义`

元信息表格，固定 4 行：

| 属性 | 值 |
|:---|:---|
| 表ID | `xxx_table` |
| 描述 | 该表用途说明 |
| 主键 | `id` |
| 使用场景 | 哪些系统读取此表 |

### 2. `## 字段定义`

定义每一列的元数据：

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 程序侧唯一标识 |
| count | number | ❌ | 0 | 数量 |

约束：
- `字段名`：源文件用 `snake_case`，导出自动转 `camelCase`
- `类型`：仅支持 `string` / `number` / `boolean`
- `必填`：`✅` 表示必填
- `默认值`：空值时填充；写 `—` 表示无默认值

### 3. `## 数据`

实际数据行，表头必须与「字段定义」中的 `字段名` 完全一致：

| id | count |
|:---|:---|
| item_01 | 5 |

---

## 脚本结构

```
scripts/
├── export-tables.js       # CLI 入口（直接执行 exportTables()）
├── export-tables-core.js  # 核心逻辑（纯函数，全部导出）
└── export-tables.test.js  # 单元测试（Vitest + mock fs）
```

## 核心函数

### `parseTable(lines, startIdx)`

解析一段 GFM 表格。

- 输入：文件所有行 + 表格起始索引
- 输出：`{ headers, rows, nextLine }`
- 特点：自动跳过表格中间的空行；不足 3 行（表头 + 分隔 + 数据）时返回 `null`

### `parseMarkdownContent(content)`

解析单个 Markdown 配表文件内容。

- 扫描 `## 字段定义` 和 `## 数据` 两个区块
- 分别调用 `parseTable` 提取字段元数据和实际数据行
- 返回：`{ fieldDef, data, dataHeaders }`

### `convertValue(value, typeHint)`

按字段类型转换字符串值。

| 输入 | 类型 | 输出 |
|------|------|------|
| `''` / `'—'` | 任意 | `null` |
| `'42'` | `number` | `42` |
| `'abc'` | `number` | `'abc'`（回退字符串，不阻断） |
| `'true'` | `boolean` | `true` |
| 其他 | `string` | 原样返回 |

### `exportTables(options?)`

主流程，扫描目录 → 解析 → 校验 → 生成 TS 文件。

**默认依赖（CLI 模式）：**
```js
exportTables(); // 使用 Node.js 原生 fs / path
```

**测试注入（mock 模式）：**
```js
exportTables({
  fs: mockFs,           // mock 的文件系统
  path: require('path'),
  tablesDir: '/mock/data/tables',
  outputTsDir: '/mock/src/data',
});
```

校验行为：
- 缺少字段定义或数据 → 跳过文件，控制台报错
- 数据行出现未定义字段 → 报错并跳过该文件
- 必填字段为空且无默认值 → 报错并跳过该文件

---

## 命名转换规则

| 对象 | 源文件 | 导出后 |
|------|--------|--------|
| Markdown 源文件 | `snake_case.md` | — |
| TS 类型文件 | — | `camelCase.ts` |
| TS Interface | — | `PascalCase` |
| TS 常量名 | — | `camelCase + Data` |
| 字段名（源文件） | `snake_case` | — |
| 字段名（导出后） | — | `camelCase` |

---


## 使用方式

### 日常导表

```bash
npm run export-data
```

等价于：
```bash
node scripts/export-tables.js
```

### 新增/修改配表

1. 编辑 `data/tables/xxx_table.md`
2. 执行 `npm run export-data`
3. 检查控制台无报错
4. 检查 `src/data/xxxTable.ts` 内容正确

---

## 注意事项

- **产物文件为自动生成**，请勿手动修改 `src/data/*.ts`，否则下次导表会被覆盖
- 表格分隔行（`| :--- |`）必须完整，否则 `parseTable` 可能识别失败
- `number` 类型字段若解析失败，会**回退为原始字符串**并继续导出，不会阻断流程

