import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import config from '@payload-config'
import { importMap } from '../importMap'

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}) => generatePageMetadata({ config, params, searchParams })

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}) {
  return RootPage({ config, importMap, params, searchParams })
}
