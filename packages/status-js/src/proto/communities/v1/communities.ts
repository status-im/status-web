/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'
import { ChatIdentity } from './chat_identity'

export const protobufPackage = 'communities.v1'

export interface Grant {
  communityId: Uint8Array
  memberId: Uint8Array
  chatId: string
  clock: number
}

export interface CommunityMember {
  roles: CommunityMember_Roles[]
}

export enum CommunityMember_Roles {
  UNKNOWN_ROLE = 0,
  ROLE_ALL = 1,
  ROLE_MANAGE_USERS = 2,
  UNRECOGNIZED = -1,
}

export function communityMember_RolesFromJSON(
  object: any
): CommunityMember_Roles {
  switch (object) {
    case 0:
    case 'UNKNOWN_ROLE':
      return CommunityMember_Roles.UNKNOWN_ROLE
    case 1:
    case 'ROLE_ALL':
      return CommunityMember_Roles.ROLE_ALL
    case 2:
    case 'ROLE_MANAGE_USERS':
      return CommunityMember_Roles.ROLE_MANAGE_USERS
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CommunityMember_Roles.UNRECOGNIZED
  }
}

export function communityMember_RolesToJSON(
  object: CommunityMember_Roles
): string {
  switch (object) {
    case CommunityMember_Roles.UNKNOWN_ROLE:
      return 'UNKNOWN_ROLE'
    case CommunityMember_Roles.ROLE_ALL:
      return 'ROLE_ALL'
    case CommunityMember_Roles.ROLE_MANAGE_USERS:
      return 'ROLE_MANAGE_USERS'
    default:
      return 'UNKNOWN'
  }
}

export interface CommunityPermissions {
  ensOnly: boolean
  /** https://gitlab.matrix.org/matrix-org/olm/blob/master/docs/megolm.md is a candidate for the algorithm to be used in case we want to have private communityal chats, lighter than pairwise encryption using the DR, less secure, but more efficient for large number of participants */
  private: boolean
  access: CommunityPermissions_Access
}

export enum CommunityPermissions_Access {
  UNKNOWN_ACCESS = 0,
  NO_MEMBERSHIP = 1,
  INVITATION_ONLY = 2,
  ON_REQUEST = 3,
  UNRECOGNIZED = -1,
}

export function communityPermissions_AccessFromJSON(
  object: any
): CommunityPermissions_Access {
  switch (object) {
    case 0:
    case 'UNKNOWN_ACCESS':
      return CommunityPermissions_Access.UNKNOWN_ACCESS
    case 1:
    case 'NO_MEMBERSHIP':
      return CommunityPermissions_Access.NO_MEMBERSHIP
    case 2:
    case 'INVITATION_ONLY':
      return CommunityPermissions_Access.INVITATION_ONLY
    case 3:
    case 'ON_REQUEST':
      return CommunityPermissions_Access.ON_REQUEST
    case -1:
    case 'UNRECOGNIZED':
    default:
      return CommunityPermissions_Access.UNRECOGNIZED
  }
}

export function communityPermissions_AccessToJSON(
  object: CommunityPermissions_Access
): string {
  switch (object) {
    case CommunityPermissions_Access.UNKNOWN_ACCESS:
      return 'UNKNOWN_ACCESS'
    case CommunityPermissions_Access.NO_MEMBERSHIP:
      return 'NO_MEMBERSHIP'
    case CommunityPermissions_Access.INVITATION_ONLY:
      return 'INVITATION_ONLY'
    case CommunityPermissions_Access.ON_REQUEST:
      return 'ON_REQUEST'
    default:
      return 'UNKNOWN'
  }
}

export interface CommunityDescription {
  clock: number
  members: { [key: string]: CommunityMember }
  permissions: CommunityPermissions | undefined
  identity: ChatIdentity | undefined
  chats: { [key: string]: CommunityChat }
  banList: string[]
  categories: { [key: string]: CommunityCategory }
}

export interface CommunityDescription_MembersEntry {
  key: string
  value: CommunityMember | undefined
}

export interface CommunityDescription_ChatsEntry {
  key: string
  value: CommunityChat | undefined
}

export interface CommunityDescription_CategoriesEntry {
  key: string
  value: CommunityCategory | undefined
}

export interface CommunityChat {
  members: { [key: string]: CommunityMember }
  permissions: CommunityPermissions | undefined
  identity: ChatIdentity | undefined
  categoryId: string
  position: number
}

export interface CommunityChat_MembersEntry {
  key: string
  value: CommunityMember | undefined
}

export interface CommunityCategory {
  categoryId: string
  name: string
  position: number
}

export interface CommunityInvitation {
  communityDescription: Uint8Array
  grant: Uint8Array
  chatId: string
  publicKey: Uint8Array
}

export interface CommunityRequestToJoin {
  clock: number
  ensName: string
  chatId: string
  communityId: Uint8Array
}

export interface CommunityRequestToJoinResponse {
  clock: number
  community: CommunityDescription | undefined
  accepted: boolean
  grant: Uint8Array
}

const baseGrant: object = { chatId: '', clock: 0 }

export const Grant = {
  encode(message: Grant, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.communityId.length !== 0) {
      writer.uint32(10).bytes(message.communityId)
    }
    if (message.memberId.length !== 0) {
      writer.uint32(18).bytes(message.memberId)
    }
    if (message.chatId !== '') {
      writer.uint32(26).string(message.chatId)
    }
    if (message.clock !== 0) {
      writer.uint32(32).uint64(message.clock)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Grant {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGrant } as Grant
    message.communityId = new Uint8Array()
    message.memberId = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.communityId = reader.bytes()
          break
        case 2:
          message.memberId = reader.bytes()
          break
        case 3:
          message.chatId = reader.string()
          break
        case 4:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Grant {
    const message = { ...baseGrant } as Grant
    message.communityId = new Uint8Array()
    message.memberId = new Uint8Array()
    if (object.communityId !== undefined && object.communityId !== null) {
      message.communityId = bytesFromBase64(object.communityId)
    }
    if (object.memberId !== undefined && object.memberId !== null) {
      message.memberId = bytesFromBase64(object.memberId)
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    return message
  },

  toJSON(message: Grant): unknown {
    const obj: any = {}
    message.communityId !== undefined &&
      (obj.communityId = base64FromBytes(
        message.communityId !== undefined
          ? message.communityId
          : new Uint8Array()
      ))
    message.memberId !== undefined &&
      (obj.memberId = base64FromBytes(
        message.memberId !== undefined ? message.memberId : new Uint8Array()
      ))
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.clock !== undefined && (obj.clock = message.clock)
    return obj
  },

  fromPartial(object: DeepPartial<Grant>): Grant {
    const message = { ...baseGrant } as Grant
    if (object.communityId !== undefined && object.communityId !== null) {
      message.communityId = object.communityId
    } else {
      message.communityId = new Uint8Array()
    }
    if (object.memberId !== undefined && object.memberId !== null) {
      message.memberId = object.memberId
    } else {
      message.memberId = new Uint8Array()
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    return message
  },
}

const baseCommunityMember: object = { roles: 0 }

export const CommunityMember = {
  encode(
    message: CommunityMember,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    writer.uint32(10).fork()
    for (const v of message.roles) {
      writer.int32(v)
    }
    writer.ldelim()
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityMember {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityMember } as CommunityMember
    message.roles = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos
            while (reader.pos < end2) {
              message.roles.push(reader.int32() as any)
            }
          } else {
            message.roles.push(reader.int32() as any)
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityMember {
    const message = { ...baseCommunityMember } as CommunityMember
    message.roles = []
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(communityMember_RolesFromJSON(e))
      }
    }
    return message
  },

  toJSON(message: CommunityMember): unknown {
    const obj: any = {}
    if (message.roles) {
      obj.roles = message.roles.map(e => communityMember_RolesToJSON(e))
    } else {
      obj.roles = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<CommunityMember>): CommunityMember {
    const message = { ...baseCommunityMember } as CommunityMember
    message.roles = []
    if (object.roles !== undefined && object.roles !== null) {
      for (const e of object.roles) {
        message.roles.push(e)
      }
    }
    return message
  },
}

const baseCommunityPermissions: object = {
  ensOnly: false,
  private: false,
  access: 0,
}

export const CommunityPermissions = {
  encode(
    message: CommunityPermissions,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ensOnly === true) {
      writer.uint32(8).bool(message.ensOnly)
    }
    if (message.private === true) {
      writer.uint32(16).bool(message.private)
    }
    if (message.access !== 0) {
      writer.uint32(24).int32(message.access)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityPermissions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityPermissions } as CommunityPermissions
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.ensOnly = reader.bool()
          break
        case 2:
          message.private = reader.bool()
          break
        case 3:
          message.access = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityPermissions {
    const message = { ...baseCommunityPermissions } as CommunityPermissions
    if (object.ensOnly !== undefined && object.ensOnly !== null) {
      message.ensOnly = Boolean(object.ensOnly)
    } else {
      message.ensOnly = false
    }
    if (object.private !== undefined && object.private !== null) {
      message.private = Boolean(object.private)
    } else {
      message.private = false
    }
    if (object.access !== undefined && object.access !== null) {
      message.access = communityPermissions_AccessFromJSON(object.access)
    } else {
      message.access = 0
    }
    return message
  },

  toJSON(message: CommunityPermissions): unknown {
    const obj: any = {}
    message.ensOnly !== undefined && (obj.ensOnly = message.ensOnly)
    message.private !== undefined && (obj.private = message.private)
    message.access !== undefined &&
      (obj.access = communityPermissions_AccessToJSON(message.access))
    return obj
  },

  fromPartial(object: DeepPartial<CommunityPermissions>): CommunityPermissions {
    const message = { ...baseCommunityPermissions } as CommunityPermissions
    if (object.ensOnly !== undefined && object.ensOnly !== null) {
      message.ensOnly = object.ensOnly
    } else {
      message.ensOnly = false
    }
    if (object.private !== undefined && object.private !== null) {
      message.private = object.private
    } else {
      message.private = false
    }
    if (object.access !== undefined && object.access !== null) {
      message.access = object.access
    } else {
      message.access = 0
    }
    return message
  },
}

const baseCommunityDescription: object = { clock: 0, banList: '' }

export const CommunityDescription = {
  encode(
    message: CommunityDescription,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    Object.entries(message.members).forEach(([key, value]) => {
      CommunityDescription_MembersEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim()
    })
    if (message.permissions !== undefined) {
      CommunityPermissions.encode(
        message.permissions,
        writer.uint32(26).fork()
      ).ldelim()
    }
    if (message.identity !== undefined) {
      ChatIdentity.encode(message.identity, writer.uint32(42).fork()).ldelim()
    }
    Object.entries(message.chats).forEach(([key, value]) => {
      CommunityDescription_ChatsEntry.encode(
        { key: key as any, value },
        writer.uint32(50).fork()
      ).ldelim()
    })
    for (const v of message.banList) {
      writer.uint32(58).string(v!)
    }
    Object.entries(message.categories).forEach(([key, value]) => {
      CommunityDescription_CategoriesEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim()
    })
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityDescription {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityDescription } as CommunityDescription
    message.members = {}
    message.chats = {}
    message.banList = []
    message.categories = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          const entry2 = CommunityDescription_MembersEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry2.value !== undefined) {
            message.members[entry2.key] = entry2.value
          }
          break
        case 3:
          message.permissions = CommunityPermissions.decode(
            reader,
            reader.uint32()
          )
          break
        case 5:
          message.identity = ChatIdentity.decode(reader, reader.uint32())
          break
        case 6:
          const entry6 = CommunityDescription_ChatsEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry6.value !== undefined) {
            message.chats[entry6.key] = entry6.value
          }
          break
        case 7:
          message.banList.push(reader.string())
          break
        case 8:
          const entry8 = CommunityDescription_CategoriesEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry8.value !== undefined) {
            message.categories[entry8.key] = entry8.value
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityDescription {
    const message = { ...baseCommunityDescription } as CommunityDescription
    message.members = {}
    message.chats = {}
    message.banList = []
    message.categories = {}
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.members !== undefined && object.members !== null) {
      Object.entries(object.members).forEach(([key, value]) => {
        message.members[key] = CommunityMember.fromJSON(value)
      })
    }
    if (object.permissions !== undefined && object.permissions !== null) {
      message.permissions = CommunityPermissions.fromJSON(object.permissions)
    } else {
      message.permissions = undefined
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = ChatIdentity.fromJSON(object.identity)
    } else {
      message.identity = undefined
    }
    if (object.chats !== undefined && object.chats !== null) {
      Object.entries(object.chats).forEach(([key, value]) => {
        message.chats[key] = CommunityChat.fromJSON(value)
      })
    }
    if (object.banList !== undefined && object.banList !== null) {
      for (const e of object.banList) {
        message.banList.push(String(e))
      }
    }
    if (object.categories !== undefined && object.categories !== null) {
      Object.entries(object.categories).forEach(([key, value]) => {
        message.categories[key] = CommunityCategory.fromJSON(value)
      })
    }
    return message
  },

  toJSON(message: CommunityDescription): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    obj.members = {}
    if (message.members) {
      Object.entries(message.members).forEach(([k, v]) => {
        obj.members[k] = CommunityMember.toJSON(v)
      })
    }
    message.permissions !== undefined &&
      (obj.permissions = message.permissions
        ? CommunityPermissions.toJSON(message.permissions)
        : undefined)
    message.identity !== undefined &&
      (obj.identity = message.identity
        ? ChatIdentity.toJSON(message.identity)
        : undefined)
    obj.chats = {}
    if (message.chats) {
      Object.entries(message.chats).forEach(([k, v]) => {
        obj.chats[k] = CommunityChat.toJSON(v)
      })
    }
    if (message.banList) {
      obj.banList = message.banList.map(e => e)
    } else {
      obj.banList = []
    }
    obj.categories = {}
    if (message.categories) {
      Object.entries(message.categories).forEach(([k, v]) => {
        obj.categories[k] = CommunityCategory.toJSON(v)
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<CommunityDescription>): CommunityDescription {
    const message = { ...baseCommunityDescription } as CommunityDescription
    message.members = {}
    message.chats = {}
    message.banList = []
    message.categories = {}
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.members !== undefined && object.members !== null) {
      Object.entries(object.members).forEach(([key, value]) => {
        if (value !== undefined) {
          message.members[key] = CommunityMember.fromPartial(value)
        }
      })
    }
    if (object.permissions !== undefined && object.permissions !== null) {
      message.permissions = CommunityPermissions.fromPartial(object.permissions)
    } else {
      message.permissions = undefined
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = ChatIdentity.fromPartial(object.identity)
    } else {
      message.identity = undefined
    }
    if (object.chats !== undefined && object.chats !== null) {
      Object.entries(object.chats).forEach(([key, value]) => {
        if (value !== undefined) {
          message.chats[key] = CommunityChat.fromPartial(value)
        }
      })
    }
    if (object.banList !== undefined && object.banList !== null) {
      for (const e of object.banList) {
        message.banList.push(e)
      }
    }
    if (object.categories !== undefined && object.categories !== null) {
      Object.entries(object.categories).forEach(([key, value]) => {
        if (value !== undefined) {
          message.categories[key] = CommunityCategory.fromPartial(value)
        }
      })
    }
    return message
  },
}

const baseCommunityDescription_MembersEntry: object = { key: '' }

export const CommunityDescription_MembersEntry = {
  encode(
    message: CommunityDescription_MembersEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      CommunityMember.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityDescription_MembersEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseCommunityDescription_MembersEntry,
    } as CommunityDescription_MembersEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = CommunityMember.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityDescription_MembersEntry {
    const message = {
      ...baseCommunityDescription_MembersEntry,
    } as CommunityDescription_MembersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key)
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityMember.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: CommunityDescription_MembersEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? CommunityMember.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityDescription_MembersEntry>
  ): CommunityDescription_MembersEntry {
    const message = {
      ...baseCommunityDescription_MembersEntry,
    } as CommunityDescription_MembersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityMember.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  },
}

const baseCommunityDescription_ChatsEntry: object = { key: '' }

export const CommunityDescription_ChatsEntry = {
  encode(
    message: CommunityDescription_ChatsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      CommunityChat.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityDescription_ChatsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseCommunityDescription_ChatsEntry,
    } as CommunityDescription_ChatsEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = CommunityChat.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityDescription_ChatsEntry {
    const message = {
      ...baseCommunityDescription_ChatsEntry,
    } as CommunityDescription_ChatsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key)
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityChat.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: CommunityDescription_ChatsEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? CommunityChat.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityDescription_ChatsEntry>
  ): CommunityDescription_ChatsEntry {
    const message = {
      ...baseCommunityDescription_ChatsEntry,
    } as CommunityDescription_ChatsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityChat.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  },
}

const baseCommunityDescription_CategoriesEntry: object = { key: '' }

export const CommunityDescription_CategoriesEntry = {
  encode(
    message: CommunityDescription_CategoriesEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      CommunityCategory.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityDescription_CategoriesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseCommunityDescription_CategoriesEntry,
    } as CommunityDescription_CategoriesEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = CommunityCategory.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityDescription_CategoriesEntry {
    const message = {
      ...baseCommunityDescription_CategoriesEntry,
    } as CommunityDescription_CategoriesEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key)
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityCategory.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: CommunityDescription_CategoriesEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? CommunityCategory.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityDescription_CategoriesEntry>
  ): CommunityDescription_CategoriesEntry {
    const message = {
      ...baseCommunityDescription_CategoriesEntry,
    } as CommunityDescription_CategoriesEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityCategory.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  },
}

const baseCommunityChat: object = { categoryId: '', position: 0 }

export const CommunityChat = {
  encode(
    message: CommunityChat,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    Object.entries(message.members).forEach(([key, value]) => {
      CommunityChat_MembersEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim()
    })
    if (message.permissions !== undefined) {
      CommunityPermissions.encode(
        message.permissions,
        writer.uint32(18).fork()
      ).ldelim()
    }
    if (message.identity !== undefined) {
      ChatIdentity.encode(message.identity, writer.uint32(26).fork()).ldelim()
    }
    if (message.categoryId !== '') {
      writer.uint32(34).string(message.categoryId)
    }
    if (message.position !== 0) {
      writer.uint32(40).int32(message.position)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityChat {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityChat } as CommunityChat
    message.members = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = CommunityChat_MembersEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry1.value !== undefined) {
            message.members[entry1.key] = entry1.value
          }
          break
        case 2:
          message.permissions = CommunityPermissions.decode(
            reader,
            reader.uint32()
          )
          break
        case 3:
          message.identity = ChatIdentity.decode(reader, reader.uint32())
          break
        case 4:
          message.categoryId = reader.string()
          break
        case 5:
          message.position = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityChat {
    const message = { ...baseCommunityChat } as CommunityChat
    message.members = {}
    if (object.members !== undefined && object.members !== null) {
      Object.entries(object.members).forEach(([key, value]) => {
        message.members[key] = CommunityMember.fromJSON(value)
      })
    }
    if (object.permissions !== undefined && object.permissions !== null) {
      message.permissions = CommunityPermissions.fromJSON(object.permissions)
    } else {
      message.permissions = undefined
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = ChatIdentity.fromJSON(object.identity)
    } else {
      message.identity = undefined
    }
    if (object.categoryId !== undefined && object.categoryId !== null) {
      message.categoryId = String(object.categoryId)
    } else {
      message.categoryId = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Number(object.position)
    } else {
      message.position = 0
    }
    return message
  },

  toJSON(message: CommunityChat): unknown {
    const obj: any = {}
    obj.members = {}
    if (message.members) {
      Object.entries(message.members).forEach(([k, v]) => {
        obj.members[k] = CommunityMember.toJSON(v)
      })
    }
    message.permissions !== undefined &&
      (obj.permissions = message.permissions
        ? CommunityPermissions.toJSON(message.permissions)
        : undefined)
    message.identity !== undefined &&
      (obj.identity = message.identity
        ? ChatIdentity.toJSON(message.identity)
        : undefined)
    message.categoryId !== undefined && (obj.categoryId = message.categoryId)
    message.position !== undefined && (obj.position = message.position)
    return obj
  },

  fromPartial(object: DeepPartial<CommunityChat>): CommunityChat {
    const message = { ...baseCommunityChat } as CommunityChat
    message.members = {}
    if (object.members !== undefined && object.members !== null) {
      Object.entries(object.members).forEach(([key, value]) => {
        if (value !== undefined) {
          message.members[key] = CommunityMember.fromPartial(value)
        }
      })
    }
    if (object.permissions !== undefined && object.permissions !== null) {
      message.permissions = CommunityPermissions.fromPartial(object.permissions)
    } else {
      message.permissions = undefined
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = ChatIdentity.fromPartial(object.identity)
    } else {
      message.identity = undefined
    }
    if (object.categoryId !== undefined && object.categoryId !== null) {
      message.categoryId = object.categoryId
    } else {
      message.categoryId = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position
    } else {
      message.position = 0
    }
    return message
  },
}

const baseCommunityChat_MembersEntry: object = { key: '' }

export const CommunityChat_MembersEntry = {
  encode(
    message: CommunityChat_MembersEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      CommunityMember.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityChat_MembersEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseCommunityChat_MembersEntry,
    } as CommunityChat_MembersEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = CommunityMember.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityChat_MembersEntry {
    const message = {
      ...baseCommunityChat_MembersEntry,
    } as CommunityChat_MembersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key)
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityMember.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: CommunityChat_MembersEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? CommunityMember.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityChat_MembersEntry>
  ): CommunityChat_MembersEntry {
    const message = {
      ...baseCommunityChat_MembersEntry,
    } as CommunityChat_MembersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = CommunityMember.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  },
}

const baseCommunityCategory: object = { categoryId: '', name: '', position: 0 }

export const CommunityCategory = {
  encode(
    message: CommunityCategory,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.categoryId !== '') {
      writer.uint32(10).string(message.categoryId)
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name)
    }
    if (message.position !== 0) {
      writer.uint32(24).int32(message.position)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityCategory {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityCategory } as CommunityCategory
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.categoryId = reader.string()
          break
        case 2:
          message.name = reader.string()
          break
        case 3:
          message.position = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityCategory {
    const message = { ...baseCommunityCategory } as CommunityCategory
    if (object.categoryId !== undefined && object.categoryId !== null) {
      message.categoryId = String(object.categoryId)
    } else {
      message.categoryId = ''
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name)
    } else {
      message.name = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Number(object.position)
    } else {
      message.position = 0
    }
    return message
  },

  toJSON(message: CommunityCategory): unknown {
    const obj: any = {}
    message.categoryId !== undefined && (obj.categoryId = message.categoryId)
    message.name !== undefined && (obj.name = message.name)
    message.position !== undefined && (obj.position = message.position)
    return obj
  },

  fromPartial(object: DeepPartial<CommunityCategory>): CommunityCategory {
    const message = { ...baseCommunityCategory } as CommunityCategory
    if (object.categoryId !== undefined && object.categoryId !== null) {
      message.categoryId = object.categoryId
    } else {
      message.categoryId = ''
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name
    } else {
      message.name = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position
    } else {
      message.position = 0
    }
    return message
  },
}

const baseCommunityInvitation: object = { chatId: '' }

export const CommunityInvitation = {
  encode(
    message: CommunityInvitation,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.communityDescription.length !== 0) {
      writer.uint32(10).bytes(message.communityDescription)
    }
    if (message.grant.length !== 0) {
      writer.uint32(18).bytes(message.grant)
    }
    if (message.chatId !== '') {
      writer.uint32(26).string(message.chatId)
    }
    if (message.publicKey.length !== 0) {
      writer.uint32(34).bytes(message.publicKey)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityInvitation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityInvitation } as CommunityInvitation
    message.communityDescription = new Uint8Array()
    message.grant = new Uint8Array()
    message.publicKey = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.communityDescription = reader.bytes()
          break
        case 2:
          message.grant = reader.bytes()
          break
        case 3:
          message.chatId = reader.string()
          break
        case 4:
          message.publicKey = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityInvitation {
    const message = { ...baseCommunityInvitation } as CommunityInvitation
    message.communityDescription = new Uint8Array()
    message.grant = new Uint8Array()
    message.publicKey = new Uint8Array()
    if (
      object.communityDescription !== undefined &&
      object.communityDescription !== null
    ) {
      message.communityDescription = bytesFromBase64(
        object.communityDescription
      )
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = bytesFromBase64(object.publicKey)
    }
    return message
  },

  toJSON(message: CommunityInvitation): unknown {
    const obj: any = {}
    message.communityDescription !== undefined &&
      (obj.communityDescription = base64FromBytes(
        message.communityDescription !== undefined
          ? message.communityDescription
          : new Uint8Array()
      ))
    message.grant !== undefined &&
      (obj.grant = base64FromBytes(
        message.grant !== undefined ? message.grant : new Uint8Array()
      ))
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.publicKey !== undefined &&
      (obj.publicKey = base64FromBytes(
        message.publicKey !== undefined ? message.publicKey : new Uint8Array()
      ))
    return obj
  },

  fromPartial(object: DeepPartial<CommunityInvitation>): CommunityInvitation {
    const message = { ...baseCommunityInvitation } as CommunityInvitation
    if (
      object.communityDescription !== undefined &&
      object.communityDescription !== null
    ) {
      message.communityDescription = object.communityDescription
    } else {
      message.communityDescription = new Uint8Array()
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = new Uint8Array()
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = object.publicKey
    } else {
      message.publicKey = new Uint8Array()
    }
    return message
  },
}

const baseCommunityRequestToJoin: object = {
  clock: 0,
  ensName: '',
  chatId: '',
}

export const CommunityRequestToJoin = {
  encode(
    message: CommunityRequestToJoin,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.ensName !== '') {
      writer.uint32(18).string(message.ensName)
    }
    if (message.chatId !== '') {
      writer.uint32(26).string(message.chatId)
    }
    if (message.communityId.length !== 0) {
      writer.uint32(34).bytes(message.communityId)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityRequestToJoin {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommunityRequestToJoin } as CommunityRequestToJoin
    message.communityId = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.ensName = reader.string()
          break
        case 3:
          message.chatId = reader.string()
          break
        case 4:
          message.communityId = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityRequestToJoin {
    const message = { ...baseCommunityRequestToJoin } as CommunityRequestToJoin
    message.communityId = new Uint8Array()
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = String(object.ensName)
    } else {
      message.ensName = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.communityId !== undefined && object.communityId !== null) {
      message.communityId = bytesFromBase64(object.communityId)
    }
    return message
  },

  toJSON(message: CommunityRequestToJoin): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.ensName !== undefined && (obj.ensName = message.ensName)
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.communityId !== undefined &&
      (obj.communityId = base64FromBytes(
        message.communityId !== undefined
          ? message.communityId
          : new Uint8Array()
      ))
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityRequestToJoin>
  ): CommunityRequestToJoin {
    const message = { ...baseCommunityRequestToJoin } as CommunityRequestToJoin
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = object.ensName
    } else {
      message.ensName = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.communityId !== undefined && object.communityId !== null) {
      message.communityId = object.communityId
    } else {
      message.communityId = new Uint8Array()
    }
    return message
  },
}

const baseCommunityRequestToJoinResponse: object = {
  clock: 0,
  accepted: false,
}

export const CommunityRequestToJoinResponse = {
  encode(
    message: CommunityRequestToJoinResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.community !== undefined) {
      CommunityDescription.encode(
        message.community,
        writer.uint32(18).fork()
      ).ldelim()
    }
    if (message.accepted === true) {
      writer.uint32(24).bool(message.accepted)
    }
    if (message.grant.length !== 0) {
      writer.uint32(34).bytes(message.grant)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CommunityRequestToJoinResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseCommunityRequestToJoinResponse,
    } as CommunityRequestToJoinResponse
    message.grant = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.community = CommunityDescription.decode(
            reader,
            reader.uint32()
          )
          break
        case 3:
          message.accepted = reader.bool()
          break
        case 4:
          message.grant = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommunityRequestToJoinResponse {
    const message = {
      ...baseCommunityRequestToJoinResponse,
    } as CommunityRequestToJoinResponse
    message.grant = new Uint8Array()
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.community !== undefined && object.community !== null) {
      message.community = CommunityDescription.fromJSON(object.community)
    } else {
      message.community = undefined
    }
    if (object.accepted !== undefined && object.accepted !== null) {
      message.accepted = Boolean(object.accepted)
    } else {
      message.accepted = false
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    return message
  },

  toJSON(message: CommunityRequestToJoinResponse): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.community !== undefined &&
      (obj.community = message.community
        ? CommunityDescription.toJSON(message.community)
        : undefined)
    message.accepted !== undefined && (obj.accepted = message.accepted)
    message.grant !== undefined &&
      (obj.grant = base64FromBytes(
        message.grant !== undefined ? message.grant : new Uint8Array()
      ))
    return obj
  },

  fromPartial(
    object: DeepPartial<CommunityRequestToJoinResponse>
  ): CommunityRequestToJoinResponse {
    const message = {
      ...baseCommunityRequestToJoinResponse,
    } as CommunityRequestToJoinResponse
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.community !== undefined && object.community !== null) {
      message.community = CommunityDescription.fromPartial(object.community)
    } else {
      message.community = undefined
    }
    if (object.accepted !== undefined && object.accepted !== null) {
      message.accepted = object.accepted
    } else {
      message.accepted = false
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = new Uint8Array()
    }
    return message
  },
}

declare var self: any | undefined
declare var window: any | undefined
declare var global: any | undefined
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  if (typeof global !== 'undefined') return global
  throw 'Unable to locate global object'
})()

const atob: (b64: string) => string =
  globalThis.atob ||
  (b64 => globalThis.Buffer.from(b64, 'base64').toString('binary'))
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i)
  }
  return arr
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  (bin => globalThis.Buffer.from(bin, 'binary').toString('base64'))
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = []
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte))
  }
  return btoa(bin.join(''))
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
