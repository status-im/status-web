import { useMemo } from 'react'

import { match, P } from 'ts-pattern'
import { useBalance, useReadContract } from 'wagmi'

import { allowanceAbi } from '~constants/contracts/AllowanceAbi'
import { usePreDepositLimits } from '~hooks/usePreDepositLimits'
import { useVaultSharesValidation } from '~hooks/useVaultSharesValidation'

import type { Vault } from '~constants/index'

interface UseDepositFlowParams {
  vault: Vault
  amountWei: bigint
  address?: `0x${string}`
}

export type DepositAction =
  | 'idle'
  | 'approve'
  | 'deposit'
  | 'invalid-balance'
  | 'exceeds-max'
  | 'below-min'
  | 'invalid-shares'

export function useDepositFlow({
  vault,
  amountWei,
  address,
}: UseDepositFlowParams) {
  const { data: balance } = useBalance({
    address,
    token: vault.token.address,
    query: { enabled: !!address },
    chainId: vault.chainId,
  })

  const {
    data: allowance,
    refetch: refetchAllowance,
    isPending: isLoadingAllowance,
  } = useReadContract({
    address: vault.token.address,
    abi: allowanceAbi,
    functionName: 'allowance',
    args: address ? [address, vault.address] : undefined,
    query: { enabled: !!address },
    chainId: vault.chainId,
  })

  const { data: depositLimits } = usePreDepositLimits({ vault })
  const maxDeposit = depositLimits?.maxDeposit
  const minDeposit = depositLimits?.minDeposit

  const sharesValidation = useVaultSharesValidation({
    vault,
    depositAmount: amountWei,
    enabled: !!vault && amountWei > 0n,
  })

  const actionState = useMemo((): DepositAction => {
    if (amountWei === 0n) return 'idle'
    if (!sharesValidation.isValid) return 'invalid-shares'

    const currentBal = balance?.value ?? 0n
    const currentAllow = allowance ?? 0n

    return match({
      amountWei,
      currentBal,
      currentAllow,
      maxDeposit,
      minDeposit,
    })
      .with(
        { amountWei: P.when(a => a > currentBal) },
        () => 'invalid-balance' as const
      )
      .with(
        {
          maxDeposit: P.not(P.nullish),
          amountWei: P.when(a => maxDeposit && a > maxDeposit),
        },
        () => 'exceeds-max' as const
      )
      .with(
        {
          minDeposit: P.not(P.nullish),
          amountWei: P.when(a => minDeposit && a < minDeposit),
        },
        () => 'below-min' as const
      )
      .with(
        { amountWei: P.when(a => a > currentAllow) },
        () => 'approve' as const
      )
      .otherwise(() => 'deposit' as const)
  }, [
    amountWei,
    balance,
    allowance,
    maxDeposit,
    minDeposit,
    sharesValidation.isValid,
  ])

  return {
    actionState,
    balance: balance?.value ?? 0n,
    maxDeposit,
    minDeposit,
    sharesValidation,
    refetchAllowance,
    isLoadingAllowance,
  }
}
