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
      // @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif for automatic adding of og:image tags
      // note: https://github.com/vercel/next.js/discussions/50353#discussioncomment-12215100
      // images: [
      //   {
      //     url: '/opengraph-image.png',
      //     type: 'image/png',
      //     width: 1200,
      //     height: 630,
      //   },
      // ],
      ...input.openGraph,
    },
  }
}
