import { ProxyMessage } from '~messages/proxy-message'

import type { RequestArguments } from '~lib/request-arguments'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
  world: 'MAIN',
  run_at: 'document_start',
  all_frames: false,
}

Object.defineProperties(window, {
  connector: {
    value: {
      enableLogging: (value = true) => {
        // shared web storage with host page and content scripts (Web Storage API)
        window.localStorage.setItem('status:logging', JSON.stringify(value))

        // service worker extension storage (extension storage API)
        request({
          method: 'toggleLogging',
          params: [value],
        })

        return value
      },
    },
    configurable: false,
    writable: false,
  },
})

async function request(args: RequestArguments) {
  const { method, params } = args

  const messageChannel = new MessageChannel()

  return new Promise((resolve, reject) => {
    messageChannel.port1.onmessage = ({ data }) => {
      try {
        const message = ProxyMessage.parse(data)

        messageChannel.port1.close()

        switch (message.type) {
          case 'status:proxy:success': {
            resolve(message.data)

            return
          }
          case 'status:proxy:error': {
            reject(new Error(message.error.message))

            return
          }
        }
      } catch {
        return
      }
    }

    const mainMessage = {
      type: 'status:main',
      data: {
        method,
        params,
      },
    }

    window.postMessage(mainMessage, window.origin, [messageChannel.port2])
  })
}
