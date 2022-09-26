// todo?: rename to notifications (center?), inbox, or keep same as other platforms

import type { ChatMessage } from './chat'
import type { Client } from './client'

// todo?: rename to Activity
type Notification = {
  type: 'message'
  value: ChatMessage
  isMention?: boolean
  isReply?: boolean
}

export type ActivityCenterLatest = {
  notifications: Notification[]
  // todo?: rename count to mentionsAndRepliesCount, mentionsCount
  unreadChats: Map<string, { count: number }>
  totalCount: number
}

export class ActivityCenter {
  #client: Client

  #notifications: Set<Notification>
  #callbacks: Set<(latest: ActivityCenterLatest) => void>

  constructor(client: Client) {
    this.#client = client

    this.#notifications = new Set([
      {
        type: 'message',
        value: {
          clock: 1661450563108n,
          timestamp: 1661450563108n,
          text: 'mention @0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735 ',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133202e25f2-48ac-4e2d-8fd0-aa5971383134',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x5878fa9b0b6710387090099ae2134fe4a24746d14f5ddcd2cd41a78ffaf5b7ea',
          chatUuid: '202e25f2-48ac-4e2d-8fd0-aa5971383134',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test',
        },
        isMention: true,
        isReply: false,
      },
      {
        type: 'message',
        value: {
          clock: 1661450601974n,
          timestamp: 1661450601974n,
          text: 'reply and mention @0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735 ',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0xb62144d2f43be986c8794a3f161cf7543ba0062aee51c2933e3b433847eeea84',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: true,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450563108n,
          timestamp: 1661450563108n,
          text: 'mention @0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735 ',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x5878fa9b0b6710387090099ae2134fe4a24746d14f5ddcd2cd41a78ffaf5b7e9',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
        },
        isMention: true,
        isReply: false,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde27',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450544440n,
          timestamp: 1661450544440n,
          text: 'message',
          responseTo: '',
          ensName: '',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          sticker: {
            hash: '',
            pack: 0,
          },
          image: {
            payload: new Uint8Array([]),
            type: 'JPEG',
          },
          audio: {
            payload: new Uint8Array([]),
            type: 'AAC',
            durationMs: 0n,
          },
          community: new Uint8Array([]),
          grant: new Uint8Array([]),
          displayName: '',
          messageId:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            chatKey:
              '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
            username: 'General Total Rattlesnake',
            colorHash: [
              [2, 27],
              [2, 8],
              [2, 18],
              [4, 15],
              [5, 14],
              [2, 0],
              [2, 7],
              [3, 22],
              [3, 31],
              [3, 30],
              [1, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
        },
        isMention: false,
        isReply: false,
      },
      // fake
      {
        type: 'message',
        value: {
          clock: 1661450563108n,
          timestamp: 1661450563108n,
          text: 'message',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513384950b52-3a44-4bff-a48c-4bdfc09731f9',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x5978fa9b0b6710387090099ae2134fe4a24746d14f5ddcd2cd41a78ffaf5b7e9', // dupe 0x5878fa9b0b6710387090099ae2134fe4a24746d14f5ddcd2cd41a78ffaf5b7e9
          chatUuid: '84950b52-3a44-4bff-a48c-4bdfc09731f9',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
        },
        isMention: false,
        isReply: false,
      },
      // dupes
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde271',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde272',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde273',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde274',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde275',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde276',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
      {
        type: 'message',
        value: {
          clock: 1661450556669n,
          timestamp: 1661450556669n,
          text: 'reply',
          responseTo:
            '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
          chatId:
            '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          messageType: 'COMMUNITY_CHAT',
          contentType: 'TEXT_PLAIN',
          messageId:
            '0x2cc1e3df5865a73855ae8f2e1c77ecd4656cb176209a6efd6d9676c14fbcde277',
          chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
          pinned: false,
          signer:
            '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
          reactions: {
            THUMBS_UP: {},
            THUMBS_DOWN: {},
            LOVE: {},
            LAUGH: {},
            SAD: {},
            ANGRY: {},
          },
          member: {
            publicKey:
              '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811',
            chatKey:
              '0x03ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b5',
            username: 'Bumpy Absolute Crustacean',
            colorHash: [
              [1, 26],
              [4, 1],
              [5, 22],
              [4, 19],
              [2, 30],
              [5, 19],
              [1, 3],
              [3, 19],
              [5, 13],
              [3, 18],
              [5, 7],
            ],
          },
          communityDisplayName: 'Boring community',
          chatDisplayName: 'test-messages',
          responseToMessage: {
            clock: 1661450544440n,
            timestamp: 1661450544440n,
            text: 'message',
            responseTo: '',
            ensName: '',
            chatId:
              '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513330804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            messageType: 'COMMUNITY_CHAT',
            contentType: 'TEXT_PLAIN',
            sticker: {
              hash: '',
              pack: 0,
            },
            image: {
              payload: new Uint8Array([]),
              type: 'JPEG',
            },
            audio: {
              payload: new Uint8Array([]),
              type: 'AAC',
              durationMs: 0n,
            },
            community: new Uint8Array([]),
            grant: new Uint8Array([]),
            displayName: '',
            messageId:
              '0xae46bc16ffc0d9ffe350f0d4f1027a581fecc7f3b43d8957e8ea24c6d8114e59',
            chatUuid: '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3',
            pinned: false,
            signer:
              '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
            reactions: {
              THUMBS_UP: {},
              THUMBS_DOWN: {},
              LOVE: {},
              LAUGH: {},
              SAD: {},
              ANGRY: {},
            },
            member: {
              publicKey:
                '0x0450536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3ff3eff2633b7fd4bc409ec6e803e0e7eb25e33fa76965fa75a11f0266640a735',
              chatKey:
                '0x0350536264938f1a030e3df57dbbb1c3b5be2b48c6089f4eeb5ffeac89456c78a3',
              username: 'General Total Rattlesnake',
              colorHash: [
                [2, 27],
                [2, 8],
                [2, 18],
                [4, 15],
                [5, 14],
                [2, 0],
                [2, 7],
                [3, 22],
                [3, 31],
                [3, 30],
                [1, 7],
              ],
            },
          },
        },
        isMention: false,
        isReply: true,
      },
    ])
    this.#callbacks = new Set()
  }

  public getLatest = (): ActivityCenterLatest => {
    const notifications: Notification[] = []
    const unreadChats: Map<string, { count: number }> = new Map()
    let totalCount = 0

    for (const notification of this.#notifications.values()) {
      if (notification.type === 'message') {
        const chatUuid = notification.value.chatUuid

        const chat = unreadChats.get(chatUuid)
        let count = chat?.count ?? 0

        const isMention = notification.isMention || notification.isReply
        if (isMention) {
          count++
          totalCount++
        }

        if (chat) {
          chat.count = count
        } else {
          unreadChats.set(chatUuid, { count })
        }

        if (!isMention) {
          continue
        }
      }

      notifications.push(notification)
    }

    notifications.sort((a, b) => {
      if (a.value.clock > b.value.clock) {
        return -1
      }

      if (a.value.clock < b.value.clock) {
        return 1
      }

      return 0
    })

    return {
      // todo?: group notifications (all, mentions, replies)
      notifications,
      unreadChats,
      totalCount,
    }
  }

  public addMessageNotification = (
    newMessage: ChatMessage,
    referencedMessage?: ChatMessage
  ) => {
    /* todo?: set unread chats here
    if not client emit and return
    if not mention or reply emit and return
    else add notification emit and return */

    let isMention: boolean | undefined
    let isReply: boolean | undefined

    if (this.#client.account) {
      const publicKey = `0x${this.#client.account.publicKey}`

      isMention = newMessage.text.includes(publicKey)
      isReply = referencedMessage?.signer === publicKey
    }

    // todo?: getLatest on login
    this.#notifications.add({
      type: 'message',
      value: newMessage,
      isMention,
      isReply,
    })

    this.emitLatest()
  }

  // todo?: mark as read
  // markAllAsRead = () => {}

  // markAsRead = (category, ids) => {}

  /**
   * Removes all notifications.
   */
  removeNotifications = (category: 'all' | 'mentions' | 'replies') => {
    if (category === 'all') {
      for (const notification of this.#notifications) {
        const { isMention, isReply } = notification

        if (!(isMention || isReply)) {
          continue
        }

        this.#notifications.delete(notification)
      }
    } else if (category === 'mentions') {
      this.#notifications.forEach(notification => {
        if (notification.isMention) {
          this.#notifications.delete(notification)
        }
      })
    } else if (category === 'replies') {
      this.#notifications.forEach(notification => {
        if (notification.isReply) {
          this.#notifications.delete(notification)
        }
      })
    }

    this.emitLatest()
  }

  /**
   * Removes chat message notifications from the Activity Center. For example,
   * on only opening or after scrolling to the end.
   */
  public removeChatNotifications = (chatUuid: string) => {
    // todo?: add chatUuid to "readChats" Set instead and resolve in getNotifications
    // triggered by following emit, and clear the set afterwards
    for (const notification of this.#notifications) {
      if (notification.type !== 'message') {
        continue
      }

      if (notification.value.chatUuid === chatUuid) {
        this.#notifications.delete(notification)
      }
    }

    this.emitLatest()
  }

  private emitLatest = () => {
    const latest = this.getLatest()

    this.#callbacks.forEach(callback => callback(latest))
  }

  public onChange = (callback: (latest: ActivityCenterLatest) => void) => {
    this.#callbacks.add(callback)

    return () => {
      this.#callbacks.delete(callback)
    }
  }
}
