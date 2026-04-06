import { useEffect, useState } from 'react'
import { FeaturedVoting } from '../models/smartContract'

type Phase = 'not started' | 'voting' | 'verification' | 'ended' | null

export const useFeaturedVotingState = (featuredVoting: FeaturedVoting | null): Phase => {
  const [votingState, setVotingState] = useState<Phase>(null)

  useEffect(() => {
    const getState = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000)

      const startAt = featuredVoting?.startAt.toNumber() ?? 0
      const verificationStartAt = featuredVoting?.verificationStartAt.toNumber() ?? 0
      const endAt = featuredVoting?.endAt.toNumber() ?? 0

      if (!featuredVoting || featuredVoting === null) {
        setVotingState(null)
      } else if (endAt < currentTimestamp) {
        setVotingState('ended')
      } else if (verificationStartAt < currentTimestamp && endAt > currentTimestamp) {
        setVotingState('verification')
      } else if (verificationStartAt > currentTimestamp) {
        setVotingState('voting')
      } else if (startAt > currentTimestamp) {
        setVotingState('not started')
      }
    }

    const timer = setInterval(() => {
      getState()
    }, 1000)

    getState()

    return () => clearInterval(timer)
  })

  return votingState
}
