import { useEffect, useState } from 'react'
import { DetailedVotingRoom } from '../models/smartContract'
import { useVotesAggregate } from './useVotesAggregate'

export function useRoomAggregateVotes(room: DetailedVotingRoom, showConfirmModal: boolean) {
  const { votesToSend } = useVotesAggregate(room.roomNumber, room.verificationStartAt, room.startAt)

  const [returnRoom, setReturnRoom] = useState(room)

  useEffect(() => {
    if (room.endAt.toNumber() > Date.now() / 1000 && showConfirmModal === false) {
      const reducedVotes = votesToSend.reduce(
        (accumulator, vote) => {
          if (vote[1].mod(2).toNumber()) {
            return { for: accumulator.for.add(vote[2]), against: accumulator.against }
          }
          return { for: accumulator.for, against: accumulator.against.add(vote[2]) }
        },
        { for: room.totalVotesFor, against: room.totalVotesAgainst },
      )
      setReturnRoom({ ...room, totalVotesAgainst: reducedVotes.against, totalVotesFor: reducedVotes.for })
    }
  }, [JSON.stringify(votesToSend), JSON.stringify(room), showConfirmModal])

  return returnRoom
}
