import { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { recoverAddress } from './ethMessage'
import { utils } from 'ethers'
import proto from './loadProtons'
import { WakuVoteData } from '../models/waku'
import { TypedVote } from '../models/TypedData'
import { createDecoder } from '@waku/core'
import { config } from '../config'

import type { DecodedMessage } from '@waku/core'
import type { LightNode, IDecodedMessage } from '@waku/interfaces'

const { clusterId, shards } = config.wakuConfig

function getContractParameters(
  address: string,
  room: number,
  type: number,
  sntAmount: number,
  timestamp: number,
): [string, BigNumber, BigNumber, BigNumber] {
  return [address, BigNumber.from(room).mul(2).add(type), BigNumber.from(sntAmount), BigNumber.from(timestamp)]
}

export function filterVerifiedVotes(
  messages: WakuVoteData[] | undefined,
  alreadyVoted: string[],
  getTypedData: (data: [string, BigNumber, BigNumber, BigNumber]) => TypedVote,
) {
  if (!messages) {
    return []
  }
  const verified: [string, BigNumber, BigNumber, BigNumber, string, string][] = []

  messages.forEach((msg) => {
    const params = getContractParameters(
      msg.address,
      msg.roomID,
      msg.vote == 'yes' ? 1 : 0,
      msg.sntAmount.toNumber(),
      msg.timestamp,
    )

    if (utils.getAddress(recoverAddress(getTypedData(params), msg.sign)) == msg.address) {
      const addressInVerified = verified.find((el) => el[0] === msg.address)
      const addressInVoted = alreadyVoted.find((el: string) => el === msg.address)
      const splitSig = utils.splitSignature(msg.sign)
      if (!addressInVerified && !addressInVoted) {
        verified.push([...params, splitSig.r, splitSig._vs])
      }
    }
  })
  return verified
}

function decodeWakuVote(msg: DecodedMessage): WakuVoteData | undefined {
  try {
    if (!msg.payload) {
      return undefined
    }
    const data = proto.WakuVote.decode(msg.payload)
    if (data && data.address && data.timestamp && data.roomID && data.sign && data.sntAmount && data.vote) {
      return { ...data, sntAmount: BigNumber.from(data.sntAmount), roomID: Number(data.roomID) }
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

export function decodeWakuVotes(messages: any[] | null) {
  return messages?.map(decodeWakuVote).filter((e): e is WakuVoteData => !!e)
}

// todo?: pass complete topic
export async function receiveWakuVotes(waku: LightNode, topic: string, room: number) {
  const messages: DecodedMessage[] = []
  // todo: init decoder once
  await Promise.allSettled(
    shards.map((shardId) =>
      waku.store.queryWithOrderedCallback(
        [
          createDecoder(topic + room.toString(), {
            pubsubTopic: `/waku/2/rs/${clusterId}/${shardId}`,
            clusterId,
            shardId,
          }),
        ],
        (wakuMessage: IDecodedMessage) => {
          messages.push(wakuMessage as DecodedMessage)
        },
      ),
    ),
  )

  return decodeWakuVotes(messages)
}

export async function createWakuVote(
  account: string | null | undefined,
  signer: JsonRpcSigner | undefined,
  room: number,
  voteAmount: number,
  type: number,
  timestamp: number,
  getTypedData: (data: [string, BigNumber, BigNumber, BigNumber]) => any,
  sig?: string,
) {
  if (!account || !signer) {
    return undefined
  }
  const provider = signer.provider

  const signerAddress = await signer?.getAddress()
  if (signerAddress != account) {
    return undefined
  }

  const message = getContractParameters(account, room, type, voteAmount, timestamp)
  const data = getTypedData(message)

  const signature = sig ? sig : await provider?.send('eth_signTypedData_v3', [account, JSON.stringify(data)])
  if (signature) {
    const payload = proto.WakuVote.encode({
      address: account,
      vote: type == 1 ? 'yes' : 'no',
      sntAmount: utils.arrayify(BigNumber.from(voteAmount)),
      sign: signature,
      timestamp: timestamp,
      roomID: BigInt(room),
    })

    return payload
  }
  return undefined
}

export default { create: createWakuVote, receive: receiveWakuVotes, filterVerified: filterVerifiedVotes }
