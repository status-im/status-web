import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import {
  HardwareSignCancelledError,
  type HardwareSignRequest,
  HardwareSignScreen,
} from '@status-im/wallet/components'
import { isEthereumTransactionHash } from '@status-im/wallet/utils'
import { type Address, type Hex, hexToBytes } from 'viem'

import { useGasFees } from '../hooks/use-gas-fees'
import { checkHardwareSignature } from '../lib/hardware-signature'
import {
  buildAndSendTransaction,
  needsFeeEstimate,
  parseInsufficientFundsError,
  resolveFeeParams,
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

type PendingHardwareSign = {
  request: HardwareSignRequest
  address: string
  sourceFingerprint: number | undefined
  origin: string
  resolve: (signature: string) => void
  reject: (error: Error) => void
}

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
  const [hardwareSignRequest, setHardwareSignRequest] =
    useState<PendingHardwareSign | null>(null)
  const hardwareSignPending = useRef(false)

  const address = useMemo(() => {
    return currentAccount?.address as Address | undefined
  }, [currentAccount])

  const { fetchGasFees } = useGasFees({ address })

  const accountName = useMemo(() => {
    // TODO: Use currently selected account name instead when multi-account support is implemented.
    return currentWallet?.name ?? DEFAULT_ACCOUNT_NAME
  }, [currentWallet])

  const isHardwareWallet = currentWallet?.type === 'hardware-qr'

  const requestHardwareSign = useCallback(
    (params: {
      request: HardwareSignRequest
      address: string
      sourceFingerprint: number | undefined
      origin: string
    }): Promise<string> => {
      // One overlay at a time; replacing it would leave the first caller hanging.
      if (hardwareSignPending.current) {
        return Promise.reject(
          new Error('Another hardware wallet signature is in progress'),
        )
      }
      hardwareSignPending.current = true
      return new Promise<string>((resolve, reject) => {
        setHardwareSignRequest({ ...params, resolve, reject })
      }).finally(() => {
        hardwareSignPending.current = false
      })
    },
    [],
  )

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

      if (isHardwareWallet) {
        const fees = needsFeeEstimate(tx)
          ? await fetchGasFees({
              from: address,
              to: tx.to,
              value: tx.value.toString(16),
              data: tx.data,
            })
          : null
        const { gasLimit, maxFeePerGas, maxPriorityFeePerGas } =
          resolveFeeParams(tx, fees)
        const { serializedUnsignedTx, chainId, nonceReservationId } =
          await apiClient.wallet.account.ethereum.buildUnsignedTransaction.mutate(
            {
              walletId: currentWallet.id,
              fromAddress: address,
              toAddress: tx.to,
              value: tx.value.toString(16),
              data: tx.data,
              gasLimit,
              maxFeePerGas,
              maxInclusionFeePerGas: maxPriorityFeePerGas,
            },
          )
        let signature: string
        try {
          signature = await requestHardwareSign({
            request: {
              kind: 'transaction',
              serializedTx: hexToBytes(serializedUnsignedTx),
              chainId,
            },
            address,
            sourceFingerprint: currentWallet.hardware?.sourceFingerprint,
            origin: 'Status Wallet',
          })
        } catch (error) {
          // The held nonce lapses on its own if this release does not arrive.
          void apiClient.wallet.account.ethereum.releaseNonceReservation
            .mutate({ nonceReservationId })
            .catch(() => {})
          throw error
        }
        const { txid } =
          await apiClient.wallet.account.ethereum.broadcastSignedTransaction
            .mutate({
              serializedUnsignedTx,
              signature,
              fromAddress: address,
              nonceReservationId,
            })
            .catch((error: unknown) => {
              throw parseInsufficientFundsError(error) ?? error
            })
        if (!isEthereumTransactionHash(txid)) {
          throw new Error('Transaction failed')
        }
        return txid as Hex
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
    [
      currentWallet?.id,
      currentWallet?.hardware?.sourceFingerprint,
      address,
      ensureUnlocked,
      fetchGasFees,
      isHardwareWallet,
      requestHardwareSign,
    ],
  )

  const signMessage = useCallback(
    async (message: Hex): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      if (isHardwareWallet) {
        const signature = await requestHardwareSign({
          request: { kind: 'personalMessage', message },
          address,
          sourceFingerprint: currentWallet.hardware?.sourceFingerprint,
          origin: 'Status Wallet',
        })
        return signature as Hex
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
    [
      currentWallet?.id,
      currentWallet?.hardware?.sourceFingerprint,
      address,
      ensureUnlocked,
      isHardwareWallet,
      requestHardwareSign,
    ],
  )

  const signTypedData = useCallback(
    async (typedData: string): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      if (isHardwareWallet) {
        const signature = await requestHardwareSign({
          request: { kind: 'typedData', typedData },
          address,
          sourceFingerprint: currentWallet.hardware?.sourceFingerprint,
          origin: 'Status Wallet',
        })
        return signature as Hex
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
    [
      currentWallet?.id,
      currentWallet?.hardware?.sourceFingerprint,
      address,
      ensureUnlocked,
      isHardwareWallet,
      requestHardwareSign,
    ],
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

  const handleHardwareSignature = useCallback(
    (signature: string) => {
      if (!hardwareSignRequest) return
      hardwareSignRequest.resolve(signature)
      setHardwareSignRequest(null)
    },
    [hardwareSignRequest],
  )

  const handleHardwareCancel = useCallback(() => {
    if (!hardwareSignRequest) return
    hardwareSignRequest.reject(new HardwareSignCancelledError())
    setHardwareSignRequest(null)
  }, [hardwareSignRequest])

  return (
    <SignerContext.Provider value={value}>
      {children}
      {/* A Radix dialog, so it stacks above open modals like the exchange drawer instead of closing them. */}
      {hardwareSignRequest && (
        <Dialog.Root
          open
          onOpenChange={open => {
            if (!open) handleHardwareCancel()
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(9, 16, 28, 0.6)' }}
            >
              <Dialog.Content
                aria-describedby={undefined}
                data-customisation="blue"
                onInteractOutside={event => event.preventDefault()}
                className="flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-16 bg-white-100 p-4"
              >
                <Dialog.Title className="sr-only">
                  Sign with hardware wallet
                </Dialog.Title>
                <HardwareSignScreen
                  request={hardwareSignRequest.request}
                  address={hardwareSignRequest.address}
                  sourceFingerprint={hardwareSignRequest.sourceFingerprint}
                  origin={hardwareSignRequest.origin}
                  checkSignature={signature =>
                    checkHardwareSignature(
                      hardwareSignRequest.request,
                      hardwareSignRequest.address,
                      signature,
                    )
                  }
                  onSignature={handleHardwareSignature}
                  onCancel={handleHardwareCancel}
                />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </SignerContext.Provider>
  )
}
