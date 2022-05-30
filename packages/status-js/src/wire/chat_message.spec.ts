import {
  AudioMessage_AudioType,
  ChatMessage_ContentType,
} from '../proto/communities/v1/chat_message'
import { ImageType } from '../proto/communities/v1/enums'
import { ChatMessage, ContentType } from './chat_message'

import type { AudioContent, ImageContent, StickerContent } from './chat_message'

describe('Chat Message', () => {
  test('Encode & decode Image message', () => {
    const payload = Buffer.from([1, 1])

    const imageContent: ImageContent = {
      image: payload,
      imageType: ImageType.IMAGE_TYPE_PNG,
      contentType: ContentType.Image,
    }

    const message = ChatMessage.createMessage(1, 1, 'chat-id', imageContent)

    const buf = message.encode()
    const dec = ChatMessage.decode(buf)

    expect(dec.contentType).toEqual(ChatMessage_ContentType.CONTENT_TYPE_IMAGE)
    expect(dec.image?.payload?.toString()).toEqual(payload.toString())
    expect(dec.image?.type).toEqual(ImageType.IMAGE_TYPE_PNG)
  })

  test('Encode & decode Audio message', () => {
    const payload = Buffer.from([1, 1])
    const durationMs = 12345

    const audioContent: AudioContent = {
      audio: payload,
      audioType: AudioMessage_AudioType.AUDIO_TYPE_AAC,
      durationMs,
      contentType: ContentType.Audio,
    }

    const message = ChatMessage.createMessage(1, 1, 'chat-id', audioContent)

    const buf = message.encode()
    const dec = ChatMessage.decode(buf)

    expect(dec.contentType).toEqual(ChatMessage_ContentType.CONTENT_TYPE_AUDIO)
    expect(dec.audio?.payload?.toString()).toEqual(payload.toString())
    expect(dec.audio?.type).toEqual(ImageType.IMAGE_TYPE_PNG)
    expect(dec.audio?.durationMs).toEqual(durationMs)
  })

  test('Encode & decode Sticker message', () => {
    const hash = 'deadbeef'
    const pack = 12345

    const stickerContent: StickerContent = {
      hash,
      pack,
      contentType: ContentType.Sticker,
    }

    const message = ChatMessage.createMessage(1, 1, 'chat-id', stickerContent)

    const buf = message.encode()
    const dec = ChatMessage.decode(buf)

    expect(dec.contentType).toEqual(
      ChatMessage_ContentType.CONTENT_TYPE_STICKER
    )
    expect(dec.sticker?.hash).toEqual(hash)
    expect(dec.sticker?.pack).toEqual(pack)
  })
})
