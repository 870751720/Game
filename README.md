# Game Project

本仓库是游戏项目的主仓库，专注于游戏本身的开发。

## 目录结构

```
Game/
├── src/                   # 游戏源码
├── assets/                # 游戏资源（图片、音频、模型等）
├── docs/                  # 游戏设计文档（GDD）
├── ai-config/             # 游戏专属的 AI 配置
│   ├── npc-behaviors/     # NPC 行为树配置
│   ├── dialogue-trees/    # 对话系统数据
│   └── prompts/           # 游戏内运行时 Prompt
└── .kimi/                 # [Git Submodule] 引用中央 AI 配置库
```

## AI 集成

本项目通过 Git Submodule 引用 `AI` 仓库的通用 Skill 和 Rule：

```bash
git submodule update --init --recursive
```

- **通用 AI 配置**（如代码审查 Skill、编程规则）→ 见 `.kimi/`
- **游戏专属 AI 配置**（如 NPC 行为、对话数据）→ 见 `ai-config/`
