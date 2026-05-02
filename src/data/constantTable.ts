// ============================================
// 由导表脚本自动生成，请勿手动修改
// 源文件: data/tables/constant_table.md
// ============================================

/** 字段定义 */
export interface ConstantTable {
  /** 常量 key，如 `default_scene` */
  constantKey: string;
  /** 常量值 */
  constantValue: string;
  /** 常量说明 */
  description?: string;
}

/** 导表数据，可直接 import 使用 */
export const constantTableData: ConstantTable[] = [
  {
    "constantKey": "default_scene",
    "constantValue": "TestScene",
    "description": "默认启动场景：TestScene(测试页面)"
  }
];
