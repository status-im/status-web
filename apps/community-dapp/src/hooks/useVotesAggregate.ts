import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWaku } from '../providers/waku/provider'
import { useContractCall } from '@usedapp/core'
import { config } from '../config'
import { useContracts } from '../hooks/useContracts'

import wakuMessage from '../helpers/wakuVote'
import { useTypedVote } from './useTypedVote'
import { validateVote } from '../helpers/validateVote'

export function useVotesAggregate(room: number | undefined, verificationStartAt: BigNumber, startAt: BigNumber) {
  const { votingContract } = useContracts()
  const [alreadyVotedList] =
    useContractCall({
      abi: votingContract.interface,
      address: votingContract.address,
      method: 'listRoomVoters',
      args: [room],
    }) ?? []
  const { waku } = useWaku()
  const [votesToSend, setVotesToSend] = useState<any[]>([])
  const [allVotes, setAllVotes] = useState<any[]>([])
  const { getTypedVote } = useTypedVote()

  useEffect(() => {
    const accumulateVotes = async () => {
      if (waku && alreadyVotedList && room) {
        const messages = await wakuMessage.receive(waku, config.wakuConfig.wakuTopic, room)
        const validMessages = messages?.filter((message) => validateVote(message, verificationStartAt, startAt)) ?? []
        const verifiedMessages = wakuMessage.filterVerified(validMessages, alreadyVotedList, getTypedVote)

        setAllVotes(validMessages)
        setVotesToSend(verifiedMessages)
      }
    }
    accumulateVotes()
  }, [waku, room, alreadyVotedList])

  return { votesToSend, allVotes }
}
