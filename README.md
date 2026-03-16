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

## 定制指南

### 1. 基本信息

编辑 `src/lib/config.ts`：

```ts
export const siteConfig = {
  author: '你的名字',
  name: '博客标题',
  description: '博客描述',
  url: 'https://你的域名',
}
```

### 2. GitHub Actions 变量

在仓库 **Settings → Secrets and variables → Actions → Variables** 中添加：

| 变量名 | 示例值 |
|---|---|
| `SITE_URL` | `https://username.github.io` |
| `SITE_NAME` | `My Blog` |
| `SITE_DESCRIPTION` | `A minimalist personal blog` |

### 3. About 页面

编辑 `src/app/about/page.tsx` 顶部的配置区块：

```ts
const ACE_ITEMS = [ ... ]   // 个人标签
const BIO = [ ... ]         // 简介段落
const PROJECTS = [ ... ]    // 项目列表
const SOCIAL = [ ... ]      // 联系方式
```

### 4. 导航链接

编辑 `src/components/layout/nav-links.tsx` 中的 `NAV_LINKS` 数组。

### 5. 开启 GitHub Pages

仓库 **Settings → Pages → Source** 选择 **GitHub Actions**，推送即自动部署。
