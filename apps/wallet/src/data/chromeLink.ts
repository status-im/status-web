import { chromeLink } from 'trpc-chrome/link'

import type { TRPCLink } from '@trpc/client'
import type { AnyRouter } from '@trpc/server'
import type { ChromeLinkOptions } from 'trpc-chrome/link'

const MAX_RETRIES = 3
const RETRY_DELAY = 100

export function chromeLinkWithRetries<TRouter extends AnyRouter>(
  options: Omit<ChromeLinkOptions, 'port'> = {},
): TRPCLink<TRouter> {
  const { ...chromeLinkOptions } = options

  let port: chrome.runtime.Port | null = null
  let currentLink: TRPCLink<TRouter> | null = null

  const createPort = () => {
    if (port) {
      try {
        port.disconnect()
        // eslint-disable-next-line no-empty
      } catch {}
    }

    port = chrome.runtime.connect()
    port.onDisconnect.addListener(() => {
      port = null
      currentLink = null
    })

    currentLink = chromeLink({ ...chromeLinkOptions, port })

    return port
  }

  const checkConnection = () => {
    if (!port || !currentLink) {
      createPort()
    } else {
      try {
        port.postMessage({ type: 'ping' })
        if (chrome.runtime.lastError) {
          createPort()
        }
      } catch {
        createPort()
      }
    }
  }

  // @ts-expect-error - Custom observable missing pipe method but functionally compatible
  return runtime => {
    return ctx => {
      let retryCount = 0

      const retryOperation = async (): Promise<unknown> => {
        try {
          checkConnection()

          if (!currentLink) {
            throw new Error('Failed to establish connection')
          }

          const result = await new Promise((resolve, reject) => {
            currentLink!(runtime)(ctx).subscribe({
              next(value) {
                resolve(value)
              },
              error(err) {
                reject(err)
              },
            })
          })

          return result
        } catch (error) {
          const isConnectionError =
            error instanceof Error &&
            (error.message.includes('Attempting to use a disconnected port') ||
              error.message.includes('Could not establish connection') ||
              error.message.includes('Extension context invalidated') ||
              chrome.runtime.lastError !== undefined)

          if (isConnectionError && retryCount < MAX_RETRIES) {
            retryCount++

            port = null
            currentLink = null
            await new Promise(resolve =>
              setTimeout(resolve, RETRY_DELAY * retryCount),
            )

            return retryOperation()
          }

          throw error
        }
      }

      return {
        subscribe(observer) {
          retryOperation()
            .then(value => {
              observer.next?.(
                value as Parameters<NonNullable<typeof observer.next>>[0],
              )
              observer.complete?.()
            })
            .catch(err => {
              observer.error?.(err)
            })

          return {
            unsubscribe: () => {},
          }
        },
      }
    }
  }
}
