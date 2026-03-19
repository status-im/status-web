// todo!: keep-alive
//^ 2026-02-13 - Jules: I don't think this is a good idea, or even necessary anymore

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.wxt/wxt.d.ts" />

import { Buffer } from 'buffer'
import { defineBackground } from 'wxt/sandbox'

// import { browser as wxtBrowser } from 'wxt/browser'
import { createAPI } from '../data/api'
import { encoder } from '../data/encoder'
import { INACTIVITY_ALARM_NAME, lock } from '../data/session'
import { getWalletCore } from '../data/wallet'
import { RpcMessage } from '../lib/messages'
import { handleRpcRequest } from '../lib/rpc-handler'

export default defineBackground({
  type: 'module',
  persistent: true,
  // note: The background's main() function return a promise, but it must be synchronous
  // main: async function main() {
  main: function main() {
    // Polyfill
    globalThis.Buffer = Buffer

    // Encoder
    globalThis.encoder = encoder

    // Wallet
    getWalletCore().then(walletCore => {
      globalThis.wallet = walletCore
    })

    // API
    createAPI().then(api => {
      globalThis.api = api
    })

    chrome.alarms.onAlarm.addListener(alarm => {
      if (alarm.name === INACTIVITY_ALARM_NAME) lock()
    })

    chrome.runtime.onInstalled.addListener(() => {
      const extensionUrl = chrome.runtime.getURL('page.html#/onboarding')
      chrome.tabs.create({ url: extensionUrl })
    })

    chrome.action.onClicked.addListener(async () => {
      const extensionUrl = chrome.runtime.getURL('page.html#/onboarding')
      const extensionBaseUrl = chrome.runtime.getURL('page.html')

      const allTabs = await chrome.tabs.query({ currentWindow: true })
      const existingTabs = allTabs.filter(tab =>
        tab.url?.startsWith(extensionBaseUrl),
      )

      if (existingTabs.length > 0 && existingTabs[0]) {
        const tab = existingTabs[0]
        await chrome.tabs.update(tab.id!, { active: true })
      } else {
        await chrome.tabs.create({ url: extensionUrl })
      }
    })

    chrome.runtime.onInstalled.addListener(details => {
      if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL('https://forms.gle/WrZD2uZV11BEEe9h9')
      }
    })

    // dApp RPC message handler
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== 'status:rpc') {
        return false
      }

      const parsed = RpcMessage.safeParse(message)
      if (!parsed.success) {
        sendResponse({
          type: 'status:proxy:error',
          error: { code: -32600, message: 'Invalid Request' },
        })
        return true
      }

      const { method, params, origin, title, favicon } = parsed.data.data

      handleRpcRequest(method, params, origin, { title, favicon })
        .then(result => {
          sendResponse({ type: 'status:proxy:success', data: result })
        })
        .catch(error => {
          sendResponse({
            type: 'status:proxy:error',
            error: {
              code:
                error && typeof error === 'object' && 'code' in error
                  ? error.code
                  : -32603,
              message:
                error instanceof Error
                  ? error.message
                  : error && typeof error === 'object' && 'message' in error
                    ? error.message
                    : 'Internal error',
            },
          })
        })

      return true
    })
  },
})
