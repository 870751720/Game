import type {
  SCMLData,
  SCMLFolder,
  SCMLFile,
  SCMLEntity,
  SCMLAnimation,
  SCMLMainlineKey,
  SCMLTimeline,
  SCMLTimelineKey,
  SCMLBoneRef,
  SCMLObjectRef,
  SCMLTransform,
  SCMLObjectData,
} from './spriter-types';

/**
 * Spriter SCML 文件解析器
 *
 * 将 Spriter 导出的 .scml XML 文件解析为结构化的 SCMLData。
 *
 * 支持的特性：
 * - 文件夹与文件定义
 * - 骨骼与对象层级
 * - 动画、主时间线、时间线关键帧
 * - 关键帧变换（位置、旋转、缩放）
 *
 * 暂不支持的高级特性：
 * - 变体（character maps）
 * - 声音事件
 * - 触发器
 * - 子实体
 */
export class SCMLParser {
  /**
   * 解析 SCML XML 文本为 SCMLData
   */
  static parse(xmlText: string): SCMLData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const root = doc.documentElement;
    if (root.tagName !== 'spriter_data') {
      throw new Error('SCMLParser: 根节点不是 <spriter_data>');
    }

    const folders = this.parseFolders(root);
    const entity = this.parseEntity(root);

    return { folders, entity };
  }

  private static parseFolders(root: Element): SCMLFolder[] {
    const folders: SCMLFolder[] = [];
    const folderElements = root.querySelectorAll('folder');

    for (const el of folderElements) {
      const folder: SCMLFolder = {
        id: this.getIntAttr(el, 'id'),
        files: [],
      };

      for (const fileEl of el.querySelectorAll('file')) {
        folder.files.push(this.parseFile(fileEl));
      }

      folders.push(folder);
    }

    return folders;
  }

  private static parseFile(el: Element): SCMLFile {
    return {
      id: this.getIntAttr(el, 'id'),
      name: this.getStrAttr(el, 'name'),
      width: this.getFloatAttr(el, 'width'),
      height: this.getFloatAttr(el, 'height'),
      pivotX: this.getFloatAttr(el, 'pivot_x', 0),
      pivotY: this.getFloatAttr(el, 'pivot_y', 1),
    };
  }

  private static parseEntity(root: Element): SCMLEntity {
    const entityEl = root.querySelector('entity');
    if (!entityEl) {
      throw new Error('SCMLParser: 未找到 <entity> 节点');
    }

    const entity: SCMLEntity = {
      id: this.getIntAttr(entityEl, 'id'),
      name: this.getStrAttr(entityEl, 'name'),
      boneInfos: [],
      animations: [],
    };

    // 解析骨骼定义
    for (const objEl of entityEl.querySelectorAll('obj_info')) {
      if (objEl.getAttribute('type') === 'bone') {
        entity.boneInfos.push({
          name: this.getStrAttr(objEl, 'name'),
          width: this.getFloatAttr(objEl, 'w', 0),
          height: this.getFloatAttr(objEl, 'h', 0),
        });
      }
    }

    // 解析动画
    for (const animEl of entityEl.querySelectorAll('animation')) {
      entity.animations.push(this.parseAnimation(animEl));
    }

    return entity;
  }

  private static parseAnimation(el: Element): SCMLAnimation {
    const animation: SCMLAnimation = {
      id: this.getIntAttr(el, 'id'),
      name: this.getStrAttr(el, 'name'),
      length: this.getIntAttr(el, 'length', 0),
      interval: this.getIntAttr(el, 'interval', 100),
      mainlineKeys: [],
      timelines: [],
    };

    // 解析 mainline
    const mainlineEl = el.querySelector('mainline');
    if (mainlineEl) {
      for (const keyEl of mainlineEl.querySelectorAll('key')) {
        animation.mainlineKeys.push(this.parseMainlineKey(keyEl));
      }
    }

    // 解析 timelines
    for (const timelineEl of el.querySelectorAll('timeline')) {
      animation.timelines.push(this.parseTimeline(timelineEl));
    }

    return animation;
  }

  private static parseMainlineKey(el: Element): SCMLMainlineKey {
    const key: SCMLMainlineKey = {
      id: this.getIntAttr(el, 'id'),
      time: this.getIntAttr(el, 'time', 0),
      boneRefs: [],
      objectRefs: [],
    };

    for (const refEl of el.querySelectorAll('bone_ref')) {
      key.boneRefs.push(this.parseBoneRef(refEl));
    }

    for (const refEl of el.querySelectorAll('object_ref')) {
      key.objectRefs.push(this.parseObjectRef(refEl));
    }

    return key;
  }

  private static parseBoneRef(el: Element): SCMLBoneRef {
    const ref: SCMLBoneRef = {
      id: this.getIntAttr(el, 'id'),
      timeline: this.getIntAttr(el, 'timeline'),
      key: this.getIntAttr(el, 'key'),
    };
    const parent = el.getAttribute('parent');
    if (parent !== null) {
      ref.parent = parseInt(parent, 10);
    }
    return ref;
  }

  private static parseObjectRef(el: Element): SCMLObjectRef {
    const ref: SCMLObjectRef = {
      id: this.getIntAttr(el, 'id'),
      timeline: this.getIntAttr(el, 'timeline'),
      key: this.getIntAttr(el, 'key'),
      zIndex: this.getIntAttr(el, 'z_index', 0),
    };
    const parent = el.getAttribute('parent');
    if (parent !== null) {
      ref.parent = parseInt(parent, 10);
    }
    return ref;
  }

  private static parseTimeline(el: Element): SCMLTimeline {
    const timeline: SCMLTimeline = {
      id: this.getIntAttr(el, 'id'),
      name: this.getStrAttr(el, 'name'),
      keys: [],
    };

    const objectType = el.getAttribute('object_type');
    if (objectType === 'bone') {
      timeline.objectType = 'bone';
    }

    for (const keyEl of el.querySelectorAll('key')) {
      timeline.keys.push(this.parseTimelineKey(keyEl));
    }

    return timeline;
  }

  private static parseTimelineKey(el: Element): SCMLTimelineKey {
    const key: SCMLTimelineKey = {
      id: this.getIntAttr(el, 'id'),
      time: this.getIntAttr(el, 'time', 0),
      spin: this.getIntAttr(el, 'spin', 1),
    };

    const boneEl = el.querySelector('bone');
    if (boneEl) {
      key.bone = this.parseTransform(boneEl);
    }

    const objectEl = el.querySelector('object');
    if (objectEl) {
      key.object = this.parseObjectData(objectEl);
    }

    return key;
  }

  private static parseTransform(el: Element): SCMLTransform {
    return {
      x: this.getFloatAttr(el, 'x', 0),
      y: this.getFloatAttr(el, 'y', 0),
      angle: this.getFloatAttr(el, 'angle', 0),
      scaleX: this.getFloatAttr(el, 'scale_x', 1),
      scaleY: this.getFloatAttr(el, 'scale_y', 1),
    };
  }

  private static parseObjectData(el: Element): SCMLObjectData {
    return {
      folder: this.getIntAttr(el, 'folder', 0),
      file: this.getIntAttr(el, 'file', 0),
      x: this.getFloatAttr(el, 'x', 0),
      y: this.getFloatAttr(el, 'y', 0),
      angle: this.getFloatAttr(el, 'angle', 0),
      scaleX: this.getFloatAttr(el, 'scale_x', 1),
      scaleY: this.getFloatAttr(el, 'scale_y', 1),
    };
  }

  // === 属性读取辅助函数 ===

  private static getStrAttr(el: Element, name: string): string {
    const val = el.getAttribute(name);
    if (val === null) {
      throw new Error(`SCMLParser: 缺少必需属性 "${name}" 于 <${el.tagName}>`);
    }
    return val;
  }

  private static getIntAttr(el: Element, name: string, defaultValue?: number): number {
    const val = el.getAttribute(name);
    if (val === null) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`SCMLParser: 缺少必需属性 "${name}" 于 <${el.tagName}>`);
    }
    return parseInt(val, 10);
  }

  private static getFloatAttr(el: Element, name: string, defaultValue?: number): number {
    const val = el.getAttribute(name);
    if (val === null) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`SCMLParser: 缺少必需属性 "${name}" 于 <${el.tagName}>`);
    }
    return parseFloat(val);
  }
}
