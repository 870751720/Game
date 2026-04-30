# Game Project — Agent 指南

> 本文档面向 AI Coding Agent。项目当前处于极早期的脚手架阶段，尚未选定具体技术栈。

---

## 项目概述

`Game` 是一个新初始化的游戏项目主仓库，托管于 `git@github.com:870751720/Game.git`。本项目专注于游戏本身的开发，目前**尚未引入任何游戏引擎、编程语言或构建工具**。仓库中当前仅包含以下文件：

- `.gitmodules` —— Git 子模块配置文件
- `.kimi/` —— Git 子模块（中央 AI 配置库）
- `README.md` —— 极简说明文件（当前仅剩一行标题）

---

## 技术栈与构建

- **当前状态**：未确定。仓库内不存在 `pyproject.toml`、`package.json`、`Cargo.toml`、`CMakeLists.txt`、`*.csproj`、引擎项目文件等任何构建或包管理配置。
- **构建命令**：暂无。
- **运行命令**：暂无。
- **依赖管理**：暂无。

> 在引入任何技术栈时，请务必将对应的构建命令、开发服务器启动方式以及依赖安装方式更新到本文件。

---

## Git Submodule（`.kimi`）

### 说明
`.kimi` 是指向中央 AI 配置库的子模块：

```
URL: git@github.com:870751720/AI.git
路径: d:\Game\.kimi
```

该子模块同样处于极早期阶段，内部包含 `README.md` 及若干目录（`agents/`、`docs/`、`mcp/`、`prompts/`、`rules/`），各目录中均有一个 `.gitkeep` 文件，暂无实际可消费的 Skill 或 Rule 文件。

### 常用操作
```bash
# 首次克隆后初始化子模块
git submodule update --init --recursive

# 更新子模块到远程最新
git submodule update --remote

# 在子模块内提交变更后，回到主仓库提交指针更新
cd .kimi && git push && cd .. && git add .kimi && git commit -m "chore: update .kimi submodule"
```

---

## 开发规范

- **文档语言**：项目内的注释、文档、README、提交信息等均使用**中文**。
- **提交信息风格**：历史提交遵循了简单的 Conventional Commits 风格，例如：
  - `chore: init Game project structure`
  - `docs: add README`
  - `chore: remove preset dirs, keep only .kimi submodule and README`
  - `chore: 清理 README 文件，移除多余内容`
- **代码风格**：暂无既定规范。引入具体编程语言后，请在 `.kimi/rules/` 或项目根目录添加对应配置（如 `.editorconfig`、ESLint、Ruff、Clippy 等），并同步更新本文件。

---

## 测试策略

- 当前无任何测试框架或测试文件。
- 选定技术栈后，请补充测试命令（例如 `pytest`、`cargo test`、`npm test` 等）并说明测试目录约定。

---

## 安全与部署

- **子模块安全**：`.kimi` 子模块通过 SSH（`git@github.com`）拉取。在 CI/CD 或自动化环境中需配置好 SSH Key 或改用 HTTPS，以免拉取失败。
- **密钥与凭证**：项目内不存在 `.env`、密钥文件或敏感配置。若后续添加，请务必将其加入 `.gitignore`，禁止提交到版本控制。
- **部署流程**：尚未建立。

---

## 给 Agent 的提示

1. **不要假设技术栈**：在添加代码前，先检查根目录是否存在引擎或语言特定的配置文件。如果不存在，请与项目维护者确认拟使用的技术栈。
2. **优先补充基础设施**：在写游戏逻辑之前，建议先建立 `.gitignore`、目录结构、构建脚本和开发文档（GDD）。
3. **保持中英文一致**：若现有文档为中文，新增文档和注释也应以中文为主。
4. **子模块隔离**：通用的 AI Skill / Rule 应放到 `.kimi/`（并向上游子模块仓库提交）；
