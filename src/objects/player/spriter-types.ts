/**
 * Spriter SCML 数据类型定义
 *
 * Spriter 是 BrashMonkey 开发的 2D 骨骼动画工具，
 * SCML 是其 XML 格式的动画数据文件。
 */

/** 文件夹中的单个图片文件 */
export interface SCMLFile {
  id: number;
  name: string;
  width: number;
  height: number;
  pivotX: number;
  pivotY: number;
}

/** 文件夹（包含一组图片文件） */
export interface SCMLFolder {
  id: number;
  files: SCMLFile[];
}

/** 骨骼/对象的变换数据 */
export interface SCMLTransform {
  x: number;
  y: number;
  angle: number;
  scaleX: number;
  scaleY: number;
}

/** 对象特有的附加数据（图片引用） */
export interface SCMLObjectData extends SCMLTransform {
  folder: number;
  file: number;
}

/** 骨骼定义（entity 级别的元数据） */
export interface SCMLBoneInfo {
  name: string;
  width: number;
  height: number;
}

/** Mainline key 中的骨骼引用 */
export interface SCMLBoneRef {
  id: number;
  parent?: number;
  timeline: number;
  key: number;
}

/** Mainline key 中的对象引用 */
export interface SCMLObjectRef {
  id: number;
  parent?: number;
  timeline: number;
  key: number;
  zIndex: number;
}

/** Mainline 关键帧 */
export interface SCMLMainlineKey {
  id: number;
  time: number;
  boneRefs: SCMLBoneRef[];
  objectRefs: SCMLObjectRef[];
}

/** Timeline 关键帧 */
export interface SCMLTimelineKey {
  id: number;
  time: number;
  spin: number; // -1=逆时针, 0=无旋转(直接跳变), 1=顺时针(默认)
  bone?: SCMLTransform;
  object?: SCMLObjectData;
}

/** 时间线（对应一个骨骼或一个对象部件） */
export interface SCMLTimeline {
  id: number;
  name: string;
  objectType?: 'bone';
  keys: SCMLTimelineKey[];
}

/** 动画 */
export interface SCMLAnimation {
  id: number;
  name: string;
  length: number; // 毫秒
  interval: number;
  mainlineKeys: SCMLMainlineKey[];
  timelines: SCMLTimeline[];
}

/** 实体（角色） */
export interface SCMLEntity {
  id: number;
  name: string;
  boneInfos: SCMLBoneInfo[];
  animations: SCMLAnimation[];
}

/** 完整的 SCML 数据 */
export interface SCMLData {
  folders: SCMLFolder[];
  entity: SCMLEntity;
}

/** 运行时计算出的部件世界变换 */
export interface PartTransform {
  x: number;
  y: number;
  angle: number; // 度数，Phaser 格式（顺时针为正）
  scaleX: number;
  scaleY: number;
}

/** 运行时部件状态 */
export interface RuntimePart {
  timelineName: string;
  folder: number;
  file: number;
  transform: PartTransform;
  zIndex: number;
}
