/**
 * 应用级常量配置
 * 修改此处可切换游戏的全局行为
 */
export const AppConfig = {
  /**
   * 默认启动的场景
   * - BootScene : 正式游戏界面
   * - TestScene : 测试页面
   */
  defaultScene: 'TestScene' as 'BootScene' | 'TestScene',
} as const;
