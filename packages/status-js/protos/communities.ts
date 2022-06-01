/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import { encodeMessage, decodeMessage, message, bytes, string, uint64, enumeration, bool, int32, uint32 } from 'protons-runtime'
import type { Codec } from 'protons-runtime'

export interface Grant {
  communityId: Uint8Array
  memberId: Uint8Array
  chatId: string
  clock: bigint
}

export namespace Grant {
  export const codec = (): Codec<Grant> => {
    return message<Grant>({
      1: { name: 'communityId', codec: bytes },
      2: { name: 'memberId', codec: bytes },
      3: { name: 'chatId', codec: string },
      4: { name: 'clock', codec: uint64 }
    })
  }

  export const encode = (obj: Grant): Uint8Array => {
    return encodeMessage(obj, Grant.codec())
  }

  export const decode = (buf: Uint8Array): Grant => {
    return decodeMessage(buf, Grant.codec())
  }
}

export interface CommunityMember {
  roles: CommunityMember.Roles[]
}

export namespace CommunityMember {
  export enum Roles {
    UNKNOWN_ROLE = 'UNKNOWN_ROLE',
    ROLE_ALL = 'ROLE_ALL',
    ROLE_MANAGE_USERS = 'ROLE_MANAGE_USERS'
  }

  enum __RolesValues {
    UNKNOWN_ROLE = 0,
    ROLE_ALL = 1,
    ROLE_MANAGE_USERS = 2
  }

  export namespace Roles {
    export const codec = () => {
      return enumeration<typeof Roles>(__RolesValues)
    }
  }

  export const codec = (): Codec<CommunityMember> => {
    return message<CommunityMember>({
      1: { name: 'roles', codec: CommunityMember.Roles.codec(), repeats: true }
    })
  }

  export const encode = (obj: CommunityMember): Uint8Array => {
    return encodeMessage(obj, CommunityMember.codec())
  }

  export const decode = (buf: Uint8Array): CommunityMember => {
    return decodeMessage(buf, CommunityMember.codec())
  }
}

export interface CommunityPermissions {
  ensOnly: boolean
  private: boolean
  access: CommunityPermissions.Access
}

export namespace CommunityPermissions {
  export enum Access {
    UNKNOWN_ACCESS = 'UNKNOWN_ACCESS',
    NO_MEMBERSHIP = 'NO_MEMBERSHIP',
    INVITATION_ONLY = 'INVITATION_ONLY',
    ON_REQUEST = 'ON_REQUEST'
  }

  enum __AccessValues {
    UNKNOWN_ACCESS = 0,
    NO_MEMBERSHIP = 1,
    INVITATION_ONLY = 2,
    ON_REQUEST = 3
  }

  export namespace Access {
    export const codec = () => {
      return enumeration<typeof Access>(__AccessValues)
    }
  }

  export const codec = (): Codec<CommunityPermissions> => {
    return message<CommunityPermissions>({
      1: { name: 'ensOnly', codec: bool },
      2: { name: 'private', codec: bool },
      3: { name: 'access', codec: CommunityPermissions.Access.codec() }
    })
  }

  export const encode = (obj: CommunityPermissions): Uint8Array => {
    return encodeMessage(obj, CommunityPermissions.codec())
  }

  export const decode = (buf: Uint8Array): CommunityPermissions => {
    return decodeMessage(buf, CommunityPermissions.codec())
  }
}

export interface CommunityDescription {
  clock: bigint
  members: CommunityMember
  permissions: CommunityPermissions
  identity: ChatIdentity
  chats: Record<string,CommunityChat>
  banList: string[]
  categories: CommunityCategory
  archiveMagnetlinkClock: bigint
  adminSettings: CommunityAdminSettings
}

export namespace CommunityDescription {
  export const codec = (): Codec<CommunityDescription> => {
    return message<CommunityDescription>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'members', codec: CommunityMember.codec() },
      3: { name: 'permissions', codec: CommunityPermissions.codec() },
      5: { name: 'identity', codec: ChatIdentity.codec() },
      6: { name: 'chats', codec: CommunityChat.codec() },
      7: { name: 'banList', codec: string, repeats: true },
      8: { name: 'categories', codec: CommunityCategory.codec() },
      9: { name: 'archiveMagnetlinkClock', codec: uint64 },
      10: { name: 'adminSettings', codec: CommunityAdminSettings.codec() }
    })
  }

  export const encode = (obj: CommunityDescription): Uint8Array => {
    return encodeMessage(obj, CommunityDescription.codec())
  }

  export const decode = (buf: Uint8Array): CommunityDescription => {
    return decodeMessage(buf, CommunityDescription.codec())
  }
}

export interface CommunityAdminSettings {
  pinMessageAllMembersEnabled: boolean
}

export namespace CommunityAdminSettings {
  export const codec = (): Codec<CommunityAdminSettings> => {
    return message<CommunityAdminSettings>({
      1: { name: 'pinMessageAllMembersEnabled', codec: bool }
    })
  }

  export const encode = (obj: CommunityAdminSettings): Uint8Array => {
    return encodeMessage(obj, CommunityAdminSettings.codec())
  }

  export const decode = (buf: Uint8Array): CommunityAdminSettings => {
    return decodeMessage(buf, CommunityAdminSettings.codec())
  }
}

export interface CommunityChat {
  members: CommunityMember
  permissions: CommunityPermissions
  identity: ChatIdentity
  categoryId: string
  position: number
}

export namespace CommunityChat {
  export const codec = (): Codec<CommunityChat> => {
    return message<CommunityChat>({
      1: { name: 'members', codec: CommunityMember.codec() },
      2: { name: 'permissions', codec: CommunityPermissions.codec() },
      3: { name: 'identity', codec: ChatIdentity.codec() },
      4: { name: 'categoryId', codec: string },
      5: { name: 'position', codec: int32 }
    })
  }

  export const encode = (obj: CommunityChat): Uint8Array => {
    return encodeMessage(obj, CommunityChat.codec())
  }

  export const decode = (buf: Uint8Array): CommunityChat => {
    return decodeMessage(buf, CommunityChat.codec())
  }
}

export interface CommunityCategory {
  categoryId: string
  name: string
  position: number
}

export namespace CommunityCategory {
  export const codec = (): Codec<CommunityCategory> => {
    return message<CommunityCategory>({
      1: { name: 'categoryId', codec: string },
      2: { name: 'name', codec: string },
      3: { name: 'position', codec: int32 }
    })
  }

  export const encode = (obj: CommunityCategory): Uint8Array => {
    return encodeMessage(obj, CommunityCategory.codec())
  }

  export const decode = (buf: Uint8Array): CommunityCategory => {
    return decodeMessage(buf, CommunityCategory.codec())
  }
}

export interface CommunityInvitation {
  communityDescription: Uint8Array
  grant: Uint8Array
  chatId: string
  publicKey: Uint8Array
}

export namespace CommunityInvitation {
  export const codec = (): Codec<CommunityInvitation> => {
    return message<CommunityInvitation>({
      1: { name: 'communityDescription', codec: bytes },
      2: { name: 'grant', codec: bytes },
      3: { name: 'chatId', codec: string },
      4: { name: 'publicKey', codec: bytes }
    })
  }

  export const encode = (obj: CommunityInvitation): Uint8Array => {
    return encodeMessage(obj, CommunityInvitation.codec())
  }

  export const decode = (buf: Uint8Array): CommunityInvitation => {
    return decodeMessage(buf, CommunityInvitation.codec())
  }
}

export interface CommunityRequestToJoin {
  clock: bigint
  ensName: string
  chatId: string
  communityId: Uint8Array
}

export namespace CommunityRequestToJoin {
  export const codec = (): Codec<CommunityRequestToJoin> => {
    return message<CommunityRequestToJoin>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'ensName', codec: string },
      3: { name: 'chatId', codec: string },
      4: { name: 'communityId', codec: bytes }
    })
  }

  export const encode = (obj: CommunityRequestToJoin): Uint8Array => {
    return encodeMessage(obj, CommunityRequestToJoin.codec())
  }

  export const decode = (buf: Uint8Array): CommunityRequestToJoin => {
    return decodeMessage(buf, CommunityRequestToJoin.codec())
  }
}

export interface CommunityRequestToJoinResponse {
  clock: bigint
  community: CommunityDescription
  accepted: boolean
  grant: Uint8Array
}

export namespace CommunityRequestToJoinResponse {
  export const codec = (): Codec<CommunityRequestToJoinResponse> => {
    return message<CommunityRequestToJoinResponse>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'community', codec: CommunityDescription.codec() },
      3: { name: 'accepted', codec: bool },
      4: { name: 'grant', codec: bytes }
    })
  }

  export const encode = (obj: CommunityRequestToJoinResponse): Uint8Array => {
    return encodeMessage(obj, CommunityRequestToJoinResponse.codec())
  }

  export const decode = (buf: Uint8Array): CommunityRequestToJoinResponse => {
    return decodeMessage(buf, CommunityRequestToJoinResponse.codec())
  }
}

export interface CommunityMessageArchiveMagnetlink {
  clock: bigint
  magnetUri: string
}

export namespace CommunityMessageArchiveMagnetlink {
  export const codec = (): Codec<CommunityMessageArchiveMagnetlink> => {
    return message<CommunityMessageArchiveMagnetlink>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'magnetUri', codec: string }
    })
  }

  export const encode = (obj: CommunityMessageArchiveMagnetlink): Uint8Array => {
    return encodeMessage(obj, CommunityMessageArchiveMagnetlink.codec())
  }

  export const decode = (buf: Uint8Array): CommunityMessageArchiveMagnetlink => {
    return decodeMessage(buf, CommunityMessageArchiveMagnetlink.codec())
  }
}

export interface WakuMessage {
  sig: Uint8Array
  timestamp: bigint
  topic: Uint8Array
  payload: Uint8Array
  padding: Uint8Array
  hash: Uint8Array
}

export namespace WakuMessage {
  export const codec = (): Codec<WakuMessage> => {
    return message<WakuMessage>({
      1: { name: 'sig', codec: bytes },
      2: { name: 'timestamp', codec: uint64 },
      3: { name: 'topic', codec: bytes },
      4: { name: 'payload', codec: bytes },
      5: { name: 'padding', codec: bytes },
      6: { name: 'hash', codec: bytes }
    })
  }

  export const encode = (obj: WakuMessage): Uint8Array => {
    return encodeMessage(obj, WakuMessage.codec())
  }

  export const decode = (buf: Uint8Array): WakuMessage => {
    return decodeMessage(buf, WakuMessage.codec())
  }
}

export interface WakuMessageArchiveMetadata {
  version: number
  from: bigint
  to: bigint
  contentTopic: Uint8Array[]
}

export namespace WakuMessageArchiveMetadata {
  export const codec = (): Codec<WakuMessageArchiveMetadata> => {
    return message<WakuMessageArchiveMetadata>({
      1: { name: 'version', codec: uint32 },
      2: { name: 'from', codec: uint64 },
      3: { name: 'to', codec: uint64 },
      4: { name: 'contentTopic', codec: bytes, repeats: true }
    })
  }

  export const encode = (obj: WakuMessageArchiveMetadata): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveMetadata.codec())
  }

  export const decode = (buf: Uint8Array): WakuMessageArchiveMetadata => {
    return decodeMessage(buf, WakuMessageArchiveMetadata.codec())
  }
}

export interface WakuMessageArchive {
  version: number
  metadata: WakuMessageArchiveMetadata
  messages: WakuMessage[]
}

export namespace WakuMessageArchive {
  export const codec = (): Codec<WakuMessageArchive> => {
    return message<WakuMessageArchive>({
      1: { name: 'version', codec: uint32 },
      2: { name: 'metadata', codec: WakuMessageArchiveMetadata.codec() },
      3: { name: 'messages', codec: WakuMessage.codec(), repeats: true }
    })
  }

  export const encode = (obj: WakuMessageArchive): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchive.codec())
  }

  export const decode = (buf: Uint8Array): WakuMessageArchive => {
    return decodeMessage(buf, WakuMessageArchive.codec())
  }
}

export interface WakuMessageArchiveIndexMetadata {
  version: number
  metadata: WakuMessageArchiveMetadata
  offset: bigint
  size: bigint
  padding: bigint
}

export namespace WakuMessageArchiveIndexMetadata {
  export const codec = (): Codec<WakuMessageArchiveIndexMetadata> => {
    return message<WakuMessageArchiveIndexMetadata>({
      1: { name: 'version', codec: uint32 },
      2: { name: 'metadata', codec: WakuMessageArchiveMetadata.codec() },
      3: { name: 'offset', codec: uint64 },
      4: { name: 'size', codec: uint64 },
      5: { name: 'padding', codec: uint64 }
    })
  }

  export const encode = (obj: WakuMessageArchiveIndexMetadata): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveIndexMetadata.codec())
  }

  export const decode = (buf: Uint8Array): WakuMessageArchiveIndexMetadata => {
    return decodeMessage(buf, WakuMessageArchiveIndexMetadata.codec())
  }
}

export interface WakuMessageArchiveIndex {
  archives: WakuMessageArchiveIndexMetadata
}

export namespace WakuMessageArchiveIndex {
  export const codec = (): Codec<WakuMessageArchiveIndex> => {
    return message<WakuMessageArchiveIndex>({
      1: { name: 'archives', codec: WakuMessageArchiveIndexMetadata.codec() }
    })
  }

  export const encode = (obj: WakuMessageArchiveIndex): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveIndex.codec())
  }

  export const decode = (buf: Uint8Array): WakuMessageArchiveIndex => {
    return decodeMessage(buf, WakuMessageArchiveIndex.codec())
  }
}

export interface ChatIdentity {
  clock: bigint
  ensName: string
  images: IdentityImage
  displayName: string
  description: string
  color: string
  emoji: string
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
      7: { name: 'emoji', codec: string }
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
