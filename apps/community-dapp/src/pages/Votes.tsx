import React from 'react'
import { VotingCards } from '../components/votes/VotingCards'
import { VotesInfo } from '../components/votes/VotesInfo'

export function Votes() {
  return (
    <div>
      <VotesInfo />
      <VotingCards />
    </div>
  )
}
