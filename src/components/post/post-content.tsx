import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import { Tip } from '@/components/mdx/tip'
import { Mark } from '@/components/mdx/mark'

const components = { Tip, Mark }

export function PostContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              [rehypePrettyCode, {
                theme: { dark: 'vesper', light: 'rose-pine-dawn' },
                keepBackground: true,
              }],
            ],
          },
        }}
      />
    </div>
  )
}
