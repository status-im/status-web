import { ChainId, useEthers, useTokenBalance } from '@usedapp/core'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { config } from '../config'

export function useAvailableAmount() {
  const { account, chainId } = useEthers()
  const tokenBalance = useTokenBalance(config.contracts[chainId as ChainId]?.tokenContract, account)

  const [availableAmount, setAvailableAmount] = useState(0)

  useEffect(() => {
    setAvailableAmount(tokenBalance?.div(BigNumber.from('0xDE0B6B3A7640000')).toNumber() ?? 0)
  }, [tokenBalance?.toString()])

  return availableAmount
}
