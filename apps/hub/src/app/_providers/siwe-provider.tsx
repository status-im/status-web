'use client'
import { useRouter } from 'next/navigation'
import { useDisconnect } from 'wagmi'

import { siweClient } from '../_constants/siwe'

interface SiweProviderProps {
  children: React.ReactNode
}

export const SiweProvider = ({ children }: SiweProviderProps) => {
  const router = useRouter()
  const { disconnect } = useDisconnect()

  return (
    <siweClient.Provider
      enabled={true}
      nonceRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
      sessionRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
      signOutOnDisconnect={true} // defaults true
      signOutOnAccountChange={true} // defaults true
      signOutOnNetworkChange={true} // defaults true
      onSignIn={() => {
        router.refresh()
      }}
      onSignOut={() => {
        disconnect()
        router.refresh()
      }}
    >
      {children}
    </siweClient.Provider>
  )
}
