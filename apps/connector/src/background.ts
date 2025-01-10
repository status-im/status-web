import { Storage } from '@plasmohq/storage'
import iconConnected from 'url:../assets/icon-connected.png' // eslint-disable-line import/no-unresolved
import iconDisconnected from 'url:../assets/icon-disconnected.png' // eslint-disable-line import/no-unresolved

import { config } from '~config'

import type { ServiceWorkerMessage } from '~messages/service-worker-message'

/**
 * Check if the WebSocket server is reachable
 */
const storage = new Storage()

const DESKTOP_ENDPOINT_URL = config.desktop.rpc.url.replace('ws:', 'http:')
const CHECK_INTERVAL_MS = 5000

const isWebSocketServerReachable = async (): Promise<boolean> => {
  try {
    await fetch(DESKTOP_ENDPOINT_URL, { method: 'HEAD' })
    return true
  } catch {
    return false
  }
}

async function checkDesktopStatus() {
  const isServerReachable = await isWebSocketServerReachable()
  storage.set('status:desktop:running', isServerReachable)
  chrome.action.setIcon({
    path: isServerReachable ? iconConnected : iconDisconnected,
  })
}

checkDesktopStatus()
setInterval(checkDesktopStatus, CHECK_INTERVAL_MS)

/**
 * Handler for opening popup
 */
chrome.action.onClicked.addListener(async tab => {
  if (!tab.id || !tab.url) {
    return
  }

  chrome.tabs.sendMessage(tab.id, {
    type: 'status:icon:clicked',
  } satisfies ServiceWorkerMessage)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.method === 'toggleLogging') {
    storage.set('status:logging', message.params[0])

    sendResponse(message.params[0])
  }
})
