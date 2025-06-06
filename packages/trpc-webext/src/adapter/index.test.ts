import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest'
import { initTRPC, TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { z } from 'zod'
import { createWebExtHandler } from './'
import type { Runtime } from 'webextension-polyfill'

// Mock runtime
const mockRuntime = {
  onConnect: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn(),
  },
} as unknown as Runtime.Static

// Mock port
const createMockPort = (): Runtime.Port => ({
  name: 'test-port',
  postMessage: vi.fn(),
  onMessage: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn(),
  },
  onDisconnect: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn(),
  },
  disconnect: vi.fn(),
  sender: undefined,
  error: undefined,
})

// Test router setup
const t = initTRPC.create()
const testRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `Hello ${input.name}!`),

  count: t.procedure
    .input(z.object({ start: z.number() }))
    .subscription(({ input }) => {
      return observable<number>(emit => {
        let count = input.start
        const timer = setInterval(() => {
          emit.next(count++)
          if (count > input.start + 3) {
            emit.complete()
          }
        }, 100)
        return () => clearInterval(timer)
      })
    }),

  error: t.procedure.query(() => {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Test error',
    })
  }),

  mutation: t.procedure
    .input(z.object({ value: z.string() }))
    .mutation(({ input }) => ({ result: input.value.toUpperCase() })),
})

describe('createWebExtHandler', () => {
  let mockPort: Runtime.Port
  let onConnectListener: (port: Runtime.Port) => void
  let onMessageListener: (
    message: unknown,
    port: Runtime.Port,
  ) => Promise<void> | void
  let onDisconnectListener: (port: Runtime.Port) => void

  beforeEach(() => {
    vi.clearAllMocks()
    mockPort = createMockPort()

    // Capture the listeners when they're added
    ;(mockRuntime.onConnect.addListener as Mock).mockImplementation(
      listener => {
        onConnectListener = listener
      },
    )
    ;(mockPort.onMessage.addListener as Mock).mockImplementation(listener => {
      onMessageListener = listener
    })
    ;(mockPort.onDisconnect.addListener as Mock).mockImplementation(
      listener => {
        onDisconnectListener = listener
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Handler Setup', () => {
    it('should register onConnect listener', () => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })

      expect(mockRuntime.onConnect.addListener).toHaveBeenCalledOnce()
      expect(typeof onConnectListener).toBe('function')
    })

    it('should handle port connection', () => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })

      onConnectListener(mockPort)

      expect(mockPort.onMessage.addListener).toHaveBeenCalledOnce()
      expect(mockPort.onDisconnect.addListener).toHaveBeenCalledOnce()
    })

    it('should clean up on port disconnection', () => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })

      onConnectListener(mockPort)
      onDisconnectListener(mockPort)

      expect(mockPort.onMessage.removeListener).toHaveBeenCalledOnce()
    })
  })

  describe('Message Handling', () => {
    beforeEach(() => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })
      onConnectListener(mockPort)
    })

    it('should ignore non-tRPC messages', async () => {
      await onMessageListener({ notTrpc: true }, mockPort)
      expect(mockPort.postMessage).not.toHaveBeenCalled()
    })

    it('should ignore messages without ID', async () => {
      await onMessageListener(
        {
          trpc: { method: 'query', params: { path: 'greeting' } },
        },
        mockPort,
      )
      expect(mockPort.postMessage).not.toHaveBeenCalled()
    })

    it('should handle query procedure', async () => {
      const message = {
        trpc: {
          id: 1,
          jsonrpc: '2.0' as const,
          method: 'query' as const,
          params: {
            path: 'greeting',
            input: { name: 'World' },
          },
        },
      }

      await onMessageListener(message, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 1,
          jsonrpc: '2.0',
          result: {
            type: 'data',
            data: 'Hello World!',
          },
        },
      })
    })

    it('should handle mutation procedure', async () => {
      const message = {
        trpc: {
          id: 2,
          jsonrpc: '2.0' as const,
          method: 'mutation' as const,
          params: {
            path: 'mutation',
            input: { value: 'test' },
          },
        },
      }

      await onMessageListener(message, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 2,
          jsonrpc: '2.0',
          result: {
            type: 'data',
            data: { result: 'TEST' },
          },
        },
      })
    })

    it('should handle procedure errors', async () => {
      const message = {
        trpc: {
          id: 3,
          jsonrpc: '2.0' as const,
          method: 'query' as const,
          params: {
            path: 'error',
            input: null,
          },
        },
      }

      await onMessageListener(message, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 3,
          jsonrpc: '2.0',
          error: expect.objectContaining({
            code: -32603,
            message: 'Test error',
          }),
        },
      })
    })

    it('should handle missing params', async () => {
      const message = {
        trpc: {
          id: 4,
          jsonrpc: '2.0' as const,
          method: 'query' as const,
          // Missing params
        },
      }

      await onMessageListener(message, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 4,
          jsonrpc: '2.0',
          error: expect.objectContaining({
            code: -32600,
            message: 'Missing params in request',
          }),
        },
      })
    })
  })

  describe('Subscription Handling', () => {
    beforeEach(() => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })
      onConnectListener(mockPort)
    })

    it('should handle subscription start', async () => {
      const message = {
        trpc: {
          id: 5,
          jsonrpc: '2.0' as const,
          method: 'subscription' as const,
          params: {
            path: 'count',
            input: { start: 0 },
          },
        },
      }

      await onMessageListener(message, mockPort)

      // Should send started message
      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 5,
          jsonrpc: '2.0',
          result: {
            type: 'started',
          },
        },
      })

      // Wait for subscription data
      await new Promise(resolve => setTimeout(resolve, 150))

      // Should have sent data messages
      expect(mockPort.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          trpc: expect.objectContaining({
            id: 5,
            result: {
              type: 'data',
              data: 0,
            },
          }),
        }),
      )
    })

    it('should handle subscription stop', async () => {
      // Start subscription first
      const startMessage = {
        trpc: {
          id: 6,
          jsonrpc: '2.0' as const,
          method: 'subscription' as const,
          params: {
            path: 'count',
            input: { start: 0 },
          },
        },
      }

      await onMessageListener(startMessage, mockPort)

      // Stop subscription
      const stopMessage = {
        trpc: {
          id: 6,
          jsonrpc: '2.0' as const,
          method: 'subscription.stop' as const,
        },
      }

      await onMessageListener(stopMessage, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 6,
          jsonrpc: '2.0',
          result: {
            type: 'stopped',
          },
        },
      })
    })

    it('should handle subscription with missing params', async () => {
      const message = {
        trpc: {
          id: 7,
          jsonrpc: '2.0' as const,
          method: 'subscription' as const,
          // Missing params
        },
      }

      await onMessageListener(message, mockPort)

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 7,
          jsonrpc: '2.0',
          error: expect.objectContaining({
            code: -32600,
            message: 'Missing params in subscription request',
          }),
        },
      })
    })
  })

  describe('Context Creation', () => {
    it('should call createContext with port', async () => {
      const createContext = vi.fn().mockResolvedValue({ userId: 'test' })

      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
        createContext,
      })

      onConnectListener(mockPort)

      const message = {
        trpc: {
          id: 8,
          jsonrpc: '2.0' as const,
          method: 'query' as const,
          params: {
            path: 'greeting',
            input: { name: 'World' },
          },
        },
      }

      await onMessageListener(message, mockPort)

      expect(createContext).toHaveBeenCalledWith({
        req: mockPort,
        res: undefined,
      })
    })
  })

  describe('Error Handling', () => {
    it('should call onError callback', async () => {
      const onError = vi.fn()

      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
        onError,
      })

      onConnectListener(mockPort)

      const message = {
        trpc: {
          id: 9,
          jsonrpc: '2.0' as const,
          method: 'query' as const,
          params: {
            path: 'error',
            input: null,
          },
        },
      }

      await onMessageListener(message, mockPort)

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(TRPCError),
          type: 'query',
          path: 'error',
        }),
      )
    })
  })

  describe('Port Connection Manager', () => {
    it('should clean up subscriptions on disconnect', async () => {
      createWebExtHandler({
        router: testRouter,
        runtime: mockRuntime,
      })

      onConnectListener(mockPort)

      // Start a subscription
      const message = {
        trpc: {
          id: 10,
          jsonrpc: '2.0' as const,
          method: 'subscription' as const,
          params: {
            path: 'count',
            input: { start: 0 },
          },
        },
      }

      await onMessageListener(message, mockPort)

      // Disconnect port
      onDisconnectListener(mockPort)

      // Subscription should be cleaned up (no more messages)
      const initialCallCount = (mockPort.postMessage as Mock).mock.calls.length

      await new Promise(resolve => setTimeout(resolve, 200))

      // Should not have sent more messages after disconnect
      expect((mockPort.postMessage as Mock).mock.calls.length).toBe(
        initialCallCount,
      )
    })
  })
})
