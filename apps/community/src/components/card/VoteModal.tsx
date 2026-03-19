import React from 'react'
import styled from 'styled-components'
import { VoteChart } from '../votes/VoteChart'
import { ButtonSecondary } from '../Button'
import { CurrentVoting } from '../../models/community'
import { VotePropose } from '../votes/VotePropose'
import { VoteType } from '../../constants/voteTypes'
import { useSendWakuVote } from '../../hooks/useSendWakuVote'
import { ColumnFlexDiv } from '../../constants/styles'
import { DetailedVotingRoom } from '../../models/smartContract'
import { useWaku } from '../../providers/waku/provider'

export interface VoteModalProps {
  vote: CurrentVoting
  selectedVote: VoteType
  proposingAmount: number
  room: number
  setShowConfirmModal: (show: boolean) => void
  setProposingAmount: (val: number) => void
  onSend: (val: number) => void
  fullRoom: DetailedVotingRoom
  votesFor: number
  votesAgainst: number
}

export function VoteModal({
  vote,
  room,
  selectedVote,
  proposingAmount,
  setShowConfirmModal,
  setProposingAmount,
  onSend,
  votesFor,
  votesAgainst,
}: VoteModalProps) {
  const { isConnected } = useWaku()
  const sendWakuVote = useSendWakuVote()

  return (
    <ColumnFlexDiv>
      <VoteChart
        vote={vote}
        proposingAmount={proposingAmount}
        selectedVote={selectedVote}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
      />
      <VotePropose
        vote={vote}
        selectedVote={selectedVote}
        setProposingAmount={setProposingAmount}
        proposingAmount={proposingAmount}
      />

      <VoteConfirmBtn
        onClick={async () => {
          // fixme?: eval error
          await sendWakuVote(proposingAmount, room, selectedVote.type)

          onSend(proposingAmount)

          setShowConfirmModal(true)
        }}
        disabled={!isConnected || proposingAmount === 0}
      >{`Vote ${selectedVote.verb} community ${selectedVote.icon}`}</VoteConfirmBtn>
    </ColumnFlexDiv>
  )
}

const VoteConfirmBtn = styled(ButtonSecondary)`
  width: 100%;
  padding: 11px 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  margin-top: 32px;
`
