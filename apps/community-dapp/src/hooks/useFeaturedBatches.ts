import { config } from '../config'
import { useFeaturedVotes } from '../providers/featuredVotes/provider'

export const useFeaturedBatches = () => {
  const { activeVoting, votes } = useFeaturedVotes()

  if (!activeVoting) {
    return {
      finalizeVotingLimit: 1,
      batchCount: 1,
      batchDoneCount: 0,
      beingEvaluated: false,
      beingFinalized: false,
    }
  }

  const evaluated = activeVoting.evaluated
  const finalized = activeVoting.finalized
  const allVotes = votes ?? {}
  const votesCount: number = Object.values(allVotes).reduce<number>(
    (acc: number, curr: any) => acc + Object.keys(curr?.votes).length,
    0,
  )

  const beingFinalized = !evaluated && finalized
  const beingEvaluated = evaluated && !finalized
  const currentPosition = activeVoting.evaluatingPos
  const firstFinalization = beingEvaluated && currentPosition === votesCount + 1

  const votesLeftCount = votesCount - currentPosition + 1
  const finalizeVotingLimit = firstFinalization
    ? Math.min(votesCount, config.votesLimit)
    : Math.min(votesLeftCount, config.votesLimit)
  const batchCount = Math.ceil((beingFinalized ? votesCount + 1 : votesCount) / config.votesLimit)
  const batchLeftCount = Math.ceil(votesLeftCount / config.votesLimit)

  const batchDoneCount = batchCount - batchLeftCount

  return {
    finalizeVotingLimit,
    batchCount,
    batchDoneCount,
    beingFinalized,
    beingEvaluated,
  }
}
