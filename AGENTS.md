<!-- From: d:\Game\AGENTS.md -->
# Game Project — Agent 指南

> 本文档面向 AI Coding Agent。

---

## 项目概述

`Game` 是一个基于 **Phaser 3 + TypeScript + Vite** 的 2D 网页游戏项目。

---

## 技术栈与构建

- **游戏引擎**: [Phaser 3](https://phaser.io/) (v4.0.0)
- **编程语言**: TypeScript (v6.0.3)
- **构建工具**: [Vite](https://vitejs.dev/) (v8.0.10)
- **包管理器**: npm

### 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（带热重载）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

---

## 项目目录结构

```
Game/
├── index.html              # 入口 HTML
├── package.json            # 依赖与脚本
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── .gitignore
├── public/                 # 静态资源（直接复制到输出目录）
│   └── assets/             # 图片、音频、字体等游戏资源
├── src/
│   ├── main.ts             # 入口文件：创建 Phaser.Game 实例
│   ├── gameConfig.ts       # 游戏全局配置（分辨率、物理、场景列表等）
│   └── scenes/             # 场景目录
│       └── BootScene.ts    # 启动场景（示例）
```

### 场景管理

- 所有场景放在 `src/scenes/` 下。
- 在 `src/gameConfig.ts` 的 `scene` 数组中注册新场景。
- 场景切换使用 `this.scene.start('SceneKey')`。

---

## 开发规范

- **文档语言**：项目内的注释、文档、README、提交信息等均使用**中文**。
- **提交信息风格**：遵循 Conventional Commits，例如：
  - `feat: 添加玩家移动逻辑`
  - `fix: 修复碰撞检测偏移`
  - `chore: 更新 .kimi submodule`
- **代码风格**：使用 TypeScript 严格模式；场景类继承 `Phaser.Scene`；优先使用 Arcade 物理引擎。

---

## 测试策略

- 当前未引入测试框架。
- 需要时建议选用与 Phaser 兼容的方案（如 Jest + ts-jest 或 Playwright 做 E2E）。

---

## 安全与部署

- **子模块安全**：`.kimi` 子模块通过 SSH（`git@github.com`）拉取。在 CI/CD 或自动化环境中需配置好 SSH Key 或改用 HTTPS，以免拉取失败。
- **密钥与凭证**：项目内不存在 `.env`、密钥文件或敏感配置。若后续添加，请务必将其加入 `.gitignore`，禁止提交到版本控制。
- **部署流程**：构建产物位于 `dist/` 目录，可部署到任意静态托管服务（GitHub Pages、Vercel、Netlify 等）。

---

## 给 Agent 的提示

1. **添加新场景时**：在 `src/scenes/` 创建新文件，并在 `src/gameConfig.ts` 中注册。
2. **添加资源时**：放入 `public/assets/`，在场景的 `preload()` 中使用 `this.load.*` 加载。
3. **保持中文一致**：若现有文档为中文，新增文档和注释也应以中文为主。
4. **子模块隔离**：通用的 AI Skill / Rule 应放到 `.kimi/`（并向上游子模块仓库提交）；游戏业务代码留在主仓库。
