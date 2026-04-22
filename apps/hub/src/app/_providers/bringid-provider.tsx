'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import dynamic from 'next/dynamic'
import { useAccount, useWalletClient } from 'wagmi'

import { clientEnv } from '~constants/env.client.mjs'

// BringID SDK — dynamically imported to avoid SSR issues

type BringIDInstance = any

const BringIDModal = dynamic(
  () => import('bringid/react').then(mod => mod.BringIDModal),
  { ssr: false }
)

const BringIDContext = createContext<BringIDInstance | null>(null)

export function useBringID(): BringIDInstance | null {
  return useContext(BringIDContext)
}

function BringIDModalWrapper() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <BringIDModal
      address={address}
      generateSignature={
        walletClient
          ? (msg: string) => walletClient.signMessage({ message: msg })
          : undefined
      }
      highlightColor="#6B43F4"
      customTitles={{
        scoreTitle: 'Karma',
        pointsTitle: 'karma',
        pointsShortTitle: 'karma',
      }}
    />
  )
}

interface BringIDProviderProps {
  children: ReactNode
}

export function BringIDProvider({ children }: BringIDProviderProps) {
  const [instance, setInstance] = useState<BringIDInstance | null>(null)

  useEffect(() => {
    let bringidInstance: BringIDInstance | null = null

    const init = async () => {
      const { BringID } = await import('bringid')
      bringidInstance = new BringID({
        appId: clientEnv.NEXT_PUBLIC_BRINGID_APP_ID,
        chainId: 8453,
      })
      setInstance(bringidInstance)
    }

    init()

    return () => {
      bringidInstance?.destroy()
      setInstance(null)
    }
  }, [])

  return (
    <BringIDContext.Provider value={instance}>
      <BringIDModalWrapper />
      {children}
    </BringIDContext.Provider>
  )
}
