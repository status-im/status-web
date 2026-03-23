import { useContractCall } from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { VotingCardSkeleton } from '../components/votes/VotingCardSkeleton'
import { useCommunities } from '../hooks/useCommunities'
import { useContracts } from '../hooks/useContracts'
import { DetailedVotingRoom } from '../models/smartContract'
import { VotingMobile } from './VotingMobile'

export function VotingRoomMobile() {
  const { id } = useParams<{ id: string }>()

  const { votingContract } = useContracts()
  const votingRoom = useContractCall({
    abi: votingContract.interface,
    address: votingContract.address,
    method: 'votingRooms',
    args: [Number(id) - 1],
  }) as any

  const [details] = useCommunities(votingRoom?.community ? [votingRoom.community] : []) ?? []
  const [detailedVotingRoom, setDetailedVotingRoom] = useState<DetailedVotingRoom | undefined>(undefined)

  useEffect(() => {
    if (votingRoom && details) {
      setDetailedVotingRoom({ ...votingRoom, details })
    }
  }, [votingRoom?.roomNumber?.toString(), details?.publicKey])

  return <div>{detailedVotingRoom ? <VotingMobile room={detailedVotingRoom} /> : <VotingCardSkeleton />}</div>
}
