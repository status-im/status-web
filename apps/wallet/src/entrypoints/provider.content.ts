import {
  announceProvider,
  injectProvider,
  listenForProviderRequests,
  Provider,
  statusIcon,
} from '@status-im/ethereum-provider'
import { defineContentScript } from 'wxt/sandbox'

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  world: 'MAIN',

  main() {
    const provider = new Provider()

    const info = {
      uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
      name: 'Status',
      icon: statusIcon,
      rdns: 'app.status',
    }

    listenForProviderRequests(provider, info)
    announceProvider(provider, info)
    injectProvider(provider)
  },
})
