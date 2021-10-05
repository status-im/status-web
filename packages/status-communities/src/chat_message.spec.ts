import { expect } from "chai";

import {
  AudioMessage_AudioType,
  ChatMessage_ContentType,
} from "./proto/communities/v1/chat_message";
import { ImageType } from "./proto/communities/v1/enums";
import {
  AudioContent,
  ChatMessage,
  ContentType,
  ImageContent,
  StickerContent,
} from "./wire/chat_message";

describe("Chat Message", () => {
  it("Encode & decode Image message", () => {
    const payload = Buffer.from([1, 1]);

    const imageContent: ImageContent = {
      image: payload,
      imageType: ImageType.IMAGE_TYPE_PNG,
      contentType: ContentType.Image,
    };

    const message = ChatMessage.createMessage(1, 1, "chat-id", imageContent);

    const buf = message.encode();
    const dec = ChatMessage.decode(buf);

    expect(dec.contentType).eq(ChatMessage_ContentType.CONTENT_TYPE_IMAGE);
    expect(dec.image?.payload?.toString()).eq(payload.toString());
    expect(dec.image?.type).eq(ImageType.IMAGE_TYPE_PNG);
  });

  it("Encode & decode Audio message", () => {
    const payload = Buffer.from([1, 1]);
    const durationMs = 12345;

    const audioContent: AudioContent = {
      audio: payload,
      audioType: AudioMessage_AudioType.AUDIO_TYPE_AAC,
      durationMs,
      contentType: ContentType.Audio,
    };

    const message = ChatMessage.createMessage(1, 1, "chat-id", audioContent);

    const buf = message.encode();
    const dec = ChatMessage.decode(buf);

    expect(dec.contentType).eq(ChatMessage_ContentType.CONTENT_TYPE_AUDIO);
    expect(dec.audio?.payload?.toString()).eq(payload.toString());
    expect(dec.audio?.type).eq(ImageType.IMAGE_TYPE_PNG);
    expect(dec.audio?.durationMs).eq(durationMs);
  });

  it("Encode & decode Sticker message", () => {
    const hash = "deadbeef";
    const pack = 12345;

    const stickerContent: StickerContent = {
      hash,
      pack,
      contentType: ContentType.Sticker,
    };

    const message = ChatMessage.createMessage(1, 1, "chat-id", stickerContent);

    const buf = message.encode();
    const dec = ChatMessage.decode(buf);

    expect(dec.contentType).eq(ChatMessage_ContentType.CONTENT_TYPE_STICKER);
    expect(dec.sticker?.hash).eq(hash);
    expect(dec.sticker?.pack).eq(pack);
  });
});
