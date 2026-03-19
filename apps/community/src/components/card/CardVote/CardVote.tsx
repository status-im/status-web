// todo?: use store for votes, aggregations, verification period, winner

import React, { useEffect, useState } from 'react'
import { VoteModal } from './../VoteModal'
import { VoteChart } from './../../votes/VoteChart'
import { voteTypes } from './../../../constants/voteTypes'
import { useContractFunction } from '@usedapp/core'
import { useContracts } from '../../../hooks/useContracts'
import { getVotingWinner } from '../../../helpers/voting'
import { VoteAnimatedModal } from './../VoteAnimatedModal'
import voting from '../../../helpers/voting'
import { DetailedVotingRoom } from '../../../models/smartContract'
import styled from 'styled-components'
import { Modal } from './../../Modal'
import { VoteBtn, VotesBtns } from '../../Button'
import { CardHeading, CardVoteBlock } from '../../Card'
import { useUnverifiedVotes } from '../../../hooks/useUnverifiedVotes'
import { useVotingBatches } from '../../../hooks/useVotingBatches'
import { useAccount } from '../../../hooks/useAccount'

interface CardVoteProps {
  room: DetailedVotingRoom
  hideModalFunction?: (val: boolean) => void
}

export const CardVote = ({ room, hideModalFunction }: CardVoteProps) => {
  const { account, isActive } = useAccount()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(voteTypes['Add'].for)
  const [sentVotesFor, setSentVotesFor] = useState(0)
  const [sentVotesAgainst, setSentVotesAgainst] = useState(0)
  const [voted, setVoted] = useState<null | boolean>(null)
  const [verificationPeriod, setVerificationPeriod] = useState(false)
  const [finalizationPeriod, setFinalizationPeriod] = useState(false)
  const [loading, setLoading] = useState(false)
  const { finalizeVotingLimit, batchCount, batchDoneCount, beingEvaluated, beingFinalized, batchedVotes } =
    useVotingBatches({ room })

  useEffect(() => {
    setVoted(null)
  }, [account])

  const { votingContract } = useContracts()
  const vote = voting.fromRoom(room)
  const voteConstants = voteTypes[vote.type]
  const castVotes = useContractFunction(votingContract, 'castVotes')
  const finalizeVoting = useContractFunction(votingContract, 'finalizeVotingRoom')

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowVoteModal(false)
  }

  const hideConfirm = (val: boolean) => {
    if (hideModalFunction) {
      hideModalFunction(false)
    }
    setShowConfirmModal(val)
  }

  useEffect(() => {
    const checkPeriod = () => {
      const now = Date.now() / 1000
      const verificationStarted = room.verificationStartAt.toNumber() - now < 0
      const verificationEnded = room.endAt.toNumber() - now < 0
      const verificationPeriod = verificationStarted && !verificationEnded
      const finalizationPeriod = verificationStarted && verificationEnded
      setVerificationPeriod(verificationPeriod)
      setFinalizationPeriod(finalizationPeriod)
    }

    checkPeriod()

    const timer = setInterval(checkPeriod, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (finalizeVoting.state.status === 'Success' || castVotes.state.status === 'Success') {
      history.go(0)
    }
  }, [finalizeVoting.state.status, castVotes.state.status])

  const winner = verificationPeriod ? 0 : getVotingWinner(vote)

  const {
    votesFor: votesForUnverified,
    votesAgainst: votesAgainstUnverified,
    voters,
  } = useUnverifiedVotes(vote.ID, room.verificationStartAt, room.startAt)

  const includeUnverifiedVotes = !winner || verificationPeriod

  const votesFor = !includeUnverifiedVotes
    ? vote.voteFor.toNumber()
    : vote.voteFor.toNumber() + votesForUnverified + sentVotesFor
  const votesAgainst = !includeUnverifiedVotes
    ? vote.voteAgainst.toNumber()
    : vote.voteAgainst.toNumber() + votesAgainstUnverified + sentVotesAgainst

  /* note: the `voted` state is not shared after a proposing removal and navigatig from /directory route,
    nor on changing routes and refreshing based on window width */
  const canVote = voted ? false : Boolean(account && !voters.includes(account))

  if (!vote) {
    return <CardVoteBlock />
  }
  return (
    <CardVoteBlock>
      {showVoteModal && (
        <Modal heading={`${vote?.type} ${room.details.name}?`} setShowModal={setShowVoteModal}>
          <VoteModal
            vote={vote}
            room={room.roomNumber}
            selectedVote={selectedVoted}
            proposingAmount={proposingAmount}
            setShowConfirmModal={setNext}
            setProposingAmount={setProposingAmount}
            onSend={(proposingAmount: number) => {
              setVoted(true)

              if (selectedVoted.type === 0) {
                setSentVotesAgainst(sentVotesAgainst + proposingAmount)
              }

              if (selectedVoted.type === 1) {
                setSentVotesFor(sentVotesFor + proposingAmount)
              }
            }}
            fullRoom={room}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
          />{' '}
        </Modal>
      )}
      {showConfirmModal && (
        <Modal setShowModal={hideConfirm}>
          <VoteAnimatedModal
            vote={vote}
            community={room.details}
            selectedVote={selectedVoted}
            setShowModal={hideConfirm}
            proposingAmount={proposingAmount}
            votesFor={votesFor}
            votesAgainst={votesAgainst}
          />
        </Modal>
      )}

      {verificationPeriod && (
        <CardHeadingEndedVote>
          Verification period in progress, please verify your vote.{' '}
          {batchCount > 1 && (
            <>
              <br />({beingEvaluated ? batchDoneCount : 0}/{batchCount} verified)
            </>
          )}
        </CardHeadingEndedVote>
      )}

      {finalizationPeriod ? (
        <CardHeadingEndedVote>
          SNT holders have decided <b>{winner == 1 ? voteConstants.against.verb : voteConstants.for.verb}</b> this
          community to the directory!
        </CardHeadingEndedVote>
      ) : hideModalFunction || window.innerWidth < 769 ? (
        <CardHeading />
      ) : (
        !verificationPeriod && <CardHeading>{voteConstants.question}</CardHeading>
      )}

      <div>
        <VoteChart
          vote={vote}
          voteWinner={winner}
          tabletMode={hideModalFunction}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
        />
        {verificationPeriod && (
          <VoteBtnFinal
            onClick={async () => {
              setLoading(true)
              await castVotes.send(batchedVotes)

              setSentVotesFor(0)
              setSentVotesAgainst(0)
              setLoading(false)
            }}
            disabled={!account || loading}
          >
            {loading ? 'Waiting...' : 'Verify votes'}
          </VoteBtnFinal>
        )}
        {finalizationPeriod && (
          <VoteBtnFinal
            onClick={() => finalizeVoting.send(room.roomNumber, finalizeVotingLimit < 1 ? 1 : finalizeVotingLimit)}
            disabled={!isActive}
          >
            <>
              Finalize the vote <span>✍️</span>
              <br />
              {batchCount > 1 && (
                <>
                  ({beingFinalized ? batchDoneCount : 0}/{batchCount} finalized)
                </>
              )}
            </>
          </VoteBtnFinal>
        )}

        {!verificationPeriod && !finalizationPeriod && (
          <VotesBtns>
            <VoteBtn
              disabled={!canVote || !isActive}
              onClick={() => {
                setSelectedVoted(voteConstants.against)
                setShowVoteModal(true)
              }}
            >
              {voteConstants.against.text} <span>{voteConstants.against.icon}</span>
            </VoteBtn>
            <VoteBtn
              disabled={!canVote || !isActive}
              onClick={() => {
                setSelectedVoted(voteConstants.for)
                setShowVoteModal(true)
              }}
            >
              {voteConstants.for.text} <span>{voteConstants.for.icon}</span>
            </VoteBtn>
          </VotesBtns>
        )}
      </div>
    </CardVoteBlock>
  )
}

export const CardHeadingEndedVote = styled.p`
  max-width: 290px;
  align-self: center;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 18px;
  text-align: center;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 24px;
  }
`

const VoteBtnFinal = styled(VoteBtn)`
  width: 100%;

  @media (max-width: 600px) {
    margin-top: 24px;
  }
`
