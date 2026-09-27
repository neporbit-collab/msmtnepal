import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [] },
  experimental: {
    webpackMemoryOptimizations: true,
  },
}

export default withPayload(nextConfig)
