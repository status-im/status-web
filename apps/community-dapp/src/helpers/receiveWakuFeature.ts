import { receiveWakuFeatureMsg } from './wakuFeature'
import lodash from 'lodash'
import { BigNumber, utils } from 'ethers'
import { recoverAddress } from './ethMessage'

import type { LightNode } from '@waku/interfaces'
import { FeaturedVoting } from '../models/smartContract'
import { TypedFeature } from '../models/TypedData'
import { WakuFeatureData } from '../models/waku'

type CommunityFeatureVote = {
  [voter: string]: BigNumber
}

type CommunityFeatureVotes = {
  sum: BigNumber
  votes: CommunityFeatureVote
}

type CommunitiesFeatureVotes = {
  [community: string]: CommunityFeatureVotes
}

export type AlreadyVoted = {
  [community: string]: string[]
}

export function getContractParameters(
  address: string,
  community: string,
  sntAmount: number,
  timestamp: number,
): [string, string, BigNumber, BigNumber] {
  return [address, community, BigNumber.from(sntAmount), BigNumber.from(timestamp)]
}

function sumVotes(map: CommunitiesFeatureVotes) {
  for (const [publicKey, community] of Object.entries(map)) {
    map[publicKey]['sum'] = BigNumber.from(0)
    for (const votes of Object.entries(community['votes'])) {
      map[publicKey]['sum'] = map[publicKey]['sum'].add(votes[1])
    }
  }
}

export async function receiveWakuFeature(waku: LightNode | undefined, topic: string, activeVoting: FeaturedVoting) {
  const messages = await receiveWakuFeatureMsg(waku, topic)
  const featureVotes: CommunitiesFeatureVotes = {}
  const validatedMessages = []
  const { merge } = lodash

  if (messages && messages?.length > 0) {
    messages.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

    for (const message of messages) {
      const messageTimestamp = message.timestamp
      const validatedMessage =
        messageTimestamp < activeVoting.verificationStartAt.toNumber() &&
        messageTimestamp > activeVoting.startAt.toNumber()

      if (!validatedMessage) {
        break
      } else {
        validatedMessages.push(message)
      }
    }

    validatedMessages?.forEach((message) => {
      merge(featureVotes, { [message.community]: { votes: { [message.voter]: message.sntAmount } } })
    })

    sumVotes(featureVotes)
  }

  return { votes: featureVotes, votesToSend: validatedMessages }
}

// note: copy of filterVerifiedFeaturesVotes()
export function mapFeaturesVotes(
  messages: WakuFeatureData[] | undefined,
  getTypedData: (data: [string, string, BigNumber, BigNumber]) => TypedFeature,
) {
  if (!messages) {
    return []
  }
  const votes: [string, string, BigNumber, BigNumber, string, string][] = []

  messages.forEach((msg) => {
    const params = getContractParameters(msg.voter, msg.community, msg.sntAmount.toNumber(), msg.timestamp)

    if (utils.getAddress(recoverAddress(getTypedData(params), msg.sign)) == msg.voter) {
      const splitSig = utils.splitSignature(msg.sign)
      votes.push([...params, splitSig.r, splitSig._vs])
    }
  })
  return votes
}

export async function filterVerifiedFeaturesVotes(
  messages: WakuFeatureData[] | undefined,
  alreadyVoted: AlreadyVoted,
  getTypedData: (data: [string, string, BigNumber, BigNumber]) => TypedFeature,
) {
  if (!messages) {
    return []
  }
  const verified: [string, string, BigNumber, BigNumber, string, string][] = []

  messages.forEach((msg) => {
    const params = getContractParameters(msg.voter, msg.community, msg.sntAmount.toNumber(), msg.timestamp)

    if (utils.getAddress(recoverAddress(getTypedData(params), msg.sign)) == msg.voter) {
      const addressInVerified = verified.find((el) => el[0] === msg.voter)
      const addressInVoted =
        msg.community in alreadyVoted && alreadyVoted[msg.community].find((el: string) => el === msg.voter)
      const splitSig = utils.splitSignature(msg.sign)
      if (!addressInVerified && !addressInVoted) {
        verified.push([...params, splitSig.r, splitSig._vs])
      }
    }
  })
  return verified
}

export function getAlreadyVotedList(votes: CommunitiesFeatureVotes) {
  const { merge } = lodash
  const alreadyVoted: AlreadyVoted = {}
  for (const [publicKey, community] of Object.entries(votes)) {
    for (const [voter] of Object.entries(community['votes'])) {
      if (!(publicKey in alreadyVoted)) {
        merge(alreadyVoted, { [publicKey]: [voter] })
      } else {
        alreadyVoted[publicKey].push(voter)
      }
    }
  }
  return alreadyVoted
}
