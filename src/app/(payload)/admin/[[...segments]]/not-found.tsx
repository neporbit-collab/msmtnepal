import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

export default function NotFound({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) {
  const normalizedParams = params.then(({ segments }) => ({ segments: segments || [] }))
  return NotFoundPage({ config, importMap, params: normalizedParams, searchParams })
}
