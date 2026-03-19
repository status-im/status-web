import { useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import { useContracts } from './useContracts'
import { BigNumber } from 'ethers'
import { TypedVote } from '../models/TypedData'

export function useTypedVote() {
  const { chainId } = useEthers()
  const { votingContract } = useContracts()

  const getTypedVote = useCallback(
    (data: [string, BigNumber, BigNumber, BigNumber]) => {
      return {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Vote: [
            { name: 'roomIdAndType', type: 'uint256' },
            { name: 'sntAmount', type: 'uint256' },
            { name: 'voter', type: 'address' },
            { name: 'timestamp', type: 'uint256' },
          ],
        },
        primaryType: 'Vote',
        domain: {
          name: 'Voting Contract',
          version: '1',
          chainId: chainId,
          verifyingContract: votingContract.address,
        },
        message: {
          roomIdAndType: data[1].toHexString(),
          sntAmount: data[2].toHexString(),
          voter: data[0],
          timestamp: data[3].toHexString(),
        },
      } as TypedVote
    },
    [chainId, votingContract.address],
  )
  return { getTypedVote }
}
