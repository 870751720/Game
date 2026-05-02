import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import type { StorageDriver } from './SaveManager';
import { GlobalStorage, SlotStorage } from './SaveManager';

const tmpDir = path.join(os.tmpdir(), 'game-save-test');

/** 文件系统驱动（Node.js 环境） */
class FileStorageDriver implements StorageDriver {
  constructor(private dir: string) {}

  private getPath(key: string): string {
    return path.join(this.dir, `${key}.json`);
  }

  read(key: string): string | null {
    try {
      return fs.readFileSync(this.getPath(key), 'utf-8');
    } catch {
      return null;
    }
  }

  write(key: string, value: string): void {
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.getPath(key), value, 'utf-8');
  }

  remove(key: string): void {
    try {
      fs.unlinkSync(this.getPath(key));
    } catch {
      // 文件不存在时静默忽略
    }
  }

  keys(): string[] {
    try {
      return fs
        .readdirSync(this.dir)
        .filter((f: string) => f.endsWith('.json'))
        .map((f: string) => f.slice(0, -5));
    } catch {
      return [];
    }
  }
}

describe('存档系统', () => {
  let driver: FileStorageDriver;

  beforeAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  beforeEach(() => {
    // 清空临时目录，确保每个测试独立
    for (const file of fs.readdirSync(tmpDir)) {
      fs.rmSync(path.join(tmpDir, file), { recursive: true, force: true });
    }
    driver = new FileStorageDriver(tmpDir);
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('FileStorageDriver', () => {
    it('读写基本键值', () => {
      expect(driver.read('foo')).toBeNull();
      driver.write('foo', 'bar');
      expect(driver.read('foo')).toBe('bar');
    });

    it('删除键', () => {
      driver.write('foo', 'bar');
      driver.remove('foo');
      expect(driver.read('foo')).toBeNull();
    });

    it('列出所有键', () => {
      driver.write('a', '1');
      driver.write('b', '2');
      expect(driver.keys().sort()).toEqual(['a', 'b']);
    });
  });

  describe('GlobalStorage', () => {
    it('无存档时 load 返回空对象', () => {
      const global = new GlobalStorage('game_global', driver);
      const state = global.load();
      expect(state).toEqual({});
      expect(global.state).toEqual({});
    });

    it('save 后 load 能恢复', () => {
      const global = new GlobalStorage('game_global', driver);
      global.load();
      global.state.volume = 0.5;
      global.save();

      const fresh = new GlobalStorage('game_global', driver);
      fresh.load();
      expect(fresh.state.volume).toBe(0.5);
    });
  });

  describe('SlotStorage', () => {
    it('switch 无存档时 state 为空对象', () => {
      const slots = new SlotStorage('game_slot', driver);
      const state = slots.switch('slot_0');
      expect(state).toEqual({});
      expect(slots.currentId).toBe('slot_0');
    });

    it('save 后 switch 能恢复', () => {
      const slots = new SlotStorage('game_slot', driver);
      slots.switch('slot_0');
      slots.state.player = { hp: 100 };
      slots.save();

      const fresh = new SlotStorage('game_slot', driver);
      fresh.switch('slot_0');
      expect(fresh.state.player).toEqual({ hp: 100 });
    });

    it('未 switch 时 save 抛错', () => {
      const slots = new SlotStorage('game_slot', driver);
      expect(() => slots.save()).toThrow('before switch');
    });

    it('exists 判断存档位存在性', () => {
      const slots = new SlotStorage('game_slot', driver);
      expect(slots.exists('slot_0')).toBe(false);
      slots.switch('slot_0');
      slots.state.x = 1;
      slots.save();
      expect(slots.exists('slot_0')).toBe(true);
    });

    it('delete 删除存档位', () => {
      const slots = new SlotStorage('game_slot', driver);
      slots.switch('slot_0');
      slots.save();
      expect(slots.exists('slot_0')).toBe(true);

      slots.delete('slot_0');
      expect(slots.exists('slot_0')).toBe(false);
    });

    it('list 返回所有存档位ID并排序', () => {
      const slots = new SlotStorage('game_slot', driver);
      slots.switch('auto_save');
      slots.save();

      slots.switch('slot_1');
      slots.save();

      slots.switch('slot_0');
      slots.save();

      expect(slots.list()).toEqual(['auto_save', 'slot_0', 'slot_1']);
    });

    it('多存档位互不干扰', () => {
      const slots = new SlotStorage('game_slot', driver);
      slots.switch('slot_a');
      slots.state.hp = 100;
      slots.save();

      slots.switch('slot_b');
      slots.state.hp = 50;
      slots.save();

      slots.switch('slot_a');
      expect(slots.state.hp).toBe(100);

      slots.switch('slot_b');
      expect(slots.state.hp).toBe(50);
    });
  });
});
