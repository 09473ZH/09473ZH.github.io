import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const config: NextConfig = {
  output: isProd ? 'export' : undefined,
  trailingSlash: true,
  serverExternalPackages: ['shiki'],
  turbopack: {
    root: __dirname,
  },
}

export default config
