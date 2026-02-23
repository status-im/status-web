import { defineContentScript } from 'wxt/sandbox'

import { ProviderMessage, type ProxyMessage } from '../lib/messages'

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

      console.log('[Status Bridge] received:', message.type, message)

      if (message.type === 'status:provider:disconnect') {
        return
      }

      if (message.type !== 'status:provider') {
        return
      }

      if (!event.ports.length) {
        console.log('[Status Bridge] no ports, dropping')
        return
      }

      try {
        console.log(
          '[Status Bridge] sending to background:',
          message.data.method,
        )
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

        console.log(
          '[Status Bridge] background responded:',
          message.data.method,
          response,
        )
        event.ports[0].postMessage(response satisfies ProxyMessage)
      } catch (error) {
        console.error('[Status Bridge] error:', message.data.method, error)
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
