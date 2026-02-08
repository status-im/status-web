import { useMemo } from 'react'

import { match, P } from 'ts-pattern'
import { useBalance, useReadContract } from 'wagmi'

import {
  isGUSDVault,
  type StablecoinToken,
  type Vault,
  WETH_VAULT,
} from '~constants/address'
import { allowanceAbi } from '~constants/contracts/AllowanceAbi'
import { usePreDepositLimits } from '~hooks/usePreDepositLimits'
import { useVaultSharesValidation } from '~hooks/useVaultSharesValidation'

interface UseDepositFlowParams {
  vault: Vault
  amountWei: bigint
  address?: `0x${string}`
  selectedStablecoin?: StablecoinToken
}

export type DepositAction =
  | 'idle'
  | 'approve'
  | 'deposit'
  | 'needs-wrap'
  | 'invalid-balance'
  | 'exceeds-max'
  | 'below-min'
  | 'invalid-shares'

export function useDepositFlow({
  vault,
  amountWei,
  address,
  selectedStablecoin,
}: UseDepositFlowParams) {
  const isWETHVault = vault.id === WETH_VAULT.id
  const isGUSD = isGUSDVault(vault)

  const tokenAddress =
    isGUSD && selectedStablecoin
      ? selectedStablecoin.address
      : vault.token.address

  const vaultAddress = isGUSD
    ? vault.gusdConfig.depositorAddress
    : vault.address

  const { data: balance, refetch: refetchWETHBalance } = useBalance({
    address,
    token: tokenAddress,
    query: { enabled: !!address },
    chainId: vault.chainId,
  })

  const { data: ethBalance, refetch: refetchETHBalance } = useBalance({
    address,
    query: { enabled: !!address && isWETHVault },
    chainId: vault.chainId,
  })

  const {
    data: allowance,
    refetch: refetchAllowance,
    isPending: isLoadingAllowance,
  } = useReadContract({
    address: tokenAddress,
    abi: allowanceAbi,
    functionName: 'allowance',
    args: address ? [address, vaultAddress] : undefined,
    query: { enabled: !!address },
    chainId: vault.chainId,
  })

  const { data: depositLimits } = usePreDepositLimits({ vault })
  const maxDeposit = isGUSD ? undefined : depositLimits?.maxDeposit
  const minDeposit = isGUSD ? undefined : depositLimits?.minDeposit

  const sharesValidation = useVaultSharesValidation({
    vault,
    depositAmount: amountWei,
    enabled: !!vault && amountWei > 0n && !isGUSD,
  })

  const actionState = useMemo((): DepositAction => {
    if (amountWei === 0n) return 'idle'
    if (!isGUSD && !sharesValidation.isValid) return 'invalid-shares'

    const currentBal = balance?.value ?? 0n
    const currentEthBal = ethBalance?.value ?? 0n
    const currentAllow = allowance ?? 0n
    const totalAvailable = isWETHVault ? currentBal + currentEthBal : currentBal

    return match({
      amountWei,
      currentBal,
      currentEthBal,
      totalAvailable,
      currentAllow,
      maxDeposit,
      minDeposit,
      isWETHVault,
    })
      .with(
        { amountWei: P.when(a => a > totalAvailable) },
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
        {
          isWETHVault: true,
          amountWei: P.when(a => a > currentBal),
          currentEthBal: P.when(b => b > 0n),
        },
        () => 'needs-wrap' as const
      )
      .with(
        { amountWei: P.when(a => a > currentAllow) },
        () => 'approve' as const
      )
      .otherwise(() => 'deposit' as const)
  }, [
    amountWei,
    balance,
    ethBalance,
    allowance,
    maxDeposit,
    minDeposit,
    sharesValidation.isValid,
    isWETHVault,
    isGUSD,
  ])

  const refetchBalances = async () => {
    await Promise.all([
      refetchWETHBalance(),
      isWETHVault ? refetchETHBalance() : Promise.resolve(),
    ])
  }

  return {
    actionState,
    balance: balance?.value ?? 0n,
    ethBalance: ethBalance?.value ?? 0n,
    maxDeposit,
    minDeposit,
    sharesValidation,
    refetchAllowance,
    refetchBalances,
    isLoadingAllowance,
    isGUSD,
    vaultAddress,
  }
}
