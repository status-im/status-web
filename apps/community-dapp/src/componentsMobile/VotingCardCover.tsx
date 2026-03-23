import React from 'react'
import { DetailedVotingRoom } from '../models/smartContract'
import { Card, CardCommunityWrap } from '../components/Card'
import { CardCommunity } from '../components/card/CardCommunity'
import voting from '../helpers/voting'
import { getVotingWinner } from '../helpers/voting'
import { VoteChart } from '../components/votes/VoteChart'
import { useHistory } from 'react-router'
import { useRoomAggregateVotes } from '../hooks/useRoomAggregateVotes'
import { useUnverifiedVotes } from '../hooks/useUnverifiedVotes'

interface VotingCardCoverProps {
  room: DetailedVotingRoom
}

export function VotingCardCover({ room }: VotingCardCoverProps) {
  const vote = voting.fromRoom(room)

  room = useRoomAggregateVotes(room, false)
  const history = useHistory()

  const now = Date.now() / 1000
  const verificationStarted = room.verificationStartAt.toNumber() - now < 0
  const verificationEnded = room.endAt.toNumber() - now < 0
  const verificationPeriod = verificationStarted && !verificationEnded

  const winner = verificationPeriod ? 0 : getVotingWinner(vote)

  const { votesFor: votesForUnverified, votesAgainst: votesAgainstUnverified } = useUnverifiedVotes(
    vote.ID,
    room.verificationStartAt,
    room.startAt,
  )

  const includeUnverifiedVotes = !winner || verificationPeriod

  const votesFor = !includeUnverifiedVotes ? vote.voteFor.toNumber() : vote.voteFor.toNumber() + votesForUnverified
  const votesAgainst = !includeUnverifiedVotes
    ? vote.voteAgainst.toNumber()
    : vote.voteAgainst.toNumber() + votesAgainstUnverified

  return (
    <Card onClick={() => history.push(`/votingRoom/${room.roomNumber.toString()}`)}>
      <CardCommunityWrap>
        {' '}
        <CardCommunity
          community={room.details}
          customHeading={`${room.voteType == 1 ? 'Add' : 'Remove'} ${room.details.name}?`}
          customStyle={true}
        />
      </CardCommunityWrap>
      <VoteChart vote={vote} voteWinner={winner} votesFor={votesFor} votesAgainst={votesAgainst} />
    </Card>
  )
}
