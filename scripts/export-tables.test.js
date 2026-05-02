import { describe, it, expect, vi } from 'vitest';
import {
  parseTable,
  parseMarkdownContent,
  convertValue,
  toPascalCase,
  toCamelCase,
  toTSType,
  exportTables,
} from './export-tables-core.js';

// ============================================
// parseTable
// ============================================
describe('parseTable', () => {
  it('解析标准 GFM 表格', () => {
    const lines = [
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
    ];
    const result = parseTable(lines, 0);
    expect(result.headers).toEqual(['a', 'b']);
    expect(result.rows).toEqual([{ a: '1', b: '2' }]);
    expect(result.nextLine).toBe(3);
  });

  it('跳过表格中间的空行', () => {
    const lines = [
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      '| 3 | 4 |',
    ];
    const result = parseTable(lines, 0);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[1]).toEqual({ a: '3', b: '4' });
  });

  it('少于 3 行返回 null', () => {
    const lines = ['| a |', '|---|---|'];
    expect(parseTable(lines, 0)).toBeNull();
  });

  it('保留空单元格', () => {
    const lines = [
      '| a | b |',
      '|---|---|',
      '|   | 2 |',
    ];
    const result = parseTable(lines, 0);
    expect(result.rows[0]).toEqual({ a: '', b: '2' });
  });
});

// ============================================
// parseMarkdownContent
// ============================================
describe('parseMarkdownContent', () => {
  it('正常解析字段定义和数据', () => {
    const md = `
## 字段定义
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 唯一标识 |
| count | number | ❌ | 0 | 数量 |

## 数据
| id | count |
|:---|:---|
| item_01 | 5 |
`;
    const result = parseMarkdownContent(md);
    expect(result.fieldDef).toHaveLength(2);
    expect(result.fieldDef[0]['字段名']).toBe('id');
    expect(result.data).toHaveLength(1);
    expect(result.data[0]['id']).toBe('item_01');
    expect(result.dataHeaders).toEqual(['id', 'count']);
  });

  it('缺少数据区块返回 null data', () => {
    const md = `
## 字段定义
| 字段名 | 类型 |
|:---|:---|
| id | string |
`;
    const result = parseMarkdownContent(md);
    expect(result.fieldDef).toHaveLength(1);
    expect(result.data).toBeNull();
  });
});

// ============================================
// convertValue
// ============================================
describe('convertValue', () => {
  it('空字符串返回 null', () => {
    expect(convertValue('', 'string')).toBeNull();
  });

  it('— 返回 null', () => {
    expect(convertValue('—', 'number')).toBeNull();
  });

  it('number 类型正确转换', () => {
    expect(convertValue('42', 'number')).toBe(42);
    expect(convertValue('3.14', 'number')).toBe(3.14);
  });

  it('number 类型解析失败回退为字符串', () => {
    expect(convertValue('abc', 'number')).toBe('abc');
  });

  it('boolean 类型正确转换', () => {
    expect(convertValue('true', 'boolean')).toBe(true);
    expect(convertValue('false', 'boolean')).toBe(false);
  });

  it('string 类型原样返回', () => {
    expect(convertValue('hello', 'string')).toBe('hello');
  });
});

// ============================================
// 命名转换
// ============================================
describe('toPascalCase', () => {
  it('snake_case 转 PascalCase', () => {
    expect(toPascalCase('item_table')).toBe('ItemTable');
    expect(toPascalCase('a_b_c')).toBe('ABC');
  });
});

describe('toCamelCase', () => {
  it('snake_case 转 camelCase', () => {
    expect(toCamelCase('item_table')).toBe('itemTable');
    expect(toCamelCase('a_b_c')).toBe('aBC');
  });
});

describe('toTSType', () => {
  it('映射已知类型', () => {
    expect(toTSType('number')).toBe('number');
    expect(toTSType('boolean')).toBe('boolean');
    expect(toTSType('string')).toBe('string');
  });

  it('未知类型回退 string', () => {
    expect(toTSType('unknown')).toBe('string');
  });
});

// ============================================
// exportTables（mock fs）
// ============================================
describe('exportTables', () => {
  const normalizePath = (p) => p.replace(/\\/g, '/');

  const createMockFs = (files) => {
    // files: { [filePath]: stringContent }，统一使用正斜杠路径
    const written = {};
    const normalizedFiles = {};
    for (const [k, v] of Object.entries(files)) {
      normalizedFiles[normalizePath(k)] = v;
    }

    return {
      read: normalizedFiles,
      written,
      existsSync: (p) => {
        const np = normalizePath(p);
        return Object.prototype.hasOwnProperty.call(normalizedFiles, np)
          || np.includes('data/tables')
          || np.includes('src/data');
      },
      mkdirSync: vi.fn(),
      readdirSync: (p) => {
        const np = normalizePath(p);
        if (np.includes('tables')) {
          const prefix = np.endsWith('/') ? np : np + '/';
          return Object.keys(normalizedFiles)
            .filter(k => k.startsWith(prefix))
            .map(k => k.slice(prefix.length));
        }
        return [];
      },
      readFileSync: (p) => {
        const np = normalizePath(p);
        if (normalizedFiles[np] !== undefined) return normalizedFiles[np];
        throw new Error(`ENOENT: ${p}`);
      },
      writeFileSync: (p, content) => {
        written[normalizePath(p)] = content;
      },
    };
  };

  it('空目录时输出提示', () => {
    const mockFs = createMockFs({});
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    exportTables({
      fs: mockFs,
      path: require('path'),
      tablesDir: '/mock/data/tables',
      outputTsDir: '/mock/src/data',
    });

    expect(consoleSpy).toHaveBeenCalledWith('⚠️ data/tables/ 目录下没有找到 .md 配表文件');
    consoleSpy.mockRestore();
  });

  it('成功导出 TS 文件', () => {
    const mdContent = `## 字段定义
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 唯一标识 |
| count | number | ❌ | 0 | 数量 |

## 数据
| id | count |
|:---|:---|
| item_01 | 5 |
`;
    const mockFs = createMockFs({
      '/mock/data/tables/test_table.md': mdContent,
    });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    exportTables({
      fs: mockFs,
      path: require('path'),
      tablesDir: '/mock/data/tables',
      outputTsDir: '/mock/src/data',
    });

    const writtenKeys = Object.keys(mockFs.written);
    expect(writtenKeys).toHaveLength(1);
    expect(writtenKeys[0]).toContain('testTable.ts');

    const tsContent = mockFs.written[writtenKeys[0]];
    expect(tsContent).toContain('export interface TestTable');
    expect(tsContent).toContain('export const testTableData: TestTable[]');
    expect(tsContent).toContain('"item_01"');
    expect(tsContent).toContain('5');

    consoleSpy.mockRestore();
  });

  it('必填字段为空时报错并跳过导出', () => {
    const mdContent = `## 字段定义
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 唯一标识 |

## 数据
| id |
|:---|
|  |
`;
    const mockFs = createMockFs({
      '/mock/data/tables/bad_table.md': mdContent,
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    exportTables({
      fs: mockFs,
      path: require('path'),
      tablesDir: '/mock/data/tables',
      outputTsDir: '/mock/src/data',
    });

    expect(Object.keys(mockFs.written)).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('未知字段报错并跳过该行', () => {
    const mdContent = `## 字段定义
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| id | string | ✅ | — | 唯一标识 |

## 数据
| id | unknown_field |
|:---|:---|
| a | b |
`;
    const mockFs = createMockFs({
      '/mock/data/tables/unknown_table.md': mdContent,
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    exportTables({
      fs: mockFs,
      path: require('path'),
      tablesDir: '/mock/data/tables',
      outputTsDir: '/mock/src/data',
    });

    expect(Object.keys(mockFs.written)).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('缺少字段定义时跳过文件', () => {
    const mdContent = `## 数据
| id |
|:---|
| a |
`;
    const mockFs = createMockFs({
      '/mock/data/tables/no_def.md': mdContent,
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    exportTables({
      fs: mockFs,
      path: require('path'),
      tablesDir: '/mock/data/tables',
      outputTsDir: '/mock/src/data',
    });

    expect(Object.keys(mockFs.written)).toHaveLength(0);
    errorSpy.mockRestore();
  });
});
