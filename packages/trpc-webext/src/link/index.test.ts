import { TRPCClientError } from '@trpc/client'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest'

import { webExtensionLink } from './'

import type { Operation, TRPCClientRuntime } from '@trpc/client'
import type { Runtime } from 'webextension-polyfill'

// Mock runtime
const mockRuntime = {
  connect: vi.fn(),
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

// Mock transformer
const mockTransformer = {
  serialize: vi.fn(data => data),
  deserialize: vi.fn(data => data),
}

describe('webExtensionLink', () => {
  let mockPort: Runtime.Port
  let onMessageListener: (message: unknown) => void
  let onDisconnectListener: (port: Runtime.Port) => void

  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()

    mockPort = createMockPort()

    // Setup runtime.connect to return our mock port
    ;(mockRuntime.connect as Mock).mockReturnValue(mockPort)

    // Capture listeners when they're added
    ;(mockPort.onMessage.addListener as Mock).mockImplementation(listener => {
      onMessageListener = listener
    })
    ;(mockPort.onDisconnect.addListener as Mock).mockImplementation(
      listener => {
        onDisconnectListener = listener
      },
    )

    // Reset transformer mocks
    mockTransformer.serialize.mockImplementation(data => data)
    mockTransformer.deserialize.mockImplementation(data => data)
  })

  afterEach(() => {
    // Trigger disconnect to reset port state
    if (onDisconnectListener && mockPort) {
      onDisconnectListener(mockPort)
    }

    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  describe('Link Creation', () => {
    it('should create a link function', () => {
      const link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })

      expect(typeof link).toBe('function')
    })

    it('should connect to background script', () => {
      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })

      expect(mockRuntime.connect).toHaveBeenCalledOnce()
    })

    it('should setup port listeners', () => {
      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })

      expect(mockPort.onMessage.addListener).toHaveBeenCalledOnce()
      expect(mockPort.onDisconnect.addListener).toHaveBeenCalledOnce()
    })

    it('should setup cleanup interval with default timeout', () => {
      vi.useFakeTimers()

      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })

      expect(vi.getTimerCount()).toBe(1)

      vi.useRealTimers()
    })

    it('should setup cleanup interval with custom timeout', () => {
      vi.useFakeTimers()

      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
        timeoutMS: 5000,
      })

      expect(vi.getTimerCount()).toBe(1)

      vi.useRealTimers()
    })
  })

  describe('Operation Handling', () => {
    let link: ReturnType<typeof webExtensionLink>
    let operationLink: ReturnType<ReturnType<typeof webExtensionLink>>

    beforeEach(() => {
      link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })
      operationLink = link({} as TRPCClientRuntime)
    })

    it('should serialize input before sending', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test.procedure',
        input: { name: 'test' },
        context: {},
        signal: null,
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      // Subscribe to trigger the operation
      observable.subscribe({})

      expect(mockTransformer.serialize).toHaveBeenCalledWith({ name: 'test' })
      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 1,
          jsonrpc: undefined,
          method: 'query',
          params: {
            path: 'test.procedure',
            input: { name: 'test' },
          },
        },
      })
    })

    it('should handle null input', () => {
      const operation: Operation = {
        id: 2,
        type: 'mutation',
        path: 'test.procedure',
        input: null,
        context: {},
        signal: null,
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe({})

      expect(mockTransformer.serialize).toHaveBeenCalledWith(null)
      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 2,
          jsonrpc: undefined,
          method: 'mutation',
          params: {
            path: 'test.procedure',
            input: null,
          },
        },
      })
    })

    it('should handle subscription operations', () => {
      const operation: Operation = {
        id: 3,
        type: 'subscription',
        path: 'test.subscription',
        input: { topic: 'test' },
        context: {},
        signal: null,
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe({})

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 3,
          jsonrpc: undefined,
          method: 'subscription',
          params: {
            path: 'test.subscription',
            input: { topic: 'test' },
          },
        },
      })
    })
  })

  describe('Message Response Handling', () => {
    let link: ReturnType<typeof webExtensionLink>
    let operationLink: ReturnType<ReturnType<typeof webExtensionLink>>

    beforeEach(() => {
      link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })
      operationLink = link({} as TRPCClientRuntime)
    })

    it('should ignore non-tRPC messages', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send non-tRPC message
      onMessageListener({ notTrpc: true })

      expect(observer.next).not.toHaveBeenCalled()
      expect(observer.error).not.toHaveBeenCalled()
    })

    it('should ignore messages without ID', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send message without ID
      onMessageListener({
        trpc: {
          result: { type: 'data', data: 'test' },
        },
      })

      expect(observer.next).not.toHaveBeenCalled()
    })

    it('should ignore messages with wrong ID', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send message with different ID
      onMessageListener({
        trpc: {
          id: 999,
          result: { type: 'data', data: 'test' },
        },
      })

      expect(observer.next).not.toHaveBeenCalled()
    })

    it('should handle successful data response', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send successful response
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'data', data: 'Hello World' },
        },
      })

      expect(mockTransformer.deserialize).toHaveBeenCalledWith('Hello World')
      expect(observer.next).toHaveBeenCalledWith({
        result: {
          type: 'data',
          data: 'Hello World',
        },
      })
      expect(observer.complete).toHaveBeenCalledOnce()
    })

    it('should handle response without explicit type', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send response without type
      onMessageListener({
        trpc: {
          id: 1,
          result: { data: 'Hello World' },
        },
      })

      expect(observer.next).toHaveBeenCalledWith({
        result: {
          type: 'data',
          data: 'Hello World',
        },
      })
    })

    it('should handle error response', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      const errorResponse = {
        code: -32603,
        message: 'Internal error',
        data: { custom: 'error data' },
      }

      // Send error response
      onMessageListener({
        trpc: {
          id: 1,
          error: errorResponse,
        },
      })

      expect(observer.error).toHaveBeenCalledWith(expect.any(TRPCClientError))
      expect(observer.next).not.toHaveBeenCalled()
      expect(observer.complete).not.toHaveBeenCalled()
    })

    it('should deserialize error with json property', () => {
      mockTransformer.deserialize.mockReturnValue({
        message: 'Deserialized error',
      })

      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        error: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send error with json property
      onMessageListener({
        trpc: {
          id: 1,
          error: {
            json: { message: 'Serialized error' },
          },
        },
      })

      expect(mockTransformer.deserialize).toHaveBeenCalledWith({
        json: { message: 'Serialized error' },
      })
    })
  })

  describe('Subscription Handling', () => {
    let link: ReturnType<typeof webExtensionLink>
    let operationLink: ReturnType<ReturnType<typeof webExtensionLink>>

    beforeEach(() => {
      link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })
      operationLink = link({} as TRPCClientRuntime)
    })

    it('should not complete subscription on data', () => {
      const operation: Operation = {
        id: 1,
        type: 'subscription',
        path: 'test.sub',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send subscription data
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'data', data: 'subscription data' },
        },
      })

      expect(observer.next).toHaveBeenCalled()
      expect(observer.complete).not.toHaveBeenCalled()
    })

    it('should complete subscription on stopped', () => {
      const operation: Operation = {
        id: 1,
        type: 'subscription',
        path: 'test.sub',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send stopped message
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'stopped' },
        },
      })

      expect(observer.next).toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()
    })

    it('should complete non-subscription on data', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send data response
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'data', data: 'query result' },
        },
      })

      expect(observer.next).toHaveBeenCalled()
      expect(observer.complete).toHaveBeenCalled()
    })
  })

  describe('Cleanup and Memory Management', () => {
    let link: ReturnType<typeof webExtensionLink>
    let operationLink: ReturnType<ReturnType<typeof webExtensionLink>>

    beforeEach(() => {
      vi.useFakeTimers()
      link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
        timeoutMS: 1000,
      })
      operationLink = link({} as TRPCClientRuntime)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should clean up listener on unsubscribe', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      const subscription = observable.subscribe({})

      // Unsubscribe
      subscription.unsubscribe()

      // Try to send message - should be ignored
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'data', data: 'test' },
        },
      })

      // Observer shouldn't be called since listener was cleaned up
      expect(mockPort.postMessage).toHaveBeenCalledOnce() // Only the initial postMessage
    })

    it('should clean up timed out listeners', () => {
      const operation1: Operation = {
        id: 1,
        type: 'query',
        path: 'test1',
        input: null,
        context: {},
        signal: null,
      }

      const operation2: Operation = {
        id: 2,
        type: 'query',
        path: 'test2',
        input: null,
        context: {},
        signal: null,
      }

      // Create two operations
      const observable1 = operationLink({
        op: operation1,
        next: vi.fn(),
      })

      observable1.subscribe({})

      // Advance time past timeout
      vi.advanceTimersByTime(1500)

      // Create another operation after timeout
      const observable2 = operationLink({
        op: operation2,
        next: vi.fn(),
      })

      const observer2 = {
        next: vi.fn(),
      }

      observable2.subscribe(observer2)

      // Run cleanup interval
      vi.advanceTimersByTime(1000)

      // Response to first operation should be ignored (timed out)
      onMessageListener({
        trpc: {
          id: 1,
          result: { type: 'data', data: 'test1' },
        },
      })

      // Response to second operation should work
      onMessageListener({
        trpc: {
          id: 2,
          result: { type: 'data', data: 'test2' },
        },
      })

      expect(observer2.next).toHaveBeenCalledWith({
        result: {
          type: 'data',
          data: 'test2',
        },
      })
    })
  })

  describe('Port Disconnection', () => {
    beforeEach(() => {
      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })
    })

    it('should clean up listeners on disconnect', () => {
      // Trigger disconnect
      onDisconnectListener(mockPort)

      expect(mockPort.onMessage.removeListener).toHaveBeenCalledOnce()
      expect(mockPort.onDisconnect.removeListener).toHaveBeenCalledOnce()
    })

    it('should reset port to null on disconnect', () => {
      // Create another link after disconnect
      onDisconnectListener(mockPort)

      const newMockPort = createMockPort()
      ;(mockRuntime.connect as Mock).mockReturnValue(newMockPort)

      // Create new link - should reconnect
      webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })

      expect(mockRuntime.connect).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    let link: ReturnType<typeof webExtensionLink>
    let operationLink: ReturnType<ReturnType<typeof webExtensionLink>>

    beforeEach(() => {
      link = webExtensionLink({
        runtime: mockRuntime,
        transformer: mockTransformer,
      })
      operationLink = link({} as TRPCClientRuntime)
    })

    it('should handle transformer that returns undefined', () => {
      mockTransformer.serialize.mockReturnValue(undefined)

      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: { test: 'data' },
        context: {},
        signal: null,
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe({})

      expect(mockPort.postMessage).toHaveBeenCalledWith({
        trpc: {
          id: 1,
          jsonrpc: undefined,
          method: 'query',
          params: {
            path: 'test',
            input: { test: 'data' }, // Falls back to original input
          },
        },
      })
    })

    it('should handle malformed response messages', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send message with result but no data property
      onMessageListener({
        trpc: {
          id: 1,
          result: {}, // Empty result object
        },
      })

      // Should now handle gracefully with default empty object
      expect(mockTransformer.deserialize).toHaveBeenCalledWith({})
      expect(observer.next).toHaveBeenCalledWith({
        result: {
          type: 'data',
          data: {}, // Default empty object after deserialization
        },
      })
      expect(observer.complete).toHaveBeenCalledOnce()
      expect(observer.error).not.toHaveBeenCalled()
    })

    it('should handle string ID', () => {
      const operation: Operation = {
        id: 1,
        type: 'query',
        path: 'test',
        input: null,
        context: {},
        signal: null,
      }

      const observer = {
        next: vi.fn(),
      }

      const observable = operationLink({
        op: operation,
        next: vi.fn(),
      })

      observable.subscribe(observer)

      // Send response with string ID that matches number
      onMessageListener({
        trpc: {
          id: '1', // String instead of number
          result: { type: 'data', data: 'test' },
        },
      })

      // Should be ignored since IDs don't match exactly
      expect(observer.next).not.toHaveBeenCalled()
    })
  })
})
