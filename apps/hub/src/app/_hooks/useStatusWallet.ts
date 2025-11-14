'use client'

import { useEffect, useState } from 'react'

interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: any
}

interface EIP6963AnnounceProviderEvent extends Event {
  detail: EIP6963ProviderDetail
}

/**
 * Hook to detect if Status Wallet Connector extension is installed
 *
 * Detection methods:
 * 1. EIP-6963 standard (modern, multi-wallet compatible)
 * 2. Check for isStatus property on ethereum provider
 */
export function useStatusWallet() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkForStatusWallet = () => {
      if (typeof window === 'undefined') {
        setIsChecking(false)
        return false
      }

      const ethereum = (window as any).ethereum

      // Method 1: Check for isStatus property directly
      if (ethereum?.isStatus === true) {
        return true
      }

      // Method 2: Check in providers array (if multiple wallets installed)
      if (Array.isArray(ethereum?.providers)) {
        return ethereum.providers.some((p: any) => p.isStatus === true)
      }

      return false
    }

    // Method 3: Listen for EIP-6963 announcements (most reliable)
    const handleAnnouncement = (event: Event) => {
      const { detail } = event as EIP6963AnnounceProviderEvent

      // Check if this is the Status Wallet by rdns
      if (detail?.info?.rdns === 'app.status') {
        setIsInstalled(true)
        setIsChecking(false)
      }
    }

    // Check immediately
    if (checkForStatusWallet()) {
      setIsInstalled(true)
      setIsChecking(false)
      return
    }

    // Listen for EIP-6963 provider announcements
    window.addEventListener('eip6963:announceProvider', handleAnnouncement)

    // Request providers to announce themselves
    window.dispatchEvent(new Event('eip6963:requestProvider'))

    // Fallback: Check again after a delay (extensions inject asynchronously)
    const timeoutId = setTimeout(() => {
      if (checkForStatusWallet()) {
        setIsInstalled(true)
      }
      setIsChecking(false)
    }, 500)

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnouncement)
      clearTimeout(timeoutId)
    }
  }, [])

  return { isInstalled, isChecking }
}
