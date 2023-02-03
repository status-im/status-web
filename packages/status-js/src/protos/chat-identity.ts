/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message, enumeration } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface ChatIdentity {
  clock: bigint
  ensName: string
  images: Map<string, IdentityImage>
  displayName: string
  description: string
  color: string
  emoji: string
  socialLinks: SocialLink[]
  firstMessageTimestamp: number
}

export namespace ChatIdentity {
  export interface ChatIdentity$imagesEntry {
    key: string
    value: IdentityImage
  }

  export namespace ChatIdentity$imagesEntry {
    let _codec: Codec<ChatIdentity$imagesEntry>

    export const codec = (): Codec<ChatIdentity$imagesEntry> => {
      if (_codec == null) {
        _codec = message<ChatIdentity$imagesEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            IdentityImage.codec().encode(obj.value, w, {
              writeDefaults: false
            })
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length) => {
          const obj: any = {
            key: '',
            value: undefined
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1:
                obj.key = reader.string()
                break
              case 2:
                obj.value = IdentityImage.codec().decode(reader, reader.uint32())
                break
              default:
                reader.skipType(tag & 7)
                break
            }
          }

          return obj
        })
      }

      return _codec
    }

    export const encode = (obj: Partial<ChatIdentity$imagesEntry>): Uint8Array => {
      return encodeMessage(obj, ChatIdentity$imagesEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): ChatIdentity$imagesEntry => {
      return decodeMessage(buf, ChatIdentity$imagesEntry.codec())
    }
  }

  let _codec: Codec<ChatIdentity>

  export const codec = (): Codec<ChatIdentity> => {
    if (_codec == null) {
      _codec = message<ChatIdentity>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.ensName != null && obj.ensName !== '')) {
          w.uint32(18)
          w.string(obj.ensName ?? '')
        }

        if (obj.images != null && obj.images.size !== 0) {
          for (const [key, value] of obj.images.entries()) {
            w.uint32(26)
            ChatIdentity.ChatIdentity$imagesEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.writeDefaults === true || (obj.displayName != null && obj.displayName !== '')) {
          w.uint32(34)
          w.string(obj.displayName ?? '')
        }

        if (opts.writeDefaults === true || (obj.description != null && obj.description !== '')) {
          w.uint32(42)
          w.string(obj.description ?? '')
        }

        if (opts.writeDefaults === true || (obj.color != null && obj.color !== '')) {
          w.uint32(50)
          w.string(obj.color ?? '')
        }

        if (opts.writeDefaults === true || (obj.emoji != null && obj.emoji !== '')) {
          w.uint32(58)
          w.string(obj.emoji ?? '')
        }

        if (obj.socialLinks != null) {
          for (const value of obj.socialLinks) {
            w.uint32(66)
            SocialLink.codec().encode(value, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.writeDefaults === true || (obj.firstMessageTimestamp != null && obj.firstMessageTimestamp !== 0)) {
          w.uint32(72)
          w.uint32(obj.firstMessageTimestamp ?? 0)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          ensName: '',
          images: new Map<string, undefined>(),
          displayName: '',
          description: '',
          color: '',
          emoji: '',
          socialLinks: [],
          firstMessageTimestamp: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.ensName = reader.string()
              break
            case 3: {
              const entry = ChatIdentity.ChatIdentity$imagesEntry.codec().decode(reader, reader.uint32())
              obj.images.set(entry.key, entry.value)
              break
            }
            case 4:
              obj.displayName = reader.string()
              break
            case 5:
              obj.description = reader.string()
              break
            case 6:
              obj.color = reader.string()
              break
            case 7:
              obj.emoji = reader.string()
              break
            case 8:
              obj.socialLinks.push(SocialLink.codec().decode(reader, reader.uint32()))
              break
            case 9:
              obj.firstMessageTimestamp = reader.uint32()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<ChatIdentity>): Uint8Array => {
    return encodeMessage(obj, ChatIdentity.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ChatIdentity => {
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
    export const codec = (): Codec<SourceType> => {
      return enumeration<SourceType>(__SourceTypeValues)
    }
  }

  let _codec: Codec<IdentityImage>

  export const codec = (): Codec<IdentityImage> => {
    if (_codec == null) {
      _codec = message<IdentityImage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.sourceType != null && __SourceTypeValues[obj.sourceType] !== 0)) {
          w.uint32(16)
          IdentityImage.SourceType.codec().encode(obj.sourceType ?? IdentityImage.SourceType.UNKNOWN_SOURCE_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.imageType != null && __ImageTypeValues[obj.imageType] !== 0)) {
          w.uint32(24)
          ImageType.codec().encode(obj.imageType ?? ImageType.UNKNOWN_IMAGE_TYPE, w)
        }

        if (obj.encryptionKeys != null) {
          for (const value of obj.encryptionKeys) {
            w.uint32(34)
            w.bytes(value)
          }
        }

        if (opts.writeDefaults === true || (obj.encrypted != null && obj.encrypted !== false)) {
          w.uint32(40)
          w.bool(obj.encrypted ?? false)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          payload: new Uint8Array(0),
          sourceType: SourceType.UNKNOWN_SOURCE_TYPE,
          imageType: ImageType.UNKNOWN_IMAGE_TYPE,
          encryptionKeys: [],
          encrypted: false
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.payload = reader.bytes()
              break
            case 2:
              obj.sourceType = IdentityImage.SourceType.codec().decode(reader)
              break
            case 3:
              obj.imageType = ImageType.codec().decode(reader)
              break
            case 4:
              obj.encryptionKeys.push(reader.bytes())
              break
            case 5:
              obj.encrypted = reader.bool()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<IdentityImage>): Uint8Array => {
    return encodeMessage(obj, IdentityImage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): IdentityImage => {
    return decodeMessage(buf, IdentityImage.codec())
  }
}

export interface SocialLink {
  text: string
  url: string
}

export namespace SocialLink {
  let _codec: Codec<SocialLink>

  export const codec = (): Codec<SocialLink> => {
    if (_codec == null) {
      _codec = message<SocialLink>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.text != null && obj.text !== '')) {
          w.uint32(10)
          w.string(obj.text ?? '')
        }

        if (opts.writeDefaults === true || (obj.url != null && obj.url !== '')) {
          w.uint32(18)
          w.string(obj.url ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          text: '',
          url: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.text = reader.string()
              break
            case 2:
              obj.url = reader.string()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<SocialLink>): Uint8Array => {
    return encodeMessage(obj, SocialLink.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): SocialLink => {
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
  export const codec = (): Codec<MessageType> => {
    return enumeration<MessageType>(__MessageTypeValues)
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
  export const codec = (): Codec<ImageType> => {
    return enumeration<ImageType>(__ImageTypeValues)
  }
}
