import { expect } from 'chai'
import debug from 'debug'
import { Protocols } from 'js-waku/build/main/lib/waku'

import { Community } from './community'
import { Identity } from './identity'
import { Messenger } from './messenger'
import { bufToHex } from './utils'
import { ApplicationMetadataMessage } from './wire/application_metadata_message'
import { ContentType } from './wire/chat_message'

const testChatId = 'test-chat-id'

const dbg = debug('communities:test:messenger')

describe('Messenger', () => {
  let messengerAlice: Messenger
  let messengerBob: Messenger
  let identityAlice: Identity
  let identityBob: Identity

  beforeEach(async function () {
    this.timeout(20_000)

    dbg('Generate keys')
    identityAlice = Identity.generate()
    identityBob = Identity.generate()

    dbg('Create messengers')
    ;[messengerAlice, messengerBob] = await Promise.all([
      Messenger.create(identityAlice, { bootstrap: {} }),
      Messenger.create(identityBob, {
        bootstrap: {},
        libp2p: { addresses: { listen: ['/ip4/0.0.0.0/tcp/0/ws'] } },
      }),
    ])

    dbg('Connect messengers')
    // Connect both messengers together for test purposes
    messengerAlice.waku.addPeerToAddressBook(
      messengerBob.waku.libp2p.peerId,
      messengerBob.waku.libp2p.multiaddrs
    )

    dbg('Wait for remote peer')
    await Promise.all([
      messengerAlice.waku.waitForRemotePeer([Protocols.Relay]),
      messengerBob.waku.waitForRemotePeer([Protocols.Relay]),
    ])
    dbg('Messengers ready')
  })

  it('Sends & Receive public chat messages', async function () {
    this.timeout(10_000)

    await messengerAlice.joinChatById(testChatId)
    await messengerBob.joinChatById(testChatId)

    const text = 'This is a message.'

    const receivedMessagePromise: Promise<ApplicationMetadataMessage> =
      new Promise(resolve => {
        messengerBob.addObserver(message => {
          resolve(message)
        }, testChatId)
      })

    await messengerAlice.sendMessage(testChatId, {
      text,
      contentType: ContentType.Text,
    })

    const receivedMessage = await receivedMessagePromise

    expect(receivedMessage.chatMessage?.text).to.eq(text)
  })

  it('public chat messages have signers', async function () {
    this.timeout(10_000)

    await messengerAlice.joinChatById(testChatId)
    await messengerBob.joinChatById(testChatId)

    const text = 'This is a message.'

    const receivedMessagePromise: Promise<ApplicationMetadataMessage> =
      new Promise(resolve => {
        messengerBob.addObserver(message => {
          resolve(message)
        }, testChatId)
      })

    await messengerAlice.sendMessage(testChatId, {
      text,
      contentType: ContentType.Text,
    })

    const receivedMessage = await receivedMessagePromise

    expect(bufToHex(receivedMessage.signer!)).to.eq(
      bufToHex(identityAlice.publicKey)
    )
  })

  afterEach(async function () {
    this.timeout(5000)
    await messengerAlice.stop()
    await messengerBob.stop()
  })
})

describe('Messenger [live data]', () => {
  before(function () {
    if (process.env.CI) {
      // Skip live data test in CI
      this.skip()
    }
  })

  let messenger: Messenger
  let identity: Identity

  beforeEach(async function () {
    this.timeout(20_000)

    dbg('Generate keys')
    identity = Identity.generate()

    dbg('Create messengers')

    messenger = await Messenger.create(identity, {
      bootstrap: { default: true },
    })

    dbg('Wait to be connected to a peer')
    await messenger.waku.waitForRemotePeer()
    dbg('Messengers ready')
  })

  it('Receive public chat messages', async function () {
    this.timeout(20_000)

    const community = await Community.instantiateCommunity(
      '0x02cf13719c8b836bebd4e430c497ee38e798a43e4d8c4760c34bbd9bf4f2434d26',
      messenger.waku
    )

    await messenger.joinChats(community.chats.values())

    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const endTime = new Date()

    const chat = Array.from(community.chats.values()).find(
      chat => chat.communityChat?.identity?.displayName === 'Test Chat'
    )

    if (!chat) throw 'Could not find foobar chat'

    console.log(chat)

    await messenger.retrievePreviousMessages(
      chat.id,
      startTime,
      endTime,
      metadata => {
        metadata.forEach(m => {
          console.log('Message', m.chatMessage?.text)
        })
      }
    )
  })

  afterEach(async function () {
    this.timeout(5000)
    await messenger.stop()
  })
})
