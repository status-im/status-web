import React, { useState, useEffect } from 'react'
import { DetailedVotingRoom } from '../../models/smartContract'
import { Card, CardCommunityWrap, CardVoteWrap } from '../Card'
import { CardCommunity } from '../card/CardCommunity'
import { CardVote } from './../card/CardVote/CardVote'

interface VotingCardProps {
  room: DetailedVotingRoom
}

export function VotingCard({ room }: VotingCardProps) {
  const heading = window.innerWidth < 769 ? `Add ${room.details.name}?` : ''
  const [customHeading, setCustomHeading] = useState<string | undefined>(heading)
  const [customStyle, setCustomStyle] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setCustomHeading(`Add ${room.details.name}?`)
        setCustomStyle(true)
      } else {
        setCustomHeading(undefined)
        setCustomStyle(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [window.innerWidth])

  return (
    <Card>
      <CardCommunityWrap>
        {' '}
        <CardCommunity community={room.details} customHeading={customHeading} customStyle={customStyle} />
      </CardCommunityWrap>
      <CardVoteWrap>
        {' '}
        <CardVote room={room} />
      </CardVoteWrap>
    </Card>
  )
}
