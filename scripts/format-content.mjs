#!/usr/bin/env node
/**
 * scripts/format-content.mjs
 *
 * 文章排版自动格式化：
 *   1. 中英文/数字之间自动加空格（pangu）
 *   2. 折叠 3+ 连续空行为 2 行
 *   3. 清除行尾多余空格（保留 Markdown 硬换行的两个空格）
 *   4. 补全缺失的 frontmatter 字段
 *
 * 用法：
 *   node scripts/format-content.mjs          # 处理全部文章
 *   node scripts/format-content.mjs path/to/file.md ...
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pangu = require('pangu')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const CONTENT_DIRS = ['content/articles', 'content/weekly', 'content/books']

// ── 1. 将 Markdown 拆分为「代码段」和「正文段」──────────────────────

/**
 * 返回 { code: boolean, text: string }[] 的数组。
 * code=true 的段落（围栏代码块、行内代码）原样保留，不做任何修改。
 */
function splitSegments(markdown) {
  const segments = []
  // 匹配围栏代码块 ``` ... ``` 和行内代码 `...`
  const re = /(```[\s\S]*?```|`[^`\n]+`)/g
  let last = 0
  let m

  while ((m = re.exec(markdown)) !== null) {
    if (m.index > last) {
      segments.push({ code: false, text: markdown.slice(last, m.index) })
    }
    segments.push({ code: true, text: m[0] })
    last = m.index + m[0].length
  }

  if (last < markdown.length) {
    segments.push({ code: false, text: markdown.slice(last) })
  }

  return segments
}

// ── 2. 对正文段应用 pangu，同时保护 URL ─────────────────────────────

function spaceProse(text) {
  const holders = []

  function protect(str) {
    holders.push(str)
    return `\x00${holders.length - 1}\x00`
  }

  let s = text
    // 保护裸 URL（不含中文字符和常见中文标点）
    .replace(/https?:\/\/[^\s\u4e00-\u9fff\uff00-\uffef）】》"']+/g, protect)
    // 保护 Markdown 强调标记（*** / ** / * / ___ / __ / _）
    .replace(/(\*{1,3}|_{1,3})[^\n]+?\1/g, protect)

  s = pangu.spacing(s)

  return s.replace(/\x00(\d+)\x00/g, (_, i) => holders[+i])
}

// ── 3. 格式化正文 ────────────────────────────────────────────────────

function formatBody(raw) {
  // 对非代码段应用 pangu
  let body = splitSegments(raw)
    .map((s) => (s.code ? s.text : spaceProse(s.text)))
    .join('')

  // 修复 pangu 在 Markdown 强调标记内侧插入的多余空格
  // ** text ** → **text**，* text * → *text*
  body = body.replace(/(\*{1,3}) ([^\n*]+?) (\*{1,3})/g, (m, open, inner, close) =>
    open.length === close.length ? `${open}${inner}${close}` : m
  )

  // 修复代码块语言标注：``` lang="ts" / ``` language="ts" → ```ts
  body = body.replace(/^```\s*(?:lang(?:uage)?=["']?)(\w+)["']?/gm, '```$1')

  // 移除引用块末尾的空 > 行（避免渲染出多余空段落）
  body = body.replace(/\n>\n\n/g, '\n\n')

  // 折叠 3+ 连续空行 → 2 行
  body = body.replace(/\n{3,}/g, '\n\n')

  // 清除行尾空格（保留 Markdown 硬换行：行尾 2 个空格）
  body = body.replace(/(?<! {2}) +$/gm, '')

  return body.trimEnd() + '\n'
}

// ── 4. 补全 frontmatter ──────────────────────────────────────────────

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  if (!match) return null
  // 去掉 Markdown 强调标记
  return match[1].replace(/\*{1,3}|_{1,3}/g, '').trim()
}

function extractExcerpt(content) {
  const firstPara = content
    .split('\n\n')
    .find(
      (p) =>
        p.trim() &&
        !p.trim().startsWith('#') &&
        !p.trim().startsWith('```') &&
        !p.trim().startsWith('>')
    )
  return (firstPara ?? '')
    .replace(/[*_`#\[\]()>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
}

function completeFrontmatter(data, content) {
  const today = new Date().toISOString().split('T')[0]

  const date =
    data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : data.date ?? today

  const title = data.title || extractTitle(content) || 'Untitled'
  const excerpt = data.excerpt || extractExcerpt(content)

  return {
    draft: false,
    ...data,
    title,
    date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt,
  }
}

// ── 5. 处理单个文件 ──────────────────────────────────────────────────

function formatFile(filePath) {
  const abs = path.resolve(filePath)
  if (!fs.existsSync(abs)) {
    console.warn(`  skip: ${filePath} (not found)`)
    return
  }

  const src = fs.readFileSync(abs, 'utf-8')
  if (!src.trim()) return

  const { data, content } = matter(src)
  const newData = completeFrontmatter(data, content)
  const newContent = formatBody(content)

  const output = matter.stringify(newContent, newData)
  if (output !== src) {
    fs.writeFileSync(abs, output)
    console.log(`  ✓ ${path.relative(ROOT, abs)}`)
  }
}

// ── 6. 入口 ─────────────────────────────────────────────────────────

const args = process.argv.slice(2).filter(Boolean)

const files =
  args.length > 0
    ? args
    : CONTENT_DIRS.flatMap((dir) => {
        const abs = path.join(ROOT, dir)
        if (!fs.existsSync(abs)) return []
        return fs
          .readdirSync(abs)
          .filter((f) => f.endsWith('.md'))
          .map((f) => path.join(abs, f))
      })

if (files.length === 0) {
  console.log('No markdown files found.')
  process.exit(0)
}

files.forEach(formatFile)
console.log(`Done. ${files.length} file(s) checked.`)
