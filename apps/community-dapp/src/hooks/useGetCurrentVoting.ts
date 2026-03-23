import { useContractCall } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { votingFromRoom } from '../helpers/voting'
import { CurrentVoting } from '../models/community'
import { VotingRoom } from '../models/smartContract'
import { useContracts } from './useContracts'

export function useGetCurrentVoting(publicKey: string | undefined) {
  const [currentVoting, setCurrentVoting] = useState<undefined | CurrentVoting>(undefined)
  const [votingRoomState, setVotingRoomState] = useState<undefined | VotingRoom>(undefined)
  const { votingContract } = useContracts()

  const [roomList] = useContractCall({
    abi: votingContract.interface,
    address: votingContract.address,
    method: 'getActiveVotingRooms',
    args: [],
  }) ?? [[]]

  useEffect(() => {
    const hasPublicKey = roomList.some((room: any) => room.community === publicKey)
    if (hasPublicKey) {
      const votingRoom = useContractCall({
        abi: votingContract.interface,
        address: votingContract.address,
        method: 'getActiveVotingRoom',
        args: [publicKey],
      }) as any

      if (votingRoom && !votingRoom.finalized) {
        setVotingRoomState(votingRoom)
        setCurrentVoting(votingFromRoom(votingRoom))
      } else {
        setCurrentVoting(undefined)
        setVotingRoomState(undefined)
      }
    } else {
      setCurrentVoting(undefined)
      setVotingRoomState(undefined)
    }
  }, [roomList, publicKey])

  return { currentVoting, votingRoom: votingRoomState }
}
