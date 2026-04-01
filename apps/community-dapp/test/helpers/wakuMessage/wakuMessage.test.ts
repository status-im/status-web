import { expect } from 'chai'
import wakuMessage, { decodeWakuVotes } from '../../../src/helpers/wakuVote'
import { decodeWakuFeatures } from '../../../src/helpers/wakuFeature'
import { JsonRpcSigner } from '@ethersproject/providers'
import proto from '../../../src/helpers/loadProtons'
import { BigNumber, utils } from 'ethers'
import { createEncoder } from '@waku/core'

const proto2 = {
  WakuVote: {
    encode: () => new Uint8Array([1, 2, 3]),
  },
  WakuFeature: {
    encode: () => new Uint8Array([1, 2, 3]),
  },
} as any

describe('wakuMessage', () => {
  const alice = {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    getAddress: async () => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    provider: {
      send: async () => '0x1234',
    },
  } as any
  const bob = {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    getAddress: async () => '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    provider: {
      send: async () => '0x5678',
    },
  } as any

  describe('decode waku vote', () => {
    it('success', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })

      const payload = proto.WakuVote.encode({
        address: '0x0',
        timestamp: 1,
        roomID: 2n,
        sign: '0x1234',
        sntAmount: utils.arrayify(BigNumber.from(123)),
        vote: 'For',
      })
      const msg = await encoder.toProtoObj({ payload })

      const payload2 = proto.WakuVote.encode({
        address: '0x01',
        timestamp: 1,
        roomID: 2n,
        sign: '0xabc1234',
        sntAmount: utils.arrayify(BigNumber.from(321)),
        vote: 'Against',
      })
      const msg2 = await encoder.toProtoObj({ payload: payload2 })

      const [data, data2] = decodeWakuVotes([msg, msg2]) ?? []

      expect(data).to.not.be.undefined
      expect(data?.address).to.eq('0x0')
      expect(data?.timestamp).to.eq(1)
      expect(data?.roomID).to.eq(2)
      expect(data?.sign).to.eq('0x1234')
      expect(data?.sntAmount).to.deep.eq(BigNumber.from(123))
      expect(data?.vote).to.eq('For')

      expect(data2).to.not.be.undefined
      expect(data2?.address).to.eq('0x01')
      expect(data2?.timestamp).to.eq(1)
      expect(data2?.roomID).to.eq(2)
      expect(data2?.sign).to.eq('0xabc1234')
      expect(data2?.sntAmount).to.deep.eq(BigNumber.from(321))
      expect(data2?.vote).to.eq('Against')
    })
  })

  it('empty', async () => {
    expect(decodeWakuVotes([])).to.deep.eq([])
  })

  it('wrong data', async () => {
    const encoder = createEncoder({
      contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
      routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
    })

    const payload = proto2.WakuVote.encode({
      address: '0x0',
    })
    const msg = await encoder.toProtoObj({ payload })

    const payload2 = proto.WakuVote.encode({
      address: '0x01',
      timestamp: 1,
      roomID: 2n,
      sign: '0xabc1234',
      sntAmount: utils.arrayify(BigNumber.from(321)),
      vote: 'Against',
    })
    const msg2 = await encoder.toProtoObj({ payload: payload2 })

    const response = decodeWakuVotes([msg, msg2]) ?? []

    expect(response.length).to.eq(1)
    const data = response[0]
    expect(data).to.not.be.undefined
    expect(data?.address).to.eq('0x01')
    expect(data?.timestamp).to.eq(1)
    expect(data?.roomID).to.eq(2)
    expect(data?.sign).to.eq('0xabc1234')
    expect(data?.sntAmount).to.deep.eq(BigNumber.from(321))
    expect(data?.vote).to.eq('Against')
  })

  describe('decode waku feature', () => {
    it('success', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })

      const payload = proto2.WakuFeature.encode({
        voter: '0x0',
      })
      const msg = await encoder.toProtoObj({ payload: payload })
      const payload2 = proto.WakuFeature.encode({
        voter: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
        sign: '0x1234abc',
        sntAmount: utils.arrayify(BigNumber.from('0x10')),
        community: '0x1234',
        timestamp: 1,
      })
      const msg2 = await encoder.toProtoObj({ payload: payload2 })

      expect(msg2).to.not.be.undefined
      if (msg2) {
        const response = decodeWakuFeatures([msg, msg2]) ?? []

        expect(response.length).to.eq(1)
        const data = response[0]
        expect(data).to.not.be.undefined
        expect(data?.voter).to.eq('0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff')
        expect(data?.community).to.eq('0x1234')
        expect(data?.sntAmount).to.deep.eq(BigNumber.from('0x10'))
      }
    })

    it('empty', async () => {
      expect(decodeWakuFeatures([])).to.deep.eq([])
    })
  })

  describe('create', () => {
    it('success', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })
      const payload = await wakuMessage.create(
        alice.address,
        alice as unknown as JsonRpcSigner,
        1,
        100,
        1,
        1,
        () => [],
        '0x01',
      )
      const msg = await encoder.toProtoObj({ payload: payload! })

      expect(msg?.payload).to.not.be.undefined
      if (msg?.payload) {
        const obj = proto.WakuVote.decode(msg?.payload)
        expect(obj.address).to.eq(alice.address)
        expect(obj.vote).to.eq('yes')
        expect(BigNumber.from(obj.sntAmount)._hex).to.eq('0x64')
        expect(obj.timestamp).to.eq(1)
        expect(obj.roomID).to.eq(1n)
      }
    })

    it('different payload', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })
      const payload = await wakuMessage.create(
        alice.address,
        alice as unknown as JsonRpcSigner,
        2,
        1000,
        0,
        1,
        () => [],
        '0x01',
      )
      const msg = await encoder.toProtoObj({ payload: payload! })

      expect(msg?.payload).to.not.be.undefined
      if (msg?.payload) {
        const obj = proto.WakuVote.decode(msg?.payload)
        expect(obj.address).to.eq(alice.address)
        expect(obj.vote).to.eq('no')
        expect(BigNumber.from(obj.sntAmount)._hex).to.eq('0x03e8')
        expect(obj.timestamp).to.eq(1)
        expect(obj.roomID).to.eq(2n)
      }
    })

    it('no address', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })
      const payload = await wakuMessage.create(undefined, alice as unknown as JsonRpcSigner, 1, 100, 1, 1, () => [])
      const msg = await encoder.toProtoObj({ payload: payload! })
      expect(msg?.payload).to.be.undefined
    })

    it('no signer', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })
      const payload = await wakuMessage.create(alice.address, undefined, 1, 100, 1, 1, () => [])
      const msg = await encoder.toProtoObj({ payload: payload! })
      expect(msg?.payload).to.be.undefined
    })

    it('different signer', async () => {
      const encoder = createEncoder({
        contentTopic: '/communitiesCuration/test/0.0.6/directory/proto/2',
        routingInfo: { pubsubTopic: '/waku/2/rs/16/32', clusterId: 16, shardId: 32 },
      })
      const payload = await wakuMessage.create(alice.address, bob as unknown as JsonRpcSigner, 1, 100, 1, 1, () => [])
      const msg = await encoder.toProtoObj({ payload: payload! })
      expect(msg?.payload).to.be.undefined
    })
  })
})
