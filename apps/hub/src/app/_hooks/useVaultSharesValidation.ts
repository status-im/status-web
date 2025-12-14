import { match } from 'ts-pattern'
import { useReadContract } from 'wagmi'

import { lidoStETHAbi } from '~constants/contracts'
import { stETH_TOKEN, type Vault } from '~constants/index'

interface UseVaultSharesValidationParams {
  vault: Vault
  depositAmount: bigint
  chainId?: number
  enabled?: boolean
}

interface UseVaultSharesValidationReturn {
  shares: bigint | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  isValid: boolean
  validationMessage?: string
}

export function useVaultSharesValidation({
  vault,
  depositAmount,
  enabled = true,
}: UseVaultSharesValidationParams): UseVaultSharesValidationReturn {
  const isWETHVault = vault.token.symbol.toLowerCase() === 'weth'

  const lidoQuery = useReadContract({
    address: stETH_TOKEN.address,
    abi: lidoStETHAbi,
    functionName: 'getSharesByPooledEth',
    args: [depositAmount],
    query: { enabled: enabled && isWETHVault && depositAmount > 0n },
    chainId: vault.chainId,
  })

  const vaultQuery = useReadContract({
    address: vault.address,
    abi: vault.abi,
    functionName: 'convertToShares',
    args: [depositAmount],
    query: { enabled: enabled && !isWETHVault && depositAmount > 0n },
    chainId: vault.chainId,
  })

  const {
    data: shares,
    isLoading,
    isError,
    error,
  } = isWETHVault ? lidoQuery : vaultQuery

  const { isValid, validationMessage } = match({ shares, isLoading, isError })
    .with({ isLoading: true }, () => ({
      isValid: true,
      validationMessage: undefined,
    }))
    .with({ isError: true }, () => ({
      isValid: false,
      validationMessage: 'Error calculating your pre-deposit shares.',
    }))
    .with({ shares: 0n }, () => ({
      isValid: false,
      validationMessage:
        'This pre-deposit would result in 0 shares. Try to increase the amount.',
    }))
    .otherwise(() => ({
      isValid: !!shares && shares > 0n,
      validationMessage: undefined,
    }))

  return {
    shares,
    isLoading,
    isError,
    error,
    isValid,
    validationMessage,
  }
}
