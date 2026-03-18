import { createContext, useCallback, useContext, useMemo } from 'react'

import { type Address, createPublicClient, type Hex, http } from 'viem'
import { mainnet } from 'viem/chains'
import { formatEther } from 'viem/utils'

import { apiClient } from './api-client'
import { usePassword } from './password-context'
import { useWallet } from './wallet-context'

type SignerContextValue = {
  address: Address | undefined
  isUnlocked: boolean
  unlock: () => Promise<boolean>
  lock: () => void
  signAndSendTransaction: (tx: {
    to: Address
    value: bigint
    data?: Hex
    gas?: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
  }) => Promise<Hex>
  signMessage: (message: Hex) => Promise<Hex>
  signTypedData: (typedData: string) => Promise<Hex>
  requestUnlock: () => Promise<boolean>
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
  const { currentWallet } = useWallet()
  const { hasActiveSession, requestPassword, clearSession } = usePassword()

  const address = useMemo(() => {
    return currentWallet?.activeAccounts[0]?.address as Address | undefined
  }, [currentWallet])

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

  const parseInsufficientFundsError = useCallback(
    (error: unknown): Error | null => {
      const errorObj =
        typeof error === 'object' && error !== null && 'message' in error
          ? error
          : null
      const errorMessage =
        errorObj && typeof errorObj.message === 'string'
          ? errorObj.message
          : typeof error === 'string'
            ? error
            : null
      if (!errorMessage) return null
      const match = errorMessage.match(
        /insufficient funds for gas \* price \+ value: have (\d+) want (\d+)/,
      )
      if (!match) return null
      const haveWei = BigInt(match[1])
      const wantWei = BigInt(match[2])
      const haveEth = formatEther(haveWei)
      const wantEth = formatEther(wantWei)
      const shortfallEth = formatEther(wantWei - haveWei)
      return new Error(
        `Insufficient funds for gas. Have ${haveEth} ETH, need up to ${wantEth} ETH (max fee). Short ${shortfallEth} ETH.`,
      )
    },
    [],
  )

  const handleTransactionError = useCallback(
    (error: unknown, context: string): never => {
      console.error(`${context} error:`, error)
      const parsedError = parseInsufficientFundsError(error)
      if (parsedError) throw parsedError
      throw new Error(
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : String(error),
      )
    },
    [parseInsufficientFundsError],
  )

  const signAndSendTransaction = useCallback(
    async (tx: {
      to: Address
      value: bigint
      data?: Hex
      gas?: bigint
      maxFeePerGas?: bigint
      maxPriorityFeePerGas?: bigint
    }): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      await ensureUnlocked()

      let maxFeePerGas = tx.maxFeePerGas?.toString(16)
      let maxPriorityFeePerGas = tx.maxPriorityFeePerGas?.toString(16)
      let gasLimit = tx.gas?.toString(16)

      if (!maxFeePerGas || !maxPriorityFeePerGas || !gasLimit) {
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http(),
        })

        if (!maxFeePerGas || !maxPriorityFeePerGas) {
          const [block, priorityFee] = await Promise.all([
            publicClient.getBlock({ blockTag: 'latest' }),
            publicClient.request({
              method: 'eth_maxPriorityFeePerGas',
            }),
          ])

          const baseFee = block.baseFeePerGas || 0n
          const priorityFeeBigInt = BigInt(priorityFee as string)
          maxPriorityFeePerGas = priorityFeeBigInt.toString(16)
          // maxFeePerGas calculation - https://www.blocknative.com/blog/eip-1559-fees
          maxFeePerGas = (baseFee * 2n + priorityFeeBigInt).toString(16)
        }

        if (!gasLimit) {
          const estimatedGas = await publicClient.estimateGas({
            account: address,
            to: tx.to,
            value: tx.value,
            data: tx.data,
          })
          gasLimit = (estimatedGas + estimatedGas / 10n).toString(16)
        }
      }

      const extractTxHash = (id: unknown): string | undefined => {
        if (typeof id === 'string') {
          return id
        }
        if (id && typeof id === 'object') {
          const obj = id as Record<string, unknown>
          if ('result' in obj && typeof obj.result === 'string') {
            return obj.result
          }
          if ('txid' in obj) {
            return obj.txid as string
          }
        }
        return undefined
      }

      if (tx.data) {
        const ERC20_TRANSFER_SIGNATURE = '0xa9059cbb'
        const isErc20Transfer = tx.data
          .toLowerCase()
          .startsWith(ERC20_TRANSFER_SIGNATURE)

        if (isErc20Transfer) {
          const result =
            await apiClient.wallet.account.ethereum.sendErc20.mutate({
              walletId: currentWallet.id,
              fromAddress: address,
              toAddress: tx.to,
              gasLimit,
              maxFeePerGas,
              maxInclusionFeePerGas: maxPriorityFeePerGas,
              data: tx.data,
            })

          if (result.id.txid?.error) {
            handleTransactionError(result.id.txid.error, 'ERC20 transfer')
          }

          const txHash = extractTxHash(result.id.txid)
          if (!txHash) throw new Error('Transaction failed')
          return txHash as Hex
        }

        const valueHex = tx.value.toString(16)
        const result =
          await apiClient.wallet.account.ethereum.sendContractCall.mutate({
            walletId: currentWallet.id,
            fromAddress: address,
            toAddress: tx.to,
            gasLimit,
            maxFeePerGas,
            maxInclusionFeePerGas: maxPriorityFeePerGas,
            data: tx.data,
            value: valueHex,
          })

        if (result.id.txid?.error) {
          handleTransactionError(result.id.txid.error, 'Contract call')
        }

        const txHash = extractTxHash(result.id.txid)
        if (!txHash) throw new Error('Transaction failed')
        return txHash as Hex
      }

      const amountHex = tx.value.toString(16)
      const result = await apiClient.wallet.account.ethereum.send.mutate({
        walletId: currentWallet.id,
        fromAddress: address,
        toAddress: tx.to,
        amount: amountHex,
        gasLimit,
        maxFeePerGas,
        maxInclusionFeePerGas: maxPriorityFeePerGas,
      })

      if (result.id.txid?.error) {
        handleTransactionError(result.id.txid.error, 'Send transaction')
      }

      const txHash = extractTxHash(result.id.txid)
      if (!txHash) throw new Error('Transaction failed')
      return txHash as Hex
    },
    [currentWallet?.id, address, ensureUnlocked, handleTransactionError],
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
