# AGENTS.md

给所有 AI coding agent 看的项目说明书（Claude Code、Cursor、Copilot Agent 等）。
阅读本文件可以理解项目结构、规范和边界，避免做出不符合预期的改动。
使用中文
---

## 项目概览

**类型**：个人博客
**技术栈**：Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · SQLite (Drizzle ORM) · pnpm
**内容管理**：Markdown 文件，存放于 `content/` 目录，使用 gray-matter 解析 frontmatter
**部署方式**：Docker standalone，MinIO 对象存储处理图片上传

---

## 目录结构

```
content/
  articles/       # 文章 (.md)
  weekly/         # 周刊 (.md)
  books/          # 读书笔记 (.md)

src/
  app/            # Next.js App Router 页面
    api/          # API 路由
  components/
    layout/       # Header, Footer, Nav, ThemeToggle, ScrollOffset
    post/         # PostCard, PostContent, PostList, PostPage, TableOfContents, MarginNotes, TagList
    mdx/          # 自定义 MDX 组件（Mark, Tip）
  lib/
    posts.ts      # 文章读取、TOC 提取、元数据
    books.ts      # 读书笔记读取
    config.ts     # 站点配置常量
    utils.ts      # 通用工具函数
  types/index.ts  # 全局类型定义

public/
  # 静态资源
```

---

## 内容规范

### Frontmatter 字段

**文章** (`content/articles/`):
```yaml
title: ""
date: "YYYY-MM-DD"
tags: []
excerpt: ""
cover: ""        # 可选，MinIO 图片 URL
draft: false     # true 时不在列表显示
```

**周刊** (`content/weekly/`):
```yaml
title: ""
date: "YYYY-MM-DD"
tags: []
excerpt: ""
draft: false
```

**读书笔记** (`content/books/`):
```yaml
title: ""
author: ""
cover: ""        # 可选，封面图 URL（如 Open Library Covers API）
date: "YYYY-MM-DD"
tags: []
excerpt: ""
draft: false
```

---

## 设计系统

### 调色板（CSS 自定义属性）

所有颜色通过 CSS 变量使用，**不要用硬编码色值**：

| 变量 | 用途 |
|------|------|
| `--color-bg` | 页面背景（浅：`#f5f2ed` 暖奶油） |
| `--color-bg-soft` | 次级背景 |
| `--color-fg` | 正文颜色 |
| `--color-fg-muted` | 次要文字 |
| `--color-fg-subtle` | 弱化文字（时间戳、标签等） |
| `--color-border` | 分隔线、边框 |
| `--color-accent` | 链接、强调色 |
| `--color-tag-bg / fg` | 标签背景/前景 |

暗色模式通过 `.dark` class 覆盖，使用 `next-themes` 管理。

### 字体

- `--font-sans`：系统字体栈，含中文 PingFang SC / 微软雅黑
- `--font-mono`：JetBrains Mono / Fira Code

### 间距与圆角

- `--radius-sm: 4px`、`--radius-md: 8px`
- 正文最大宽度：`max-w-2xl`（`src/app/layout.tsx`）

---

## 代码规范
参考《重构：改善代码的既有设计》以及《代码整洁之道》的规范

- **TypeScript**：严格模式，所有新代码须有类型
- **组件**：Server Component 优先；需要 `useState`/`useEffect` 的才加 `'use client'`
- **样式**：用 Tailwind 工具类 + CSS 变量 inline style，不新建独立 CSS 文件
- **命名**：组件 PascalCase，文件 kebab-case，函数/变量 camelCase
- **引号**：单引号（TypeScript），双引号（JSX 属性）
- **导入路径**：使用 `@/` 别名

---

## 关键约定

1. **新增内容类型**：在 `src/lib/` 新增对应读取函数，参考 `posts.ts` / `books.ts` 的模式
2. **新增页面**：在 `src/app/` 下创建，静态内容用 `generateStaticParams` 预渲染
3. **API 路由**：放在 `src/app/api/`，鉴权通过 `UPLOAD_API_KEY` 环境变量
4. **MDX 自定义组件**：在 `src/components/mdx/` 添加，在 `post-content.tsx` 注册
5. **导航链接**：修改 `src/components/layout/nav-links.tsx`

---

## 环境变量

必须的：
```
SITE_URL            # 站点公开地址
SITE_NAME           # 站点名称
SITE_DESCRIPTION    # 站点描述
DB_PATH             # SQLite 数据库路径
```

---

## 行为边界

### 允许
- 修改 `src/` 下的组件、页面、lib
- 新增 `content/` 下的 Markdown 文件
- 调整 `src/app/globals.css` 的设计 token

### 禁止
- 修改 `docker-compose.yml`、`Dockerfile` 等基础设施文件
- 提交包含密钥或凭证的文件
- 引入新的 CSS 框架或 UI 组件库
- 修改数据库 schema（除非明确要求）
- 自动推送到远程仓库或合并 PR

---

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm lint         # ESLint 检查
pnpm db:push      # 同步数据库 schema（Drizzle Kit）
```
