// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  configureClientSIWE,
  configureServerSideSIWE,
} from 'connectkit-next-siwe'

import { getDefaultWagmiConfig } from './chain'
import { sessionConfig } from './session'

const wagmiConfig = getDefaultWagmiConfig()

/**
 * Server-side SIWE configuration
 * This handles signature verification and session management on the server
 */
export const siweServer = configureServerSideSIWE({
  config: {
    chains: wagmiConfig.chains,
    transports: wagmiConfig.transports,
  },
  session: sessionConfig,
})

/**
 * Client-side SIWE configuration
 * This handles the authentication flow on the client
 */
export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe',
  statement: 'Sign in with Ethereum to access Status Hub.',
})
