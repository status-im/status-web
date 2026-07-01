import { NotFoundPage } from '@payloadcms/next/views'

import config from '@payload-config'
import { importMap } from '../importMap'

export default function NotFound({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}) {
  return NotFoundPage({ config, importMap, params, searchParams })
}
