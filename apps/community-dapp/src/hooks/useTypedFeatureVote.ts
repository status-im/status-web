import { useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import { useContracts } from './useContracts'
import { BigNumber } from 'ethers'
import { TypedFeature } from '../models/TypedData'

export function useTypedFeatureVote() {
  const { chainId } = useEthers()
  const { featuredVotingContract } = useContracts()

  const getTypedFeatureVote = useCallback(
    (data: [string, string, BigNumber, BigNumber]) => {
      return {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Vote: [
            { name: 'voter', type: 'address' },
            { name: 'community', type: 'bytes' },
            { name: 'sntAmount', type: 'uint256' },
            { name: 'timestamp', type: 'uint256' },
          ],
        },
        primaryType: 'Vote',
        domain: {
          name: 'Featured Voting Contract',
          version: '1',
          chainId: chainId,
          verifyingContract: featuredVotingContract.address,
        },
        message: {
          voter: data[0],
          community: data[1],
          sntAmount: data[2].toHexString(),
          timestamp: data[3].toHexString(),
        },
      } as TypedFeature
    },
    [chainId, featuredVotingContract.address],
  )

  return { getTypedFeatureVote }
}
