'use client'

import { useMemo, useRef } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { statusConnector } from '../lib/status-connector'
import { useWalletSigner } from './signer-context'

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}

function WagmiConfigProvider({ children }: Props) {
  const { address, signAndSendTransaction, signMessage, signTypedData } =
    useWalletSigner()
  const addressRef = useRef(address)
  const signAndSendTransactionRef = useRef(signAndSendTransaction)
  const signMessageRef = useRef(signMessage)
  const signTypedDataRef = useRef(signTypedData)

  addressRef.current = address
  signAndSendTransactionRef.current = signAndSendTransaction
  signMessageRef.current = signMessage
  signTypedDataRef.current = signTypedData

  const config = useMemo(() => {
    return createConfig({
      chains: [mainnet],
      connectors: [
        statusConnector({
          getAddress: () => addressRef.current,
          signAndSendTransaction: async tx => {
            return signAndSendTransactionRef.current(tx)
          },
          signMessage: async message => {
            return signMessageRef.current(message)
          },
          signTypedData: async typedData => {
            return signTypedDataRef.current(typedData)
          },
        }),
      ],
      transports: {
        [mainnet.id]: http(),
      },
      ssr: false,
    })
  }, [])

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export { WagmiConfigProvider }
