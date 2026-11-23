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
  const { verification, finalization } = useFeaturedBatches()

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
              verification.batchDoneCount * config.votesLimit,
              verification.batchDoneCount * config.votesLimit + verification.limit,
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
              {verification.batchCount > 1 && (
                <>
                  ({verification.beingEvaluated ? verification.batchDoneCount : 0}/{verification.batchCount} verified)
                </>
              )}
            </>
          )}
        </ProposeButton>
      )}
      {isActive && featuredVotingState === 'ended' && finalization && (
        <ProposeButton onClick={() => finalizeVoting.send(finalization.limit)}>
          Finalize Weekly featured{' '}
          {finalization.batchCount > 1 && (
            <>
              ({finalization.batchDoneCount}/{finalization.batchCount} finalized)
            </>
          )}
        </ProposeButton>
      )}
    </InfoWrap>
  )
}
