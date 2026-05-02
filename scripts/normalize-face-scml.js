/**
 * 批量合并 SCML 中的 face 文件
 *
 * 把 face_01 / face_02 / face_03 合并为单个 face，
 * 删除多余定义并重排 file ID。
 */
const fs = require('fs');
const path = require('path');

const ANIM_DIR = path.join(__dirname, '..', 'public', 'assets', 'animations', 'humanoid');

function normalizeFaceInSCML(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. 提取 <folder> 中的所有 <file> 标签
  const fileRegex = /<file id="(\d+)" name="([^"]+)"[\s\S]*?\/>/g;
  const files = [];
  let m;
  while ((m = fileRegex.exec(content)) !== null) {
    files.push({ id: parseInt(m[1], 10), name: m[2], raw: m[0] });
  }

  // 找到 face 相关的 file
  const faceIds = [];
  const keepFiles = [];
  for (const f of files) {
    if (/^face_\d+\.png$/i.test(f.name)) {
      faceIds.push(f.id);
    } else {
      keepFiles.push(f);
    }
  }

  if (faceIds.length === 0) {
    console.log(`  无 face 文件，跳过`);
    return;
  }

  const minFaceId = Math.min(...faceIds);

  // 2. 构建旧 id → 新 id 映射
  const idMap = {};
  let newId = 0;
  for (const f of files) {
    if (f.id === minFaceId) {
      idMap[f.id] = newId++;
    } else if (faceIds.includes(f.id)) {
      // 多余 face 映射到保留的 face id
      idMap[f.id] = idMap[minFaceId];
    } else {
      idMap[f.id] = newId++;
    }
  }

  // 3. 重建 <folder> 内容
  const newFiles = [];
  for (const f of files) {
    if (faceIds.includes(f.id) && f.id !== minFaceId) continue; // 跳过多余 face

    let newRaw = f.raw;
    // 替换 id
    newRaw = newRaw.replace(/id="\d+"/, `id="${idMap[f.id]}"`);
    // 如果是保留的 face，改名
    if (f.id === minFaceId) {
      newRaw = newRaw.replace(/name="[^"]+"/, `name="face.png"`);
    }
    newFiles.push(newRaw);
  }

  const newFolderXml = `    <folder id="0">\n${newFiles.map(f => '        ' + f).join('\n')}\n    </folder>`;

  // 4. 替换整个 <folder>...</folder>
  content = content.replace(/<folder id="0">[\s\S]*?<\/folder>/, newFolderXml);

  // 5. 更新所有 <object folder="0" file="X" ...> 中的 file ID
  content = content.replace(
    /<object folder="0" file="(\d+)"/g,
    (match, oldFileId) => {
      const newFileId = idMap[parseInt(oldFileId, 10)];
      return `<object folder="0" file="${newFileId}"`;
    }
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  face ${faceIds.length} 个 → 1 个`);
}

const files = fs.readdirSync(ANIM_DIR).filter(f => f.endsWith('.scml'));
for (const file of files) {
  const fp = path.join(ANIM_DIR, file);
  process.stdout.write(`${file}: `);
  normalizeFaceInSCML(fp);
}
console.log('\n处理完成');
