/**
 * 场景键名常量
 * 所有场景的 key 必须在这里注册，避免硬编码字符串
 */
export const SceneKeys = {
  BootScene: 'BootScene',
  TestScene: 'TestScene',
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
