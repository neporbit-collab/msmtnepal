import type { ReactNode } from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClientArgs } from 'payload'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'

const serverFunction = async (args: ServerFunctionClientArgs) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
