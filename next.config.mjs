
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { remotePatterns: [] },
  experimental: {
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false,
  },
}

export default withPayload(nextConfig)
