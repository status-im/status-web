import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { type Address, type Hex } from 'viem'

import { useGasFees } from '../hooks/use-gas-fees'
import {
  buildAndSendTransaction,
  type TransactionRequest,
} from '../lib/send-transaction'
import { apiClient } from './api-client'
import { usePassword } from './password-context'
import { useWallet } from './wallet-context'

type SignerContextValue = {
  address: Address | undefined
  isUnlocked: boolean
  unlock: () => Promise<boolean>
  lock: () => void
  signAndSendTransaction: (tx: TransactionRequest) => Promise<Hex>
  signMessage: (message: Hex) => Promise<Hex>
  signTypedData: (typedData: string) => Promise<Hex>
  requestUnlock: () => Promise<boolean>
}

const DEFAULT_ACCOUNT_NAME = 'Account 1'

const SignerContext = createContext<SignerContextValue | undefined>(undefined)

export function useWalletSigner() {
  const context = useContext(SignerContext)
  if (!context) {
    throw new Error('useWalletSigner must be used within SignerProvider')
  }
  return context
}

export function SignerProvider({ children }: { children: React.ReactNode }) {
  const { currentWallet, currentAccount } = useWallet()
  const { hasActiveSession, requestPassword, clearSession } = usePassword()

  const address = useMemo(() => {
    return currentAccount?.address as Address | undefined
  }, [currentAccount])

  const { fetchGasFees } = useGasFees({ address })

  const accountName = useMemo(() => {
    // TODO: Use currently selected account name instead when multi-account support is implemented.
    return currentWallet?.name ?? DEFAULT_ACCOUNT_NAME
  }, [currentWallet])

  useEffect(() => {
    if (address) {
      chrome.storage.session.set({
        dappAddress: address,
        dappAccountName: accountName,
      })
    } else {
      chrome.storage.session.remove(['dappAddress', 'dappAccountName'])
    }
  }, [address, accountName])

  useEffect(() => {
    if (currentWallet?.id) {
      chrome.storage.session.set({ dappWalletId: currentWallet.id })
    } else {
      chrome.storage.session.remove('dappWalletId')
    }
  }, [currentWallet?.id])

  const unlock = useCallback(async (): Promise<boolean> => {
    if (!currentWallet?.id) return false
    const isUnlocked = await requestPassword({
      title: 'Enter password',
      description: 'To allow for signing transactions',
    })
    return isUnlocked
  }, [currentWallet?.id, requestPassword])

  const lock = useCallback(() => {
    clearSession()
  }, [clearSession])

  const requestUnlock = useCallback(async (): Promise<boolean> => {
    if (hasActiveSession) return true
    return requestPassword()
  }, [hasActiveSession, requestPassword])

  const ensureUnlocked = useCallback(async (): Promise<void> => {
    if (hasActiveSession) return
    const isUnlocked = await requestPassword()
    if (!isUnlocked) throw new Error('Wallet not unlocked')
  }, [hasActiveSession, requestPassword])

  const signAndSendTransaction = useCallback(
    async (tx: TransactionRequest): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      await ensureUnlocked()

      return await buildAndSendTransaction(
        tx,
        { walletId: currentWallet.id, address, fetchGasFees },
        {
          send: input => apiClient.wallet.account.ethereum.send.mutate(input),
          sendErc20: input =>
            apiClient.wallet.account.ethereum.sendErc20.mutate(input),
          sendContractCall: input =>
            apiClient.wallet.account.ethereum.sendContractCall.mutate(input),
        },
      )
    },
    [currentWallet?.id, address, ensureUnlocked, fetchGasFees],
  )

  const signMessage = useCallback(
    async (message: Hex): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      await ensureUnlocked()

      const result = await apiClient.wallet.account.ethereum.signMessage.mutate(
        {
          walletId: currentWallet.id,
          fromAddress: address,
          message,
        },
      )

      return result.signature as Hex
    },
    [currentWallet?.id, address, ensureUnlocked],
  )

  const signTypedData = useCallback(
    async (typedData: string): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      await ensureUnlocked()

      const parsed = JSON.parse(typedData)

      const result =
        await apiClient.wallet.account.ethereum.signTypedData.mutate({
          walletId: currentWallet.id,
          fromAddress: address,
          domain: parsed.domain,
          types: parsed.types,
          primaryType: parsed.primaryType,
          message: parsed.message,
        })

      return result.signature as Hex
    },
    [currentWallet?.id, address, ensureUnlocked],
  )

  const value: SignerContextValue = useMemo(
    () => ({
      address,
      isUnlocked: hasActiveSession,
      unlock,
      lock,
      signAndSendTransaction,
      signMessage,
      signTypedData,
      requestUnlock,
    }),
    [
      address,
      hasActiveSession,
      unlock,
      lock,
      signAndSendTransaction,
      signMessage,
      signTypedData,
      requestUnlock,
    ],
  )

  return (
    <SignerContext.Provider value={value}>{children}</SignerContext.Provider>
  )
}
