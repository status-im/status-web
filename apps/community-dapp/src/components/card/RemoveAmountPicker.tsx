import { useContractFunction } from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { timespan } from '../../helpers/timespan'
import { useContracts } from '../../hooks/useContracts'
import { CommunityDetail } from '../../models/community'
import { ButtonPrimary } from '../Button'
import { VotePropose } from '../votes/VotePropose'
import { Warning } from '../votes/VoteWarning'
import { ConfirmBtn } from './VoteConfirmModal'
import { useAvailableAmount } from '../../hooks/useAvailableAmount'
import { BigNumber } from 'ethers'
interface RemoveAmountPickerProps {
  community: CommunityDetail
  setShowConfirmModal: (val: boolean) => void
}

export function RemoveAmountPicker({ community, setShowConfirmModal }: RemoveAmountPickerProps) {
  const availableAmount = useAvailableAmount()

  const [proposingAmount, setProposingAmount] = useState(0)
  const disabled = proposingAmount === 0
  const { votingContract } = useContracts()
  const { send, state } = useContractFunction(votingContract, 'initializeVotingRoom')

  useEffect(() => {
    if (state.status === 'Mining' || state.status === 'Success') {
      setShowConfirmModal(true)
    }
  }, [state])

  if (community.votingHistory && community.votingHistory.length > 0) {
    const lastVote = community.votingHistory[community.votingHistory.length - 1]
    const lastVoteDate = lastVote.date
    if (timespan(lastVoteDate) < 3 && lastVote.type === 'Remove') {
      return (
        <WarningWrapRemoval>
          <Warning
            icon="⏳"
            text={`${community.name} had a vote for removal ${timespan(
              lastVoteDate,
            )} days ago. A new vote can be submitted after 2 days passes since the last vote.`}
          />
          <ConfirmBtn
            onClick={() => {
              setShowConfirmModal(false)
            }}
          >
            OK, let’s move on! <span>🤙</span>
          </ConfirmBtn>
        </WarningWrapRemoval>
      )
    }
  }
  if (availableAmount < 10000) {
    return (
      <WarningWrapRemoval>
        <Warning
          icon="💰"
          text={`Not enough SNT to start a vote for this community. A new vote for ${community.name} requires at least 10,000 SNT available.`}
        />
        {window.innerWidth > 600 && (
          <ConfirmBtn
            onClick={() => {
              setShowConfirmModal(false)
            }}
          >
            OK, let’s move on! <span>🤙</span>
          </ConfirmBtn>
        )}
      </WarningWrapRemoval>
    )
  }
  return (
    <VoteProposeWrap>
      <VotePropose setProposingAmount={setProposingAmount} proposingAmount={proposingAmount} />
      <VoteConfirmBtn disabled={disabled} onClick={() => send(0, community.publicKey, BigNumber.from(proposingAmount))}>
        Confirm vote to remove community
      </VoteConfirmBtn>
    </VoteProposeWrap>
  )
}

const VoteProposeWrap = styled.div`
  margin-top: 32px;
  width: 100%;

  @media (max-width: 600px) {
    margin-bottom: 0;
  }
`

const WarningWrapRemoval = styled.div``

const VoteConfirmBtn = styled(ButtonPrimary)`
  width: 100%;
  padding: 11px 0;
  margin-top: 32px;
`
