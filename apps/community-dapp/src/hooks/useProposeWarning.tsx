import { useContractCall } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { CommunityDetail } from '../models/community'
import { useAvailableAmount } from './useAvailableAmount'
import { useContracts } from './useContracts'

export function useProposeWarning(communityFound: CommunityDetail) {
  const availableAmount = useAvailableAmount()

  const [warning, setWarning] = useState({ icon: '', text: '' })

  const { directoryContract, votingContract } = useContracts()

  const [isCommunityInDirectory] = useContractCall({
    abi: directoryContract.interface,
    address: directoryContract.address,
    method: 'isCommunityInDirectory',
    args: [communityFound?.publicKey],
  }) ?? [undefined]

  const [isCommunityUnderVote] = useContractCall({
    abi: votingContract.interface,
    address: votingContract.address,
    method: 'activeRoomIDByCommunityID',
    args: [communityFound?.publicKey],
  }) ?? [undefined]

  useEffect(() => {
    const getWarning = () => {
      if (communityFound) {
        if (isCommunityInDirectory) {
          return {
            icon: '⚠️',
            text: `${communityFound.name} is already in the communities directory! No need to start a new vote.`,
          }
        }
        if (isCommunityUnderVote && isCommunityUnderVote?.toNumber() > 0) {
          return { icon: '⚠️', text: `There’s already an ongoing vote to add ${communityFound.name} in the directory!` }
        }
        // if (!communityFound.ens) {
        //   return {
        //     icon: '⚠️',
        //     text: `${communityFound.name} is not registered in Ethereum Name Service. Only communities with ENS name can be included in the directory.`,
        //   }
        // }
        if (availableAmount < 10000) {
          return {
            icon: '💰',
            text: `Not enough SNT to start a vote for this community. A new vote for ${communityFound.name} requires at least 10,000 SNT available.`,
          }
        }
        // if (communityFound.numberOfMembers < 42) {
        //   return {
        //     icon: '🤏',
        //     text: `${communityFound.name} currently only has ${communityFound.numberOfMembers} members. A community needs more than 42 members before a vote to be added to the Status community directory can be proposed.`,
        //   }
        // }
      }
      return { icon: '', text: '' }
    }
    setWarning(getWarning())
  }, [
    isCommunityInDirectory,
    availableAmount,
    isCommunityUnderVote?.toNumber(),
    communityFound?.numberOfMembers,
    communityFound?.ens,
  ])

  return warning
}
