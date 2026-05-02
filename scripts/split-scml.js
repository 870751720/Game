/**
 * SCML 动画拆分工具
 *
 * 将单个包含多动画的 .scml 文件拆分为每个动画一个独立文件。
 * 拆分后的文件仍保留完整的 folder + entity + obj_info，可用 Spriter 直接打开编辑。
 */
const fs = require('fs');
const path = require('path');

function toSnakeCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function splitSCML(inputPath, outputDir) {
  const content = fs.readFileSync(inputPath, 'utf-8');

  // 找到第一个 <animation 的位置，之前的部分作为 header（含 folder、entity、obj_info）
  const firstAnimIdx = content.indexOf('<animation id="0"');
  if (firstAnimIdx === -1) {
    throw new Error('未找到 <animation> 标签');
  }
  const header = content.slice(0, firstAnimIdx);

  // 找到最后一个 </animation> 的结束位置，之后的部分作为 footer
  const lastAnimEnd = content.lastIndexOf('</animation>');
  if (lastAnimEnd === -1) {
    throw new Error('未找到 </animation> 结束标签');
  }
  const footerStart = lastAnimEnd + '</animation>'.length;
  const footer = content.slice(footerStart);

  // 提取所有 animation 块
  const animRegex = /<animation id="\d+" name="([^"]+)"[\s\S]*?<\/animation>/g;
  const animations = [];
  let match;
  while ((match = animRegex.exec(content)) !== null) {
    animations.push({
      name: match[1],
      xml: match[0],
    });
  }

  if (animations.length === 0) {
    throw new Error('未提取到任何动画');
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (const anim of animations) {
    const fileName = `${toSnakeCase(anim.name)}.scml`;
    const outPath = path.join(outputDir, fileName);
    const fileContent = header + anim.xml + '\n' + footer;
    fs.writeFileSync(outPath, fileContent, 'utf-8');
    console.log(`✓ ${fileName}  (${anim.name})`);
  }

  console.log(`\n共拆分 ${animations.length} 个动画 → ${path.resolve(outputDir)}`);
}

const input = process.argv[2] || 'public/assets/characters/barbarian_02/animations.scml';
const output = process.argv[3] || 'public/assets/animations/humanoid';

splitSCML(input, output);
