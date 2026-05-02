# 存档系统架构设计

> 记录日期：2026-05-02

## 设计原则

1. **状态与存档分离**：运行时状态是普通的 JS 对象，由业务代码全权管理；存档系统只负责序列化和磁盘读写
2. **两层架构**：驱动层（`StorageDriver`）+ 业务层（`GlobalStorage` / `SlotStorage`）
3. **不绑定业务数据结构**：存档系统对 JSON 内部一无所知，只负责搬运

## 文件结构

```
src/managers/
├── SaveManager.ts          # 生产代码：接口 + 实现
└── SaveManager.test.ts     # 测试代码：真实文件 IO 测试
```

## 核心接口

### StorageDriver（驱动层）

```typescript
interface StorageDriver {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
  keys(): string[];
}
```

**实现**：
- `LocalStorageDriver` — 浏览器环境，基于 `localStorage`
- `FileStorageDriver` — 测试专用，基于 Node.js `fs`（定义在测试文件中）

### GlobalStorage（全局存储）

适用于设置、成就、统计等不随存档位变化的数据。

```typescript
class GlobalStorage<T = Record<string, unknown>> {
  state: T;           // 直接读写
  load(): T;          // 从磁盘加载
  save(): void;       // 立即落盘
}
```

### SlotStorage（存档位存储）

适用于游戏进度等随存档位变化的数据。

```typescript
class SlotStorage<T = Record<string, unknown>> {
  state: T;                    // 直接读写
  currentId: string | null;    // 当前激活的存档ID

  switch(id: string): T;       // 切换并加载
  save(): void;                // 保存当前存档
  delete(id: string): void;
  exists(id: string): boolean;
  list(): string[];            // 返回所有存档ID（已排序）
}
```

**关键约束**：
- 存档ID为字符串（如 `slot_0`、`auto_save`、`quick_save`），非数字
- `save()` 前必须先 `switch()`，否则抛错
- 无存档时 `switch()` 返回空对象 `{}`，由业务模块自行初始化

## 使用流程

### 全局设置

```typescript
const global = new GlobalStorage('game_global', new LocalStorageDriver());
global.load();
global.state.volume = 0.5;
global.state.lastSaveId = 'slot_0';
global.save();  // 立即落盘
```

### 存档位

```typescript
const slots = new SlotStorage('game_slot', new LocalStorageDriver());

// 继续游戏
slots.switch('slot_0');

// 或新游戏
slots.switch('slot_1');
slots.state.player = { hp: 100, level: 1 };
slots.state.inventory = { items: [], gold: 0 };
slots.save();
```

## 测试策略

- 使用 `FileStorageDriver`（Node.js `fs`），测试真实的文件 IO
- 临时目录：`os.tmpdir() + '/game-save-test'`
- 每个测试前清空目录，全部跑完后删除目录
- 不测内存 mock，确保驱动层可靠

```bash
npm test   # vitest
```

## 未来扩展方向

| 需求 | 方案 |
|------|------|
| 存档加密 | `StorageDriver` 增加加密/解密钩子 |
| 云存档 | 新增 `HttpStorageDriver`，接口不变 |
| 自动存档 | 业务代码定时调 `slots.save()` |
| 存档压缩 | `save()` 中对 JSON 做 `JSON.stringify` + `gzip` |
