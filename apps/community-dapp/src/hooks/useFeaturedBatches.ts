import { useContractCall } from '@usedapp/core'
import { config } from '../config'
import { useFeaturedVotes } from '../providers/featuredVotes/provider'
import { useContracts } from './useContracts'

export const useFeaturedBatches = () => {
  const { activeVoting, votes } = useFeaturedVotes()
  const { featuredVotingContract } = useContracts()
  const [onChainVotes] =
    useContractCall(
      activeVoting && {
        abi: featuredVotingContract.interface,
        address: featuredVotingContract.address,
        method: 'getVotesByVotingId',
        args: [activeVoting.id],
      },
    ) ?? []

  if (!activeVoting) {
    return {
      verification: {
        limit: 1,
        batchCount: 1,
        batchDoneCount: 0,
        beingEvaluated: false,
      },
      finalization: null,
    }
  }

  const evaluated = activeVoting.evaluated
  const finalized = activeVoting.finalized
  const allVotes = votes ?? {}
  const votesCount: number = Object.values(allVotes).reduce<number>(
    (acc: number, curr: any) => acc + Object.keys(curr?.votes).length,
    0,
  )

  const beingEvaluated = evaluated && !finalized
  const currentPosition = activeVoting.evaluatingPos
  const unverifiedVotesCount = votesCount - currentPosition + 1
  const verificationBatchCount = Math.ceil(votesCount / config.votesLimit)
  const verificationLimit = beingEvaluated && unverifiedVotesCount === 0 ? votesCount : unverifiedVotesCount

  // The first finalization call recounts all stored votes, including the vote that started the round.
  const onChainVotesCount = onChainVotes?.length ?? 0
  const remainingVotes = onChainVotesCount - (finalized ? currentPosition : 0)
  const finalizationBatchCount = Math.ceil(onChainVotesCount / config.votesLimit)

  return {
    verification: {
      limit: Math.min(verificationLimit, config.votesLimit),
      batchCount: verificationBatchCount,
      batchDoneCount: verificationBatchCount - Math.ceil(unverifiedVotesCount / config.votesLimit),
      beingEvaluated,
    },
    finalization:
      remainingVotes > 0
        ? {
            limit: Math.min(remainingVotes, config.votesLimit),
            batchCount: finalizationBatchCount,
            batchDoneCount: finalizationBatchCount - Math.ceil(remainingVotes / config.votesLimit),
          }
        : null,
  }
}
