import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

type Props = { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[]>> }
const normalizedParams = (params: Props['params']) => params.then(({ segments }) => ({ segments: segments || [] }))
export const generateMetadata = ({ params, searchParams }: Props) => generatePageMetadata({ config, params: normalizedParams(params), searchParams })
export default function Page({ params, searchParams }: Props) { return RootPage({ config, importMap, params: normalizedParams(params), searchParams }) }
