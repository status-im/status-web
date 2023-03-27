// see https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

// todo?: set cache header too
export function createHandler(
  createComponent: (url: URL) => React.ReactElement,
) {
  const handler = async (req: NextRequest) => {
    try {
      console.log('og')

      const component = createComponent(new URL(req.url))

      return new ImageResponse(component, {
        width: 1200,
        height: 630,
      })
    } catch (error) {
      console.error(error)

      return new Response(`Failed to generate the image`, {
        status: 500,
      })
    }
  }

  return handler
}
