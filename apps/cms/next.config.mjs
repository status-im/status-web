import { fileURLToPath } from 'node:url'

import { withPayload } from '@payloadcms/next/withPayload'

// Resolve the monorepo root so Next.js infers the correct workspace root for
// both turbopack and output file tracing. Setting only `turbopack.root` while
// Vercel auto-injects `outputFileTracingRoot` triggers a mismatch warning at
// build time.
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url))

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
}

export default withPayload(nextConfig)
