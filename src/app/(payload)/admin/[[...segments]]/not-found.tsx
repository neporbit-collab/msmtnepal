import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

type Props = { params?: Promise<{ segments?: string[] }>; searchParams?: Promise<Record<string, string | string[]>> }

export default function NotFound({ params, searchParams }: Props) {
  const normalizedParams = (params ?? Promise.resolve({})).then(({ segments }) => ({ segments: segments || [] }))
  return NotFoundPage({ config, importMap, params: normalizedParams, searchParams: searchParams ?? Promise.resolve({}) })
}
