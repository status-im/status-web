import {
  logger,
  ProviderMessage,
  type ProxyMessage,
} from '@status-im/ethereum-provider'
import { defineContentScript } from 'wxt/sandbox'

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',

  main(ctx) {
    function getFavicon(): string {
      const link = document.querySelector<HTMLLinkElement>(
        'link[rel="icon"], link[rel="shortcut icon"]',
      )
      if (link?.href) return link.href
      return `${window.location.origin}/favicon.ico`
    }

    const handleProviderMessage = async (event: MessageEvent) => {
      if (event.origin !== window.origin) {
        return
      }

      let message: ProviderMessage
      try {
        message = ProviderMessage.parse(event.data)
      } catch {
        return
      }

      if (message.type === 'status:provider:disconnect') {
        chrome.runtime.sendMessage({
          type: 'status:disconnect',
          data: { origin: window.location.origin },
        })
        return
      }

      if (message.type !== 'status:provider') {
        return
      }

      if (!event.ports.length) {
        return
      }

      try {
        const response = await chrome.runtime.sendMessage({
          type: 'status:rpc',
          data: {
            method: message.data.method,
            params: message.data.params,
            origin: window.location.origin,
            title: document.title,
            favicon: getFavicon(),
          },
        })

        event.ports[0].postMessage(response satisfies ProxyMessage)
      } catch (error) {
        logger.error('[Status Bridge] error:', message.data.method, error)
        event.ports[0].postMessage({
          type: 'status:proxy:error',
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : 'Internal error',
          },
        } satisfies ProxyMessage)
      }
    }

    ctx.addEventListener(window, 'message', handleProviderMessage)
  },
})
