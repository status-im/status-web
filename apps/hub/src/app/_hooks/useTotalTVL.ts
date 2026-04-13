import { useMemo } from 'react'

import { formatUnits } from 'viem'

import {
  GUSD_TOKEN,
  LINEA_VAULT,
  SNT_VAULT,
  WETH_VAULT,
} from '~constants/address'

import { useExchangeRate } from './useExchangeRate'
import { useGUSDTVL } from './useGUSDTVL'
import { usePreDepositTVL } from './usePreDepositTVL'

export function useTotalTVL() {
  const sntTvl = usePreDepositTVL({ vault: SNT_VAULT })
  const lineaTvl = usePreDepositTVL({ vault: LINEA_VAULT })
  const wethTvl = usePreDepositTVL({ vault: WETH_VAULT })
  const gusdTvl = useGUSDTVL()

  const sntRate = useExchangeRate({
    token: SNT_VAULT.token.priceKey || SNT_VAULT.token.symbol,
  })
  const lineaRate = useExchangeRate({
    token: LINEA_VAULT.token.priceKey || LINEA_VAULT.token.symbol,
  })
  const wethRate = useExchangeRate({
    token: WETH_VAULT.token.priceKey || WETH_VAULT.token.symbol,
  })
  const gusdRate = useExchangeRate({
    token: GUSD_TOKEN.priceKey || GUSD_TOKEN.symbol,
  })

  const totalTVL = useMemo(() => {
    let total = 0

    if (sntTvl.data && sntRate.data) {
      const amount = Number(formatUnits(sntTvl.data, SNT_VAULT.token.decimals))
      total += amount * sntRate.data.price
    }

    if (lineaTvl.data && lineaRate.data) {
      const amount = Number(
        formatUnits(lineaTvl.data, LINEA_VAULT.token.decimals)
      )
      total += amount * lineaRate.data.price
    }

    if (wethTvl.data && wethRate.data) {
      const amount = Number(
        formatUnits(wethTvl.data, WETH_VAULT.token.decimals)
      )
      total += amount * wethRate.data.price
    }

    if (gusdTvl.data && gusdRate.data) {
      const amount = Number(formatUnits(gusdTvl.data, GUSD_TOKEN.decimals))
      total += amount * gusdRate.data.price
    }

    return total
  }, [
    sntTvl.data,
    lineaTvl.data,
    wethTvl.data,
    gusdTvl.data,
    sntRate.data,
    lineaRate.data,
    wethRate.data,
    gusdRate.data,
  ])

  const isLoading =
    sntTvl.isLoading ||
    lineaTvl.isLoading ||
    wethTvl.isLoading ||
    gusdTvl.isLoading ||
    sntRate.isLoading ||
    lineaRate.isLoading ||
    wethRate.isLoading ||
    gusdRate.isLoading

  return {
    data: totalTVL,
    isLoading,
  }
}
