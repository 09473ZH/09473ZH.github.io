# 个人博客

基于 Next.js 15 构建的个人博客，部署在 GitHub Pages。

**地址：** https://09473ZH.github.io

## 技术栈

- Next.js 15 (App Router, 静态导出)
- TypeScript + Tailwind CSS v4
- Markdown 内容管理（gray-matter + next-mdx-remote）
- GitHub Actions 自动部署

## 内容目录

```
content/
  articles/   # 文章
  weekly/     # 周刊
  books/      # 读书笔记
```

## 本地开发

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生产构建（含 RSS 生成）
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages。
