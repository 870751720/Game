import type {
  SCMLData,
  SCMLAnimation,
  SCMLTimeline,
  SCMLTimelineKey,
  SCMLTransform,
  SCMLObjectData,
  RuntimePart,
  PartTransform,
} from './spriter-types';

/**
 * Spriter 骨骼动画运行时
 *
 * 负责：
 * 1. 管理当前动画和播放时间
 * 2. 每帧计算所有骨骼和对象的世界变换
 * 3. 输出可用于 Phaser 渲染的 RuntimePart 列表
 *
 * 坐标系约定：
 * - Spriter 使用标准数学角度（0=右，逆时针为正）
 * - 输出转换为 Phaser 角度（0=右，顺时针为正）
 */
export class SpriterRuntime {
  private data: SCMLData;
  private currentAnim: SCMLAnimation | null = null;
  private currentTime: number = 0;
  private isPlaying: boolean = false;

  /** 骨骼世界变换缓存：boneRefId → SpatialInfo */
  private boneWorldTransforms: Map<number, { x: number; y: number; angle: number; scaleX: number; scaleY: number }> = new Map();

  constructor(data: SCMLData) {
    this.data = data;
  }

  /** 切换动画 */
  setAnimation(name: string): void {
    const anim = this.data.entity.animations.find((a) => a.name === name);
    if (!anim) {
      throw new Error(`SpriterRuntime: 未找到动画 "${name}"`);
    }
    this.currentAnim = anim;
    this.currentTime = 0;
  }

  /** 开始播放 */
  play(): void {
    if (!this.currentAnim) {
      throw new Error('SpriterRuntime: 请先调用 setAnimation()');
    }
    this.isPlaying = true;
  }

  /** 暂停 */
  pause(): void {
    this.isPlaying = false;
  }

  /** 停止并回到起始 */
  stop(): void {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  /** 设置当前时间（毫秒） */
  setTime(time: number): void {
    if (!this.currentAnim) return;
    this.currentTime = this.wrap(time, 0, this.currentAnim.length);
  }

  /** 推进动画时间 */
  update(delta: number): void {
    if (!this.isPlaying || !this.currentAnim) return;

    this.currentTime += delta;
    if (this.currentTime >= this.currentAnim.length) {
      this.currentTime = this.currentTime % this.currentAnim.length;
    }
  }

  /** 获取当前动画名 */
  getCurrentAnimationName(): string | null {
    return this.currentAnim?.name ?? null;
  }

  /** 是否正在播放 */
  get playing(): boolean {
    return this.isPlaying;
  }

  /**
   * 计算当前时间所有可见部件的世界变换
   *
   * 使用第一个 mainline key 的结构作为模板（假设动画过程中结构不变）
   */
  getParts(): RuntimePart[] {
    if (!this.currentAnim) return [];

    const anim = this.currentAnim;
    const t = this.currentTime;

    // 获取结构模板（第一个 mainline key）
    const structureKey = anim.mainlineKeys[0];
    if (!structureKey) return [];

    this.boneWorldTransforms.clear();

    // 第一步：计算所有骨骼的世界变换
    for (const boneRef of structureKey.boneRefs) {
      const timeline = anim.timelines.find((tl) => tl.id === boneRef.timeline);
      if (!timeline || timeline.objectType !== 'bone') continue;

      const localKey = this.interpolateTimeline(timeline, t, anim.length);
      if (!localKey.bone) continue;
      const worldTransform = this.computeBoneWorldTransform(boneRef.parent, localKey.bone);
      this.boneWorldTransforms.set(boneRef.id, worldTransform);
    }

    // 第二步：计算所有对象的世界变换
    const parts: RuntimePart[] = [];

    for (const objRef of structureKey.objectRefs) {
      const timeline = anim.timelines.find((tl) => tl.id === objRef.timeline);
      if (!timeline) continue;

      const localKey = this.interpolateTimeline(timeline, t, anim.length);
      if (!localKey.object) continue;

      const worldTransform = this.computeObjectWorldTransform(objRef.parent, localKey.object);

      parts.push({
        timelineName: timeline.name,
        folder: localKey.object.folder,
        file: localKey.object.file,
        transform: worldTransform,
        zIndex: objRef.zIndex,
      });
    }

    // 按 zIndex 排序（低 zIndex 先渲染，即在底层）
    parts.sort((a, b) => a.zIndex - b.zIndex);

    return parts;
  }

  /**
   * 对 Timeline 在当前时间进行插值
   */
  private interpolateTimeline(
    timeline: SCMLTimeline,
    time: number,
    animLength: number
  ): SCMLTimelineKey {
    const keys = timeline.keys;
    if (keys.length === 0) {
      throw new Error(`SpriterRuntime: timeline "${timeline.name}" 没有关键帧`);
    }
    if (keys.length === 1) {
      return keys[0];
    }

    // 规范化时间到动画范围内
    time = this.wrap(time, 0, animLength);

    // 找到当前时间所在的 key 区间
    let prevIdx = 0;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].time <= time) {
        prevIdx = i;
      }
    }

    const nextIdx = (prevIdx + 1) % keys.length;
    const prevKey = keys[prevIdx];
    const nextKey = keys[nextIdx];

    // 计算区间长度（考虑循环）
    let duration = nextKey.time - prevKey.time;
    if (duration <= 0) {
      duration += animLength;
    }

    let elapsed = time - prevKey.time;
    if (elapsed < 0) {
      elapsed += animLength;
    }

    const t = duration > 0 ? elapsed / duration : 0;

    // 构建插值结果
    const result: SCMLTimelineKey = {
      id: prevKey.id,
      time,
      spin: prevKey.spin,
    };

    if (prevKey.bone && nextKey.bone) {
      result.bone = this.lerpTransform(prevKey.bone, nextKey.bone, t, prevKey.spin);
    }

    if (prevKey.object && nextKey.object) {
      result.object = this.lerpObjectData(prevKey.object, nextKey.object, t, prevKey.spin);
    }

    return result;
  }

  /**
   * 变换数据插值
   */
  private lerpTransform(a: SCMLTransform, b: SCMLTransform, t: number, spin: number = 1): SCMLTransform {
    return {
      x: this.lerp(a.x, b.x, t),
      y: this.lerp(a.y, b.y, t),
      angle: this.lerpAngle(a.angle, b.angle, t, spin),
      scaleX: this.lerp(a.scaleX, b.scaleX, t),
      scaleY: this.lerp(a.scaleY, b.scaleY, t),
    };
  }

  /**
   * 对象数据插值（含 folder/file）
   */
  private lerpObjectData(a: SCMLObjectData, b: SCMLObjectData, t: number, spin: number = 1): SCMLObjectData {
    return {
      folder: a.folder,
      file: a.file,
      x: this.lerp(a.x, b.x, t),
      y: this.lerp(a.y, b.y, t),
      angle: this.lerpAngle(a.angle, b.angle, t, spin),
      scaleX: this.lerp(a.scaleX, b.scaleX, t),
      scaleY: this.lerp(a.scaleY, b.scaleY, t),
    };
  }

  /** 线性插值 */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /** 数值环绕 */
  private wrap(value: number, min: number, max: number): number {
    const range = max - min;
    if (range <= 0) return min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
  }

  /**
   * 角度插值（支持 Spriter spin 方向控制）
   *
   * spin=1（默认）：逆时针方向（角度增加）
   * spin=-1：顺时针方向（角度减少）
   * spin=0：不旋转
   */
  private lerpAngle(a: number, b: number, t: number, spin: number = 1): number {
    let diff = b - a;

    if (spin === 0) {
      return a;
    }

    // 规范化到 (-360, 360)
    while (diff >= 360) diff -= 360;
    while (diff <= -360) diff += 360;

    if (spin > 0) {
      // 逆时针：确保 diff 为正
      if (diff < 0) diff += 360;
    } else {
      // 顺时针：确保 diff 为负
      if (diff > 0) diff -= 360;
    }

    return a + diff * t;
  }

  /**
   * 计算骨骼世界变换
   *
   * Spriter 使用标准数学坐标系（Y 向上），Phaser 屏幕坐标系（Y 向下）。
   * 内部旋转矩阵保持标准数学不变，只在最终输出层对 Y 取反。
   */
  private computeBoneWorldTransform(
    parentRefId: number | undefined,
    local: SCMLTransform
  ): { x: number; y: number; angle: number; scaleX: number; scaleY: number } {
    // 根级：直接取反 Y（Spriter Y 向上 → Phaser Y 向下）
    if (parentRefId === undefined) {
      return {
        x: local.x,
        y: -local.y,
        angle: local.angle,
        scaleX: local.scaleX,
        scaleY: local.scaleY,
      };
    }

    const parent = this.boneWorldTransforms.get(parentRefId);
    if (!parent) {
      return {
        x: local.x,
        y: -local.y,
        angle: local.angle,
        scaleX: local.scaleX,
        scaleY: local.scaleY,
      };
    }

    // 先按 parent scale 缩放局部坐标（与 phaser-ce-spriter 一致：先缩放再旋转）
    const sx = local.x * parent.scaleX;
    const sy = local.y * parent.scaleY;

    // 标准数学旋转矩阵（逆时针角度）
    const rad = (parent.angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rx = sx * cos - sy * sin;
    const ry = sx * sin + sy * cos;

    // Y 取反：标准数学 Y 向上 → Phaser 屏幕 Y 向下
    return {
      x: parent.x + rx,
      y: parent.y - ry,
      angle: parent.angle + local.angle,
      scaleX: parent.scaleX * local.scaleX,
      scaleY: parent.scaleY * local.scaleY,
    };
  }

  /**
   * 计算对象世界变换
   *
   * 与骨骼变换逻辑一致：根级 Y 取反，非根级先缩放再旋转后 Y 取反。
   */
  private computeObjectWorldTransform(
    parentRefId: number | undefined,
    local: SCMLTransform
  ): PartTransform {
    if (parentRefId === undefined) {
      return {
        x: local.x,
        y: -local.y,
        angle: local.angle,
        scaleX: local.scaleX,
        scaleY: local.scaleY,
      };
    }

    const parent = this.boneWorldTransforms.get(parentRefId);
    if (!parent) {
      return {
        x: local.x,
        y: -local.y,
        angle: local.angle,
        scaleX: local.scaleX,
        scaleY: local.scaleY,
      };
    }

    const sx = local.x * parent.scaleX;
    const sy = local.y * parent.scaleY;

    const rad = (parent.angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rx = sx * cos - sy * sin;
    const ry = sx * sin + sy * cos;

    return {
      x: parent.x + rx,
      y: parent.y - ry,
      angle: parent.angle + local.angle,
      scaleX: parent.scaleX * local.scaleX,
      scaleY: parent.scaleY * local.scaleY,
    };
  }
}
