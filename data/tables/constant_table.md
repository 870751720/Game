# 常量表

## 表定义

| 属性 | 值 |
|:---|:---|
| 表ID | `constant_table` |
| 描述 | 应用级全局常量配置，如默认启动场景、开关等 |
| 主键 | `constant_key` |
| 使用场景 | gameConfig.ts 中决定场景注册顺序等全局行为 |

## 字段定义

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---:|:---|:---|
| constant_key | string | ✅ | — | 常量 key，如 `default_scene` |
| constant_value | string | ✅ | — | 常量值 |
| description | string | ❌ | — | 常量说明 |

## 数据

| constant_key | constant_value | description |
|:---|:---|:---|
| default_scene | TestScene | 默认启动场景：BootScene(正式游戏) / TestScene(测试页面) |
