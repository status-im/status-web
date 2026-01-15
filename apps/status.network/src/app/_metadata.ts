import { generateMetadata as generateMetadataUtil } from '@status-im/status-network/utils'
import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Network'
const DEFAULT_SITE_URL = 'https://status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/opengraph-image.png`

type Input = Metadata & {
  title?: NonNullable<Metadata['title']>
  description?: string
  pathname?: string
  locale?: string
}

const config = {
  siteName: DEFAULT_SITE_NAME,
  siteUrl: DEFAULT_SITE_URL,
  twitterSite: DEFAULT_TWITTER_SITE,
  ogImage: DEFAULT_OG_IMAGE,
}

export function Metadata(input: Input): Metadata {
  return generateMetadataUtil(input, config)
}
