import { generateMetadata as generateMetadataUtil } from '@status-im/status-network/utils'
import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Network'
const DEFAULT_SITE_URL = 'https://status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/opengraph-image.png`
export const DEFAULT_TITLE =
  'Status Network | Gasless Ethereum L2 with Native Yield'
export const DEFAULT_DESCRIPTION =
  'Status Network is a gasless zkEVM Ethereum Layer 2 with native yield, privacy by design, and reputation-based governance for scalable onchain apps.'

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
