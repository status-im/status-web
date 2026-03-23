import { config } from '../config'
import voting from '../helpers/voting'
import { DetailedVotingRoom } from '../models/smartContract'
import { useRoomAggregateVotes } from './useRoomAggregateVotes'
import { useVotesAggregate } from './useVotesAggregate'

interface Props {
  room: DetailedVotingRoom
}

export const useVotingBatches = ({ room }: Props) => {
  const vote = voting.fromRoom(room)
  const { votesToSend, allVotes } = useVotesAggregate(vote.ID, room.verificationStartAt, room.startAt)
  const { evaluated, finalized, evaluatingPos } = useRoomAggregateVotes(room, false)

  const beingFinalized = !evaluated && finalized
  const beingEvaluated = evaluated && !finalized
  const firstFinalization = beingEvaluated && evaluatingPos === allVotes.length + 1

  const votesLeftCount = allVotes.length - evaluatingPos + 1
  const finalizeVotingLimit = firstFinalization
    ? Math.min(allVotes.length, config.votesLimit)
    : Math.min(votesLeftCount, config.votesLimit)

  const batchCount = Math.ceil((beingFinalized ? allVotes.length + 1 : allVotes.length) / config.votesLimit)
  const batchLeftCount = Math.ceil(votesLeftCount / config.votesLimit)
  const batchDoneCount = batchCount - batchLeftCount
  const batchedVotes = votesToSend.slice(0, finalizeVotingLimit)

  return {
    finalizeVotingLimit,
    batchCount,
    batchDoneCount,
    beingFinalized,
    beingEvaluated,
    batchedVotes,
  }
}
