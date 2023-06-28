import { MemoryRouter } from '@status-im/react'
import dynamic from 'next/dynamic'

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY

if (!publicKey) {
  throw new Error(
    'Add NEXT_PUBLIC_PUBLIC_KEY to your environment variables (see .env.example)'
  )
}

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'production' | 'test'

/**
 * For some reason the regular import fails with a server error:
 * Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
 * The error is caused by the react-content-loader package.
 * The workaround *for now* is to use the dynamic import and render the component on the client.
 */
const Community = dynamic(
  import('@status-im/react').then(({ Community }) => Community),
  { ssr: false }
)

export default function Index() {
  return (
    <Community
      publicKey={publicKey}
      environment={environment}
      router={MemoryRouter}
    />
  )
}
