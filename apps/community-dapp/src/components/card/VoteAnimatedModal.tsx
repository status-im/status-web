import React from 'react'
import styled from 'styled-components'
import { VoteType } from '../../constants/voteTypes'
import { CommunityDetail, CurrentVoting } from '../../models/community'
import { ButtonSecondary } from '../Button'
import { VoteChart } from '../votes/VoteChart'

interface VoteAnimatedModalProps {
  community: CommunityDetail
  vote: CurrentVoting
  selectedVote: VoteType
  proposingAmount: number
  setShowModal: (val: boolean) => void
  votesFor: number
  votesAgainst: number
}

export function VoteAnimatedModal({
  community,
  vote,
  proposingAmount,
  selectedVote,
  setShowModal,
  votesFor,
  votesAgainst,
}: VoteAnimatedModalProps) {
  return (
    <VoteConfirm>
      {community.icon && <ConfirmLogo src={community.icon} alt={`${community.name} logo`} />}
      <ConfirmText>
        You voted{' '}
        <span>
          {selectedVote.verb} {community.name}
        </span>
        {'.'}
      </ConfirmText>
      <VoteChart
        vote={vote}
        proposingAmount={proposingAmount}
        selectedVote={selectedVote}
        isAnimation={true}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
      />

      <ConfirmBtn onClick={() => setShowModal(false)}>
        OK, let’s move on! <span>🤙</span>
      </ConfirmBtn>
    </VoteConfirm>
  )
}

const VoteConfirm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ConfirmLogo = styled.img`
  width: 64px !important;
  height: 64px !important;
  border-radius: 50%;
  margin-bottom: 32px;
`

const ConfirmText = styled.div`
  max-width: 272px;
  margin-bottom: 32px;
  text-align: center;
  line-height: 22px;

  & > span {
    font-weight: bold;
  }
`

export const ConfirmBtn = styled(ButtonSecondary)`
  width: 100%;
  padding: 11px 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;

  & > span {
    font-size: 20px;
  }
`
