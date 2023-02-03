/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import { encodeMessage, decodeMessage, message, uint64, string, uint32, enumeration, bytes, bool } from 'protons-runtime'
import type { Codec } from 'protons-runtime'

export interface ChatIdentity {
  clock: bigint
  ensName: string
  images: IdentityImage
  displayName: string
  description: string
  color: string
  emoji: string
  socialLinks: SocialLink[]
  firstMessageTimestamp: number
}

export namespace ChatIdentity {
  export const codec = (): Codec<ChatIdentity> => {
    return message<ChatIdentity>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'ensName', codec: string },
      3: { name: 'images', codec: IdentityImage.codec() },
      4: { name: 'displayName', codec: string },
      5: { name: 'description', codec: string },
      6: { name: 'color', codec: string },
      7: { name: 'emoji', codec: string },
      8: { name: 'socialLinks', codec: SocialLink.codec(), repeats: true },
      9: { name: 'firstMessageTimestamp', codec: uint32 }
    })
  }

  export const encode = (obj: ChatIdentity): Uint8Array => {
    return encodeMessage(obj, ChatIdentity.codec())
  }

  export const decode = (buf: Uint8Array): ChatIdentity => {
    return decodeMessage(buf, ChatIdentity.codec())
  }
}

export interface IdentityImage {
  payload: Uint8Array
  sourceType: IdentityImage.SourceType
  imageType: ImageType
  encryptionKeys: Uint8Array[]
  encrypted: boolean
}

export namespace IdentityImage {
  export enum SourceType {
    UNKNOWN_SOURCE_TYPE = 'UNKNOWN_SOURCE_TYPE',
    RAW_PAYLOAD = 'RAW_PAYLOAD',
    ENS_AVATAR = 'ENS_AVATAR'
  }

  enum __SourceTypeValues {
    UNKNOWN_SOURCE_TYPE = 0,
    RAW_PAYLOAD = 1,
    ENS_AVATAR = 2
  }

  export namespace SourceType {
    export const codec = () => {
      return enumeration<typeof SourceType>(__SourceTypeValues)
    }
  }

  export const codec = (): Codec<IdentityImage> => {
    return message<IdentityImage>({
      1: { name: 'payload', codec: bytes },
      2: { name: 'sourceType', codec: IdentityImage.SourceType.codec() },
      3: { name: 'imageType', codec: ImageType.codec() },
      4: { name: 'encryptionKeys', codec: bytes, repeats: true },
      5: { name: 'encrypted', codec: bool }
    })
  }

  export const encode = (obj: IdentityImage): Uint8Array => {
    return encodeMessage(obj, IdentityImage.codec())
  }

  export const decode = (buf: Uint8Array): IdentityImage => {
    return decodeMessage(buf, IdentityImage.codec())
  }
}

export interface SocialLink {
  text: string
  url: string
}

export namespace SocialLink {
  export const codec = (): Codec<SocialLink> => {
    return message<SocialLink>({
      1: { name: 'text', codec: string },
      2: { name: 'url', codec: string }
    })
  }

  export const encode = (obj: SocialLink): Uint8Array => {
    return encodeMessage(obj, SocialLink.codec())
  }

  export const decode = (buf: Uint8Array): SocialLink => {
    return decodeMessage(buf, SocialLink.codec())
  }
}

export enum MessageType {
  UNKNOWN_MESSAGE_TYPE = 'UNKNOWN_MESSAGE_TYPE',
  ONE_TO_ONE = 'ONE_TO_ONE',
  PUBLIC_GROUP = 'PUBLIC_GROUP',
  PRIVATE_GROUP = 'PRIVATE_GROUP',
  SYSTEM_MESSAGE_PRIVATE_GROUP = 'SYSTEM_MESSAGE_PRIVATE_GROUP',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT',
  SYSTEM_MESSAGE_GAP = 'SYSTEM_MESSAGE_GAP'
}

enum __MessageTypeValues {
  UNKNOWN_MESSAGE_TYPE = 0,
  ONE_TO_ONE = 1,
  PUBLIC_GROUP = 2,
  PRIVATE_GROUP = 3,
  SYSTEM_MESSAGE_PRIVATE_GROUP = 4,
  COMMUNITY_CHAT = 5,
  SYSTEM_MESSAGE_GAP = 6
}

export namespace MessageType {
  export const codec = () => {
    return enumeration<typeof MessageType>(__MessageTypeValues)
  }
}
export enum ImageType {
  UNKNOWN_IMAGE_TYPE = 'UNKNOWN_IMAGE_TYPE',
  PNG = 'PNG',
  JPEG = 'JPEG',
  WEBP = 'WEBP',
  GIF = 'GIF'
}

enum __ImageTypeValues {
  UNKNOWN_IMAGE_TYPE = 0,
  PNG = 1,
  JPEG = 2,
  WEBP = 3,
  GIF = 4
}

export namespace ImageType {
  export const codec = () => {
    return enumeration<typeof ImageType>(__ImageTypeValues)
  }
}
