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
      url: './',
      title: input.title,
      description: input.description,
      ...input.openGraph,
    },
  }
}
