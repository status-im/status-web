import { generateMetadata as generateMetadataUtil } from '@status-im/status-network/utils'

import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Network Hub'
const DEFAULT_DESCRIPTION =
  'Get started on the gasless L2 with native yield and composable privacy! Try apps and deposit assets to earn Karma'
const DEFAULT_SITE_URL = 'https://hub.status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`

type Input = Metadata & {
  description?: string
  pathname?: string
  locale?: string
}

const config = {
  siteName: DEFAULT_SITE_NAME,
  siteUrl: DEFAULT_SITE_URL,
  twitterSite: DEFAULT_TWITTER_SITE,
  ogImage: DEFAULT_OG_IMAGE,
  defaultDescription: DEFAULT_DESCRIPTION,
}

export function Metadata(input: Input): Metadata {
  return generateMetadataUtil(
    {
      ...input,
      title: DEFAULT_SITE_NAME as NonNullable<Metadata['title']>,
      description: DEFAULT_DESCRIPTION,
    },
    config
  )
}
