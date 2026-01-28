import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

import { USDC_TOKEN, USDS_TOKEN, USDT_TOKEN } from '~constants/address'
import { PreDepositVaultAbi } from '~constants/contracts/PreDepositVaultAbi'

import type { StablecoinToken } from '~constants/address'

export interface StablecoinBreakdown {
  token: StablecoinToken
  amount: bigint
}

export interface UseGUSDStablecoinBreakdownParams {
  enabled?: boolean
}

export interface UseGUSDStablecoinBreakdownReturn {
  data: StablecoinBreakdown[]
  isLoading: boolean
}

export function useGUSDStablecoinBreakdown({
  enabled = true,
}: UseGUSDStablecoinBreakdownParams = {}): UseGUSDStablecoinBreakdownReturn {
  const { data: usdcAmount, isLoading: isUsdcLoading } = useReadContract({
    address: USDC_TOKEN.vaultAddress,
    abi: PreDepositVaultAbi,
    functionName: 'totalAssets',
    chainId: mainnet.id,
    query: { enabled },
  })

  const { data: usdtAmount, isLoading: isUsdtLoading } = useReadContract({
    address: USDT_TOKEN.vaultAddress,
    abi: PreDepositVaultAbi,
    functionName: 'totalAssets',
    chainId: mainnet.id,
    query: { enabled },
  })

  const { data: usdsAmount, isLoading: isUsdsLoading } = useReadContract({
    address: USDS_TOKEN.vaultAddress,
    abi: PreDepositVaultAbi,
    functionName: 'totalAssets',
    chainId: mainnet.id,
    query: { enabled },
  })

  const isLoading = isUsdcLoading || isUsdtLoading || isUsdsLoading

  const data: StablecoinBreakdown[] = [
    { token: USDC_TOKEN, amount: usdcAmount ?? 0n },
    { token: USDT_TOKEN, amount: usdtAmount ?? 0n },
    { token: USDS_TOKEN, amount: usdsAmount ?? 0n },
  ]

  return {
    data,
    isLoading,
  }
}
