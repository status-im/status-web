// todo: request QtWebEngine (browser) to be updated instead, or configure target
import 'core-js/proposals/promise-any'

import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import { DAppProvider } from '@usedapp/core'
import { WakuProvider } from './providers/waku/provider'
import { CommunitiesProvider } from './providers/communities/provider'
import { FeaturedVotesProvider } from './providers/featuredVotes/provider'
import { config } from './config'

render(
  <React.StrictMode>
    <WakuProvider peers={config.wakuConfig.peers} clusterId={config.wakuConfig.clusterId}>
      <DAppProvider config={config.usedappConfig}>
        <CommunitiesProvider>
          <FeaturedVotesProvider>
            <App />
          </FeaturedVotesProvider>
        </CommunitiesProvider>
      </DAppProvider>
    </WakuProvider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement,
)
