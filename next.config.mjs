import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [] },
}

export default withPayload(nextConfig)
