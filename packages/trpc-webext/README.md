# @status-im/trpc-webext

A tRPC adapter for web extensions that enables type-safe communication between different extension contexts (background, content scripts, popup, etc.).

## Installation

```sh
pnpm add @status-im/trpc-webext
```

## Basic Usage

### 1. Create your tRPC router (typically in background script)

```typescript
import { initTRPC } from '@trpc/server'
import { createWebExtHandler } from '@status-im/trpc-webext/adapter'
import { browser } from 'webextension-polyfill'
import superjson from 'superjson'

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  isServer: false,
  allowOutsideOfServer: true,
})

// Define your router
const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return =Hello ${input.name}!=
    }),
})

// Create context function
const createContext = async (opts) => {
  return {
    // Add your context data here
    userId: 'user Alice',
  }
}

// Set up the handler in background script
createWebExtHandler({
  router: appRouter,
  createContext,
  runtime: browser.runtime,
})

export type AppRouter = typeof appRouter
```

### 2. Create a client (in popup, content script, etc.)

```typescript
import { createTRPCClient } from '@trpc/client'
import { webExtensionLink } from '@status-im/trpc-webext/link'
import { browser } from 'webextension-polyfill'
import superjson from 'superjson'
import type { AppRouter } from './background'

const client = createTRPCClient<AppRouter>({
  links: [
    webExtensionLink({
      runtime: browser.runtime,
      transformer: superjson, // same transformer as the server
      timeoutMS: 30000, // optional, defaults to 10000ms
    }),
  ],
})

// Use the client
async function example() {
  const result = await client.greeting.query({ name: 'World' })
  console.log(result) // "Hello World!"
}
```

## Key Features

- **Type Safety**: Full TypeScript support with end-to-end type safety
- **Real-time Communication**: Support for subscriptions using observables
- **Multiple Contexts**: Works across all web extension contexts (background, popup, content scripts, options page, etc.)
- **Data Transformation**: Built-in support for data transformers like SuperJSON
- **Error Handling**: Proper error propagation and handling
- **Connection Management**: Automatic cleanup of connections and subscriptions

## Configuration Options

### `createWebExtHandler` options:

- `router`: Your tRPC router
- `createContext`: Function to create request context
- `runtime`: Browser runtime (e.g., `browser.runtime`)
- `onError`: Optional error handler

### `webExtensionLink` options:

- `runtime`: Browser runtime (e.g., `browser.runtime`)
- `transformer`: Data transformer (e.g., SuperJSON)
- `timeoutMS`: Request timeout in milliseconds (default: 10000)

## Notes

- The handler should be set up in your background script
- Clients can be created in any extension context
- Make sure to use the same transformer on both ends
- Subscriptions are automatically cleaned up when ports disconnect
