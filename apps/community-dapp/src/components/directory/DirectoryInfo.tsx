import React, { useEffect, useState } from 'react'
import { InfoWrap, PageInfo } from '../PageInfo'
import { useContractFunction } from '@usedapp/core'
import { ConnectionNetwork } from '../ConnectionNetwork'
import { ProposeButton } from '../Button'
import { useFeaturedVotes } from '../../providers/featuredVotes/provider'
import { useFeaturedVotingState } from '../../hooks/useFeaturedVotingState'
import { useContracts } from '../../hooks/useContracts'
import { useWaku } from '../../providers/waku/provider'
import { mapFeaturesVotes, receiveWakuFeature } from '../../helpers/receiveWakuFeature'
import { config } from '../../config'
import { useTypedFeatureVote } from '../../hooks/useTypedFeatureVote'
import { useFeaturedBatches } from '../../hooks/useFeaturedBatches'
import { useAccount } from '../../hooks/useAccount'

export function DirectoryInfo() {
  const { isActive } = useAccount()
  const { featuredVotingContract } = useContracts()
  const { getTypedFeatureVote } = useTypedFeatureVote()
  const { waku } = useWaku()
  const { activeVoting } = useFeaturedVotes()
  const featuredVotingState = useFeaturedVotingState(activeVoting)
  const castVotes = useContractFunction(featuredVotingContract, 'castVotes')
  const finalizeVoting = useContractFunction(featuredVotingContract, 'finalizeVoting')
  const [loading, setLoading] = useState(false)
  const { finalizeVotingLimit, batchCount, batchDoneCount, beingEvaluated, beingFinalized } = useFeaturedBatches()

  useEffect(() => {
    if (finalizeVoting.state.status === 'Success' || castVotes.state.status === 'Success') {
      history.go(0)
    }
  }, [finalizeVoting.state.status, castVotes.state.status])

  if (!activeVoting) {
    return (
      <InfoWrap>
        <PageInfo
          heading="Current directory"
          text="Vote on your favourite communities being included in
      Weekly Featured Communities"
        />

        <ConnectionNetwork />
      </InfoWrap>
    )
  }

  return (
    <InfoWrap>
      <PageInfo
        heading="Current directory"
        text="Vote on your favourite communities being included in
      Weekly Featured Communities"
      />

      <ConnectionNetwork />
      {isActive && featuredVotingState === 'verification' && (
        <ProposeButton
          onClick={async () => {
            setLoading(true)
            const { votesToSend } = await receiveWakuFeature(waku, config.wakuConfig.wakuFeatureTopic, activeVoting!)
            const votes = mapFeaturesVotes(votesToSend, getTypedFeatureVote)

            const batchedVotes = votes.slice(
              batchDoneCount * config.votesLimit,
              batchDoneCount * config.votesLimit + finalizeVotingLimit,
            )

            await castVotes.send(batchedVotes)
            setLoading(false)
          }}
        >
          {loading ? (
            'Waiting...'
          ) : (
            <>
              Verify Weekly featured{' '}
              {batchCount > 1 && (
                <>
                  ({beingEvaluated ? batchDoneCount : 0}/{batchCount} verified)
                </>
              )}
            </>
          )}
        </ProposeButton>
      )}
      {isActive && featuredVotingState === 'ended' && (
        <ProposeButton
          onClick={() => {
            finalizeVoting.send(finalizeVotingLimit < 1 ? 1 : finalizeVotingLimit)
          }}
        >
          Finalize Weekly featured{' '}
          {batchCount > 1 && (
            <>
              ({beingFinalized ? batchDoneCount : 0}/{batchCount} finalized)
            </>
          )}
        </ProposeButton>
      )}
    </InfoWrap>
  )
}
