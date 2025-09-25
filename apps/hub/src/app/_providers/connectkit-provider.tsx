'use client'

import { ConnectKitProvider as ConnectKit } from 'connectkit'

type ConnectKitProviderProps = {
  children: React.ReactNode
}

export function ConnectKitProvider({ children }: ConnectKitProviderProps) {
  return (
    <ConnectKit
      theme="auto"
      mode="light"
      onConnect={({ address }) => {
        console.log('onConnect', address)
      }}
      onDisconnect={() => {
        console.log('onDisconnect')
      }}
    >
      {children}
    </ConnectKit>
  )
}
