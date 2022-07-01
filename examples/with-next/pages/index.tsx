import { MemoryRouter } from '@status-im/react'
import dynamic from 'next/dynamic'

/**
 * For some reason the regular import fails with a server error:
 * Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
 * The error is caused by the react-content-loader package.
 * The workaround is to use the dynamic import and render the component on the client.
 */
const Community = dynamic(
  import('@status-im/react').then(({ Community }) => Community),
  { ssr: false }
)

export default function Index() {
  return (
    <Community
      publicKey="<YOUR_COMMUNITY_KEY>"
      theme="light"
      router={MemoryRouter}
    />
  )
}
