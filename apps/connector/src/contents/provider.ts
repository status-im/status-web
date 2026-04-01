import {
  announceProvider,
  injectProvider,
  listenForProviderRequests,
  Provider,
  statusIcon,
} from '@status-im/ethereum-provider'

import asMetamaskIcon from '~_encoded/icon-as-metamask'

import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  world: 'MAIN',
  run_at: 'document_start',
  all_frames: false,
}

const provider = new Provider()

const statusInfo = {
  uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
  name: 'Status',
  icon: statusIcon,
  rdns: 'app.status',
}

/**
 * non-standard
 */
function announceAsDefaultProvider() {
  const asDefault = {
    uuid: '00000000-0000-0000-0000-000000000000', // nil
    name: 'Default Browser Wallet',
    icon: statusIcon,
    rdns: '',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info: asDefault, provider }),
    }),
  )

  const asMetaMask = {
    uuid: '767f5a87-3bd2-44a6-8c00-8eed3748e793',
    name: 'MetaMask',
    icon: asMetamaskIcon,
    rdns: 'io.metamask',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info: asMetaMask, provider }),
    }),
  )
}

listenForProviderRequests(provider, statusInfo)
announceProvider(provider, statusInfo)

if (window.localStorage.getItem('status:default-wallet') !== 'false') {
  injectProvider(provider)

  window.addEventListener('eip6963:requestProvider', () => {
    announceAsDefaultProvider()
  })
}
