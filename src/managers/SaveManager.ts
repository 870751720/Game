/**
 * 存储驱动接口
 * 负责最底层的 key-value 读写，不感知任何业务数据结构
 */
export interface StorageDriver {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
  keys(): string[];
}

/**
 * localStorage 实现
 */
export class LocalStorageDriver implements StorageDriver {
  read(key: string): string | null {
    return localStorage.getItem(key);
  }

  write(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) result.push(key);
    }
    return result;
  }
}

// ============================================
// 全局存储
// ============================================

/**
 * 全局存储
 *
 * 适用于设置、成就、统计等不随存档位变化的数据。
 * 状态对象完全暴露给业务代码，存档系统只负责序列化和磁盘读写。
 */
export class GlobalStorage<T = Record<string, unknown>> {
  /** 当前运行时状态，业务代码直接读写 */
  state: T = {} as T;

  constructor(
    private readonly key: string,
    private readonly driver: StorageDriver
  ) {}

  /**
   * 从磁盘加载，反序列化后赋值到 state
   * 无数据时 state 重置为空对象
   */
  load(): T {
    const raw = this.driver.read(this.key);
    this.state = raw ? (JSON.parse(raw) as T) : ({} as T);
    return this.state;
  }

  /**
   * 把当前 state 序列化后写入磁盘
   */
  save(): void {
    this.driver.write(this.key, JSON.stringify(this.state));
  }
}

// ============================================
// 存档位存储
// ============================================

/**
 * 存档位存储
 *
 * 适用于游戏进度等随存档位变化的数据。
 * 存档ID为字符串，支持 slot_0 / auto_save / quick_save 等灵活命名。
 */
export class SlotStorage<T = Record<string, unknown>> {
  /** 当前运行时状态，业务代码直接读写 */
  state: T = {} as T;

  /** 当前激活的存档ID，switch 后自动更新 */
  currentId: string | null = null;

  constructor(
    private readonly prefix: string,
    private readonly driver: StorageDriver
  ) {}

  private getKey(id: string): string {
    return `${this.prefix}_${id}`;
  }

  /**
   * 切换当前存档位，自动从磁盘加载数据到 state
   * 无数据时 state 重置为空对象
   */
  switch(id: string): T {
    this.currentId = id;
    const raw = this.driver.read(this.getKey(id));
    this.state = raw ? (JSON.parse(raw) as T) : ({} as T);
    return this.state;
  }

  /**
   * 把当前 state 序列化后写入当前存档位
   * 未 switch 过时抛错
   */
  save(): void {
    if (!this.currentId) {
      throw new Error('SlotStorage.save() called before switch()');
    }
    this.driver.write(this.getKey(this.currentId), JSON.stringify(this.state));
  }

  /**
   * 删除指定存档位
   */
  delete(id: string): void {
    this.driver.remove(this.getKey(id));
  }

  /**
   * 判断指定存档位是否有数据
   */
  exists(id: string): boolean {
    return this.driver.read(this.getKey(id)) !== null;
  }

  /**
   * 列出所有存在的存档位ID
   */
  list(): string[] {
    const prefix = `${this.prefix}_`;
    return this.driver.keys()
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length))
      .sort();
  }
}
