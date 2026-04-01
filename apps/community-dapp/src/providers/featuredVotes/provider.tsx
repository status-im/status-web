import React, { ReactNode, createContext, useContext, useState, useEffect, useRef } from 'react'
import { useWaku } from '../waku/provider'
import { useContractCall, useEthers } from '@usedapp/core'
import { config } from '../../config'
import { useContracts } from '../../hooks/useContracts'
import {
  filterVerifiedFeaturesVotes,
  receiveWakuFeature,
  getAlreadyVotedList,
  AlreadyVoted,
} from '../../helpers/receiveWakuFeature'
import { FeaturedVoting } from '../../models/smartContract'
import { useTypedFeatureVote } from '../../hooks/useTypedFeatureVote'

type FeaturedVotesContext = {
  votes: any | null
  votesToSend: any | null
  alreadyVoted: AlreadyVoted
  activeVoting: FeaturedVoting | null
}

const FeaturedVotesContext = createContext<FeaturedVotesContext | null>(null)

interface FeaturedVotesProviderProps {
  children: ReactNode
}

export function FeaturedVotesProvider({ children }: FeaturedVotesProviderProps) {
  const { featuredVotingContract } = useContracts()
  const [votes, setVotes] = useState<any | null>(null)
  const [votesToSend, setVotesToSend] = useState<any | null>(null)
  const [alreadyVoted, setAlreadyVoted] = useState<AlreadyVoted>({})
  const [activeVoting, setActiveVoting] = useState<FeaturedVoting | null>(null)
  const { waku } = useWaku()
  const { chainId } = useEthers()
  const { getTypedFeatureVote } = useTypedFeatureVote()
  const alreadyVotedRef = useRef<AlreadyVoted>({})
  const getTypedFeatureVoteRef = useRef(getTypedFeatureVote)

  useEffect(() => {
    alreadyVotedRef.current = alreadyVoted
  }, [alreadyVoted])

  useEffect(() => {
    getTypedFeatureVoteRef.current = getTypedFeatureVote
  }, [getTypedFeatureVote])

  const [featuredVotings] =
    useContractCall({
      abi: featuredVotingContract.interface,
      address: featuredVotingContract.address,
      method: 'getVotings',
      args: [],
    }) ?? []

  useEffect(() => {
    if (featuredVotings) {
      const lastVoting: FeaturedVoting = featuredVotings[featuredVotings.length - 1]

      if (lastVoting && (!lastVoting.evaluated || !lastVoting.finalized)) {
        setActiveVoting(lastVoting)
      }
    }
  }, [featuredVotings])

  useEffect(() => {
    const loadFeatureVotes = async () => {
      if (chainId && waku && activeVoting) {
        const { votes, votesToSend } = await receiveWakuFeature(waku, config.wakuConfig.wakuFeatureTopic, activeVoting)
        const verifiedVotes = await filterVerifiedFeaturesVotes(
          votesToSend,
          alreadyVotedRef.current,
          getTypedFeatureVoteRef.current,
        )
        const alreadyVotedList = await getAlreadyVotedList(votes)

        setAlreadyVoted(alreadyVotedList)
        setVotesToSend(verifiedVotes)
        setVotes(votes)
      }
    }

    loadFeatureVotes()

    const task = setInterval(loadFeatureVotes, 10000)
    return () => clearInterval(task)
  }, [waku, chainId, activeVoting])

  return (
    <FeaturedVotesContext.Provider value={{ votes, votesToSend, alreadyVoted, activeVoting }}>
      {children}
    </FeaturedVotesContext.Provider>
  )
}

export function useFeaturedVotes() {
  const context = useContext(FeaturedVotesContext)

  if (!context) {
    throw new Error('useFeaturedVotes must be used within a FeaturedVotesProvider')
  }

  return context
}
