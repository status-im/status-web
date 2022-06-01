import debug from 'debug'
import { Protocols } from 'js-waku'

import { Identity } from './identity'
import { Messenger } from './messenger'
import { bufToHex } from './utils'
import { ContentType } from './wire/chat_message'

import type { ApplicationMetadataMessage } from './wire/application_metadata_message'

const testChatId = 'test-chat-id'

const dbg = debug('communities:test:messenger')

describe('Messenger', () => {
  let messengerAlice: Messenger
  let messengerBob: Messenger
  let identityAlice: Identity
  let identityBob: Identity

  beforeEach(async () => {
    dbg('Generate keys')
    identityAlice = Identity.generate()
    identityBob = Identity.generate()

    // todo: mock/provide WakuMock
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

  test('Sends & Receive public chat messages', async () => {
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

    expect(receivedMessage.chatMessage?.text).toEqual(text)
  })

  test('public chat messages have signers', async () => {
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(bufToHex(receivedMessage.signer!)).toEqual(
      bufToHex(identityAlice.publicKey)
    )
  })

  afterEach(async () => {
    await messengerAlice.stop()
    await messengerBob.stop()
  })
})
