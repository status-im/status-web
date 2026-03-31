import { WakuFeatureData } from '../models/waku'
import { utils, BigNumber } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import proto from './loadProtons'
import { createDecoder } from '@waku/core'
import { config } from '../config'

import type { LightNode, IDecodedMessage } from '@waku/interfaces'
import type { DecodedMessage } from '@waku/core'
import { getContractParameters } from './receiveWakuFeature'

const { clusterId, shards } = config.wakuConfig

function decodeWakuFeature(msg: DecodedMessage): WakuFeatureData | undefined {
  try {
    if (!msg.payload) {
      return undefined
    }
    const data = proto.WakuFeature.decode(msg.payload)

    if (data && data.community && data.sign && data.sntAmount && data.timestamp && data.voter) {
      return { ...data, sntAmount: BigNumber.from(data.sntAmount) }
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

export function decodeWakuFeatures(messages: any[] | null) {
  return messages?.map(decodeWakuFeature).filter((e): e is WakuFeatureData => !!e)
}

export async function receiveWakuFeatureMsg(waku: LightNode | undefined, topic: string) {
  if (waku) {
    const messages: DecodedMessage[] = []
    // todo: init decoder once
    await Promise.allSettled(
      shards.map((shardId) =>
        waku.store.queryWithOrderedCallback(
          [createDecoder(topic, { pubsubTopic: `/waku/2/rs/${clusterId}/${shardId}`, clusterId, shardId })],
          (wakuMessage: IDecodedMessage) => {
            messages.push(wakuMessage as DecodedMessage)
          },
        ),
      ),
    )

    return decodeWakuFeatures(messages)
  }
}

export async function createWakuFeatureMsg(
  voter: string | null | undefined,
  signer: JsonRpcSigner | undefined,
  sntAmount: number,
  community: string,
  time: number,
  getTypedData: (data: [string, string, BigNumber, BigNumber]) => any,
) {
  if (!voter || !signer) {
    return undefined
  }
  const provider = signer.provider

  const signerAddress = await signer?.getAddress()
  if (signerAddress != voter) {
    return undefined
  }

  const message = getContractParameters(voter, community, sntAmount, time)
  const data = getTypedData(message)

  const signature = await provider?.send('eth_signTypedData_v3', [voter, JSON.stringify(data)])
  if (signature) {
    const payload = proto.WakuFeature.encode({
      voter,
      sntAmount: utils.arrayify(BigNumber.from(sntAmount)),
      community,
      timestamp: time,
      sign: signature,
    })

    return payload
  }
  return undefined
}
