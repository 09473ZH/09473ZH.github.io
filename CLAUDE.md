# CLAUDE.md

> 详细项目说明见 [AGENTS.md](./AGENTS.md)，本文件是 Claude Code 专用的补充说明。

## 快速上手

```bash
pnpm dev      # 开发服务器 → http://localhost:3000
pnpm build    # 生产构建
pnpm lint     # Lint 检查
```

## Claude Code 使用习惯

- 修改文件前先 Read，理解现有代码再改
- 样式优先用 CSS 变量（`var(--color-*)`)，不硬编码色值
- Server Component 优先，非必要不加 `'use client'`
- 不自动提交、不自动推送，除非明确被要求
- 不要自动删除看起来未使用的文件，先确认
