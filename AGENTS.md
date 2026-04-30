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

## 开发规范

- **文档语言**：项目内的注释、文档、README、提交信息等均使用**中文**。
- **提交信息风格**：遵循 Conventional Commits，例如：
  - `feat: 添加玩家移动逻辑`
  - `fix: 修复碰撞检测偏移`
  - `chore: 更新 .kimi submodule`
---

## 给 Agent 的提示
1. **保持中文一致**：若现有文档为中文，新增文档和注释也应以中文为主。
2. **子模块隔离**：通用的 AI Skill / Rule 应放到 `.kimi/`（并向上游子模块仓库提交）；游戏业务代码留在主仓库。
3. **记忆系统**：Agent 在会话开始时读取 `.kimi/memory/INDEX.md`，按需加载记忆。长任务结束后自动归档到 `memory/sessions/`；被纠正时更新 `memory/learnings.md`。
