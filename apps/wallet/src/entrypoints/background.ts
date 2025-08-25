// todo!: keep-alive

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.wxt/wxt.d.ts" />

import { Buffer } from 'buffer'
import { defineBackground } from 'wxt/sandbox'

// import { browser as wxtBrowser } from 'wxt/browser'
import { createAPI } from '../data/api'
import { encoder } from '../data/encoder'
import { getKeystore } from '../data/keystore'
import { getWalletCore } from '../data/wallet'

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

    // Storage
    getKeystore().then(keystore => {
      globalThis.storage = keystore
    })

    // Wallet
    getWalletCore().then(walletCore => {
      globalThis.wallet = walletCore
    })

    // API
    createAPI().then(api => {
      globalThis.api = api
    })

    chrome.runtime.onInstalled.addListener(() => {
      const extensionUrl = chrome.runtime.getURL('page.html#/onboarding')
      chrome.tabs.create({ url: extensionUrl })
    })

    chrome.action.onClicked.addListener(async () => {
      const extensionUrl = chrome.runtime.getURL('page.html#/onboarding')
      await chrome.tabs.create({ url: extensionUrl })
    })

    chrome.runtime.onInstalled.addListener(details => {
      if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL('https://forms.gle/WrZD2uZV11BEEe9h9')
      }
    })

    // debugger
  },
})
