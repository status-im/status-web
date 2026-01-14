import { createContext, useCallback, useContext, useMemo } from 'react'

import { type Address, createPublicClient, type Hex, http } from 'viem'
import { mainnet } from 'viem/chains'

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
  requestUnlock: () => Promise<string | null>
  setUnlockHandler: (handler: () => Promise<string | null>) => void
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
  const {
    hasActiveSession,
    getPassword,
    requestPassword,
    establishSession,
    clearSession,
  } = usePassword()

  const address = useMemo(() => {
    return currentWallet?.activeAccounts[0]?.address as Address | undefined
  }, [currentWallet])

  const unlock = useCallback(async (): Promise<boolean> => {
    if (!currentWallet?.id) return false

    let password: string | null = null

    if (hasActiveSession) {
      password = getPassword()
      if (!password) {
        return false
      }
      try {
        await apiClient.wallet.get.query({
          walletId: currentWallet.id,
          password,
        })
        await establishSession(password)
        return true
      } catch {
        return false
      }
    }

    password = await requestPassword({
      title: 'Enter password',
      description: 'To allow for signing transactions',
    })

    return password !== null
  }, [
    currentWallet?.id,
    hasActiveSession,
    getPassword,
    requestPassword,
    establishSession,
  ])

  const lock = useCallback(() => {
    clearSession()
  }, [clearSession])

  const requestUnlock = useCallback(async (): Promise<string | null> => {
    if (hasActiveSession) {
      return getPassword()
    }
    return await requestPassword()
  }, [hasActiveSession, getPassword, requestPassword])

  const ensurePassword = useCallback(async (): Promise<string> => {
    if (hasActiveSession) {
      const password = getPassword()
      if (password) {
        return password
      }
    }
    const password = await requestPassword()
    if (!password) {
      throw new Error('Wallet not unlocked')
    }
    return password
  }, [hasActiveSession, getPassword, requestPassword])

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

      const password = await ensurePassword()

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
              password,
              fromAddress: address,
              toAddress: tx.to,
              gasLimit,
              maxFeePerGas,
              maxInclusionFeePerGas: maxPriorityFeePerGas,
              data: tx.data,
            })

          const txHash = extractTxHash(result.id.txid)
          if (!txHash) throw new Error('Transaction failed')
          return txHash as Hex
        }

        const valueHex = tx.value.toString(16)
        const result =
          await apiClient.wallet.account.ethereum.sendContractCall.mutate({
            walletId: currentWallet.id,
            password,
            fromAddress: address,
            toAddress: tx.to,
            gasLimit,
            maxFeePerGas,
            maxInclusionFeePerGas: maxPriorityFeePerGas,
            data: tx.data,
            value: valueHex,
          })

        if (result.id.txid?.error) {
          console.error('Contract call error:', result.id.txid.error)
          throw new Error(result.id.txid.error)
        }

        const txHash = extractTxHash(result.id.txid)
        if (!txHash) throw new Error('Transaction failed')
        return txHash as Hex
      }

      const amountHex = tx.value.toString(16)
      const result = await apiClient.wallet.account.ethereum.send.mutate({
        walletId: currentWallet.id,
        password,
        fromAddress: address,
        toAddress: tx.to,
        amount: amountHex,
        gasLimit,
        maxFeePerGas,
        maxInclusionFeePerGas: maxPriorityFeePerGas,
      })

      const txHash = extractTxHash(result.id.txid)
      if (!txHash) throw new Error('Transaction failed')
      return txHash as Hex
    },
    [currentWallet?.id, address, ensurePassword],
  )

  const signMessage = useCallback(
    async (message: Hex): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      const password = await ensurePassword()

      const result = await apiClient.wallet.account.ethereum.signMessage.mutate(
        {
          walletId: currentWallet.id,
          password,
          fromAddress: address,
          message,
        },
      )

      return result.signature as Hex
    },
    [currentWallet?.id, address, ensurePassword],
  )

  const signTypedData = useCallback(
    async (typedData: string): Promise<Hex> => {
      if (!currentWallet?.id || !address) {
        throw new Error('No wallet connected')
      }

      const password = await ensurePassword()

      const parsed = JSON.parse(typedData)

      const result =
        await apiClient.wallet.account.ethereum.signTypedData.mutate({
          walletId: currentWallet.id,
          password,
          fromAddress: address,
          domain: parsed.domain,
          types: parsed.types,
          primaryType: parsed.primaryType,
          message: parsed.message,
        })

      return result.signature as Hex
    },
    [currentWallet?.id, address, ensurePassword],
  )

  const handleSetUnlockHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_handler: () => Promise<string | null>) => {
      // No-op: PasswordContext handles password requests via requestPassword()
    },
    [],
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
      setUnlockHandler: handleSetUnlockHandler,
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
      handleSetUnlockHandler,
    ],
  )

  return (
    <SignerContext.Provider value={value}>{children}</SignerContext.Provider>
  )
}
