import { useMemo } from 'react'

import { formatUnits } from 'viem'

import { LIDO_VAULT, LINEA_VAULT, SNT_VAULT } from '~constants/address'

import { useExchangeRate } from './useExchangeRate'
import { usePreDepositTVL } from './usePreDepositTVL'

export function useTotalTVL() {
  const sntTvl = usePreDepositTVL({ vault: SNT_VAULT })
  const lineaTvl = usePreDepositTVL({ vault: LINEA_VAULT })
  const lidoTvl = usePreDepositTVL({ vault: LIDO_VAULT })

  const sntRate = useExchangeRate({
    token: SNT_VAULT.token.priceKey || SNT_VAULT.token.symbol,
  })
  const lineaRate = useExchangeRate({
    token: LINEA_VAULT.token.priceKey || LINEA_VAULT.token.symbol,
  })
  const lidoRate = useExchangeRate({
    token: LIDO_VAULT.token.priceKey || LIDO_VAULT.token.symbol,
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

    if (lidoTvl.data && lidoRate.data) {
      const amount = Number(
        formatUnits(lidoTvl.data, LIDO_VAULT.token.decimals)
      )
      total += amount * lidoRate.data.price
    }

    return total
  }, [
    sntTvl.data,
    lineaTvl.data,
    lidoTvl.data,
    sntRate.data,
    lineaRate.data,
    lidoRate.data,
  ])

  const isLoading =
    sntTvl.isLoading ||
    lineaTvl.isLoading ||
    lidoTvl.isLoading ||
    sntRate.isLoading ||
    lineaRate.isLoading ||
    lidoRate.isLoading

  return {
    data: totalTVL,
    isLoading,
  }
}
