import { beforeEach, vi } from 'vitest'

// Node 22 has no Web Locks API. Model its shared, exclusive queue for tests,
// including modules loaded independently to represent extension contexts.
beforeEach(() => {
  const queues = new Map<string, Promise<unknown>>()
  vi.stubGlobal('navigator', {
    locks: {
      request<T>(name: string, callback: () => T | Promise<T>): Promise<T> {
        const next = (queues.get(name) ?? Promise.resolve()).then(callback)
        queues.set(
          name,
          next.catch(() => {}),
        )
        return next
      },
    },
  })
})
