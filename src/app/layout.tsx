import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/layout/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollOffset } from '@/components/layout/scroll-offset'
import { siteConfig } from '@/lib/config'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteConfig.url}/api/rss`,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <ScrollOffset />
            <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-14">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
