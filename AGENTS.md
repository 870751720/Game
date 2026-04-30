<!-- From: d:\Game\AGENTS.md -->
# Game Project — Agent 指南

## 项目概述

`Game` 是一个基于 **Phaser 3 + TypeScript + Vite** 的 2D 网页游戏项目。

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

## Agent必须遵守
1. **强制加载记忆**：每次会话开始时，必须先读取 `.kimi/memory/INDEX.md`，并按索引加载所有标记为必读的记忆文件，然后再执行用户请求。
