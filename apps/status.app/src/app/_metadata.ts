import { createCloudinaryUrl } from '~components/assets/loader'

import type { Metadata } from 'next'

type Input = Metadata & {
  title: NonNullable<Metadata['title']>
  description?: string
}

export function Metadata(input: Input): Metadata {
  return {
    ...input,
    openGraph: {
      type: 'website',
      images: [createCloudinaryUrl('Open Graph/Status_Open_Graph_01:1200:630')],
      url: './',
      title: input.title,
      description: input.description,
      ...input.openGraph,
    },
  }
}
