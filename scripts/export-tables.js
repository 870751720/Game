const fs = require('fs');
const path = require('path');

const TABLES_DIR = path.join(__dirname, '..', 'data', 'tables');
const OUTPUT_TS_DIR = path.join(__dirname, '..', 'src', 'data');

/**
 * 解析 GFM 表格
 * @param {string[]} lines - 文件所有行
 * @param {number} startIdx - 表格开始的行索引
 * @returns {{ headers: string[], rows: object[], nextLine: number } | null}
 */
function parseTable(lines, startIdx) {
  const tableLines = [];
  let i = startIdx;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('|')) {
      tableLines.push(lines[i]);
      i++;
    } else if (trimmed === '' && (i + 1 < lines.length && lines[i + 1].trim().startsWith('|'))) {
      // 跳过表格中间的空行，避免数据被截断
      i++;
    } else {
      break;
    }
  }

  if (tableLines.length < 3) return null; // 至少要有表头、分隔行、一行数据

  // 解析表头（保留空单元格，只用 slice 去掉首尾的 | 产生的空串）
  const headers = tableLines[0]
    .split('|')
    .slice(1, -1)
    .map(s => s.trim());

  // 跳过分隔行（tableLines[1]）

  // 解析数据行
  const rows = [];
  for (let j = 2; j < tableLines.length; j++) {
    const cells = tableLines[j]
      .split('|')
      .slice(1, -1)
      .map(s => s.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] !== undefined ? cells[idx] : '';
    });
    rows.push(row);
  }

  return { headers, rows, nextLine: i };
}

/**
 * 解析单个 Markdown 配表文件
 * @param {string} filePath
 * @returns {{ fieldDef: object[] | null, data: object[] | null, dataHeaders: string[] | null }}
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let fieldDef = null;
  let data = null;
  let dataHeaders = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '## 字段定义') {
      // 向下找到第一个表格
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('|')) j++;
      const result = parseTable(lines, j);
      if (result) {
        fieldDef = result.rows;
        i = result.nextLine - 1;
      }
    }

    if (line === '## 数据') {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('|')) j++;
      const result = parseTable(lines, j);
      if (result) {
        data = result.rows;
        dataHeaders = result.headers;
        i = result.nextLine - 1;
      }
    }
  }

  return { fieldDef, data, dataHeaders };
}

/**
 * 将字符串值按字段类型转换
 * @param {string} value
 * @param {string} typeHint
 * @returns {any}
 */
function convertValue(value, typeHint) {
  const trimmed = value.trim();

  if (trimmed === '' || trimmed === '—') {
    return null;
  }

  switch (typeHint) {
    case 'number':
      const num = Number(trimmed);
      return isNaN(num) ? trimmed : num;
    case 'boolean':
      return trimmed === 'true';
    case 'string':
    default:
      return trimmed;
  }
}

/**
 * 将 snake_case 转为 PascalCase
 */
function toPascalCase(str) {
  return str.replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * 将 snake_case 转为 camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * 字段类型映射到 TS 类型
 */
function toTSType(type) {
  switch (type) {
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'string': return 'string';
    default: return 'string';
  }
}

/**
 * 主流程：扫描所有 Markdown 配表并导出
 */
function exportTables() {
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_TS_DIR)) {
    fs.mkdirSync(OUTPUT_TS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(TABLES_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('⚠️ data/tables/ 目录下没有找到 .md 配表文件');
    return;
  }

  for (const file of files) {
    const filePath = path.join(TABLES_DIR, file);
    const baseName = path.basename(file, '.md'); // e.g. tier_table
    const { fieldDef, data, dataHeaders } = parseMarkdownFile(filePath);

    if (!fieldDef || !data || !dataHeaders) {
      console.error(`❌ 跳过 ${file}: 缺少字段定义或数据表格`);
      continue;
    }

    // 构建字段定义映射：字段名 -> { type, required, default }
    const fieldMap = {};
    for (const row of fieldDef) {
      const fieldName = row['字段名'];
      if (!fieldName) continue;

      fieldMap[fieldName] = {
        type: row['类型'] || 'string',
        required: (row['必填'] || '').includes('✅'),
        defaultValue: row['默认值'],
      };
    }

    // 处理数据行：类型转换 + 默认值填充 + 必填校验
    const jsonData = [];
    const errors = [];

    for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
      const rawRow = data[rowIdx];
      const obj = {};

      for (const header of dataHeaders) {
        const def = fieldMap[header];
        if (!def) {
          errors.push(`  第 ${rowIdx + 1} 行: 未知字段 "${header}"`);
          continue;
        }

        let rawValue = rawRow[header];

        // 空值处理：尝试填充默认值
        if (rawValue === '' || rawValue === '—') {
          if (def.defaultValue !== undefined && def.defaultValue !== '' && def.defaultValue !== '—') {
            rawValue = def.defaultValue;
          } else if (def.required) {
            errors.push(`  第 ${rowIdx + 1} 行: 必填字段 "${header}" 为空`);
            rawValue = '';
          }
        }

        // 字段名导出为 camelCase
        obj[toCamelCase(header)] = convertValue(rawValue, def.type);
      }

      jsonData.push(obj);
    }

    if (errors.length > 0) {
      console.error(`❌ ${file} 数据校验失败:`);
      errors.forEach(e => console.error(e));
      continue;
    }

    // 输出 TS 类型定义（内联数据，可直接 import 使用）
    const interfaceName = toPascalCase(baseName);
    const constName = toCamelCase(baseName) + 'Data';
    const tsLines = [
      `// ============================================`,
      `// 由导表脚本自动生成，请勿手动修改`,
      `// 源文件: data/tables/${file}`,
      `// 生成时间: ${new Date().toISOString()}`,
      `// ============================================`,
      ``,
      `/** 字段定义 */`,
      `export interface ${interfaceName} {`,
    ];

    for (const row of fieldDef) {
      const fieldName = toCamelCase(row['字段名']);
      const fieldType = toTSType(row['类型']);
      const required = (row['必填'] || '').includes('✅');
      const optionalMark = required ? '' : '?';
      const comment = row['说明'] || '';

      if (comment) {
        tsLines.push(`  /** ${comment} */`);
      }
      tsLines.push(`  ${fieldName}${optionalMark}: ${fieldType};`);
    }

    tsLines.push('}');
    tsLines.push('');
    tsLines.push(`/** 导表数据，可直接 import 使用 */`);
    tsLines.push(`export const ${constName}: ${interfaceName}[] = ${JSON.stringify(jsonData, null, 2)};`);
    tsLines.push('');

    const tsPath = path.join(OUTPUT_TS_DIR, `${toCamelCase(baseName)}.ts`);
    fs.writeFileSync(tsPath, tsLines.join('\n'), 'utf-8');

    console.log(`✅ ${file} → ${toCamelCase(baseName)}.ts`);
  }
}

exportTables();
