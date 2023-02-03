/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message, enumeration } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface Grant {
  communityId: Uint8Array
  memberId: Uint8Array
  chatId: string
  clock: bigint
}

export namespace Grant {
  let _codec: Codec<Grant>

  export const codec = (): Codec<Grant> => {
    if (_codec == null) {
      _codec = message<Grant>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.communityId != null && obj.communityId.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.communityId ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.memberId != null && obj.memberId.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.memberId ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(32)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          communityId: new Uint8Array(0),
          memberId: new Uint8Array(0),
          chatId: '',
          clock: 0n
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.communityId = reader.bytes()
              break
            case 2:
              obj.memberId = reader.bytes()
              break
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.clock = reader.uint64()
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

  export const encode = (obj: Partial<Grant>): Uint8Array => {
    return encodeMessage(obj, Grant.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): Grant => {
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
    ROLE_MANAGE_USERS = 'ROLE_MANAGE_USERS',
    ROLE_MODERATE_CONTENT = 'ROLE_MODERATE_CONTENT'
  }

  enum __RolesValues {
    UNKNOWN_ROLE = 0,
    ROLE_ALL = 1,
    ROLE_MANAGE_USERS = 2,
    ROLE_MODERATE_CONTENT = 3
  }

  export namespace Roles {
    export const codec = (): Codec<Roles> => {
      return enumeration<Roles>(__RolesValues)
    }
  }

  let _codec: Codec<CommunityMember>

  export const codec = (): Codec<CommunityMember> => {
    if (_codec == null) {
      _codec = message<CommunityMember>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.roles != null) {
          for (const value of obj.roles) {
            w.uint32(8)
            CommunityMember.Roles.codec().encode(value, w)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          roles: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.roles.push(CommunityMember.Roles.codec().decode(reader))
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

  export const encode = (obj: Partial<CommunityMember>): Uint8Array => {
    return encodeMessage(obj, CommunityMember.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityMember => {
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
    export const codec = (): Codec<Access> => {
      return enumeration<Access>(__AccessValues)
    }
  }

  let _codec: Codec<CommunityPermissions>

  export const codec = (): Codec<CommunityPermissions> => {
    if (_codec == null) {
      _codec = message<CommunityPermissions>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.ensOnly != null && obj.ensOnly !== false)) {
          w.uint32(8)
          w.bool(obj.ensOnly ?? false)
        }

        if (opts.writeDefaults === true || (obj.private != null && obj.private !== false)) {
          w.uint32(16)
          w.bool(obj.private ?? false)
        }

        if (opts.writeDefaults === true || (obj.access != null && __AccessValues[obj.access] !== 0)) {
          w.uint32(24)
          CommunityPermissions.Access.codec().encode(obj.access ?? CommunityPermissions.Access.UNKNOWN_ACCESS, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          ensOnly: false,
          private: false,
          access: Access.UNKNOWN_ACCESS
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.ensOnly = reader.bool()
              break
            case 2:
              obj.private = reader.bool()
              break
            case 3:
              obj.access = CommunityPermissions.Access.codec().decode(reader)
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

  export const encode = (obj: Partial<CommunityPermissions>): Uint8Array => {
    return encodeMessage(obj, CommunityPermissions.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityPermissions => {
    return decodeMessage(buf, CommunityPermissions.codec())
  }
}

export interface CommunityDescription {
  clock: bigint
  members: Map<string, CommunityMember>
  permissions?: CommunityPermissions
  identity?: ChatIdentity
  chats: Map<string, CommunityChat>
  banList: string[]
  categories: Map<string, CommunityCategory>
  archiveMagnetlinkClock: bigint
  adminSettings?: CommunityAdminSettings
  introMessage: string
  outroMessage: string
  encrypted: boolean
  tags: string[]
}

export namespace CommunityDescription {
  export interface CommunityDescription$membersEntry {
    key: string
    value: CommunityMember
  }

  export namespace CommunityDescription$membersEntry {
    let _codec: Codec<CommunityDescription$membersEntry>

    export const codec = (): Codec<CommunityDescription$membersEntry> => {
      if (_codec == null) {
        _codec = message<CommunityDescription$membersEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            CommunityMember.codec().encode(obj.value, w, {
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
                obj.value = CommunityMember.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<CommunityDescription$membersEntry>): Uint8Array => {
      return encodeMessage(obj, CommunityDescription$membersEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityDescription$membersEntry => {
      return decodeMessage(buf, CommunityDescription$membersEntry.codec())
    }
  }

  export interface CommunityDescription$chatsEntry {
    key: string
    value: CommunityChat
  }

  export namespace CommunityDescription$chatsEntry {
    let _codec: Codec<CommunityDescription$chatsEntry>

    export const codec = (): Codec<CommunityDescription$chatsEntry> => {
      if (_codec == null) {
        _codec = message<CommunityDescription$chatsEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            CommunityChat.codec().encode(obj.value, w, {
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
                obj.value = CommunityChat.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<CommunityDescription$chatsEntry>): Uint8Array => {
      return encodeMessage(obj, CommunityDescription$chatsEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityDescription$chatsEntry => {
      return decodeMessage(buf, CommunityDescription$chatsEntry.codec())
    }
  }

  export interface CommunityDescription$categoriesEntry {
    key: string
    value: CommunityCategory
  }

  export namespace CommunityDescription$categoriesEntry {
    let _codec: Codec<CommunityDescription$categoriesEntry>

    export const codec = (): Codec<CommunityDescription$categoriesEntry> => {
      if (_codec == null) {
        _codec = message<CommunityDescription$categoriesEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            CommunityCategory.codec().encode(obj.value, w, {
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
                obj.value = CommunityCategory.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<CommunityDescription$categoriesEntry>): Uint8Array => {
      return encodeMessage(obj, CommunityDescription$categoriesEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityDescription$categoriesEntry => {
      return decodeMessage(buf, CommunityDescription$categoriesEntry.codec())
    }
  }

  let _codec: Codec<CommunityDescription>

  export const codec = (): Codec<CommunityDescription> => {
    if (_codec == null) {
      _codec = message<CommunityDescription>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (obj.members != null && obj.members.size !== 0) {
          for (const [key, value] of obj.members.entries()) {
            w.uint32(18)
            CommunityDescription.CommunityDescription$membersEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (obj.permissions != null) {
          w.uint32(26)
          CommunityPermissions.codec().encode(obj.permissions, w, {
            writeDefaults: false
          })
        }

        if (obj.identity != null) {
          w.uint32(42)
          ChatIdentity.codec().encode(obj.identity, w, {
            writeDefaults: false
          })
        }

        if (obj.chats != null && obj.chats.size !== 0) {
          for (const [key, value] of obj.chats.entries()) {
            w.uint32(50)
            CommunityDescription.CommunityDescription$chatsEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (obj.banList != null) {
          for (const value of obj.banList) {
            w.uint32(58)
            w.string(value)
          }
        }

        if (obj.categories != null && obj.categories.size !== 0) {
          for (const [key, value] of obj.categories.entries()) {
            w.uint32(66)
            CommunityDescription.CommunityDescription$categoriesEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.writeDefaults === true || (obj.archiveMagnetlinkClock != null && obj.archiveMagnetlinkClock !== 0n)) {
          w.uint32(72)
          w.uint64(obj.archiveMagnetlinkClock ?? 0n)
        }

        if (obj.adminSettings != null) {
          w.uint32(82)
          CommunityAdminSettings.codec().encode(obj.adminSettings, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.introMessage != null && obj.introMessage !== '')) {
          w.uint32(90)
          w.string(obj.introMessage ?? '')
        }

        if (opts.writeDefaults === true || (obj.outroMessage != null && obj.outroMessage !== '')) {
          w.uint32(98)
          w.string(obj.outroMessage ?? '')
        }

        if (opts.writeDefaults === true || (obj.encrypted != null && obj.encrypted !== false)) {
          w.uint32(104)
          w.bool(obj.encrypted ?? false)
        }

        if (obj.tags != null) {
          for (const value of obj.tags) {
            w.uint32(114)
            w.string(value)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          members: new Map<string, undefined>(),
          chats: new Map<string, undefined>(),
          banList: [],
          categories: new Map<string, undefined>(),
          archiveMagnetlinkClock: 0n,
          introMessage: '',
          outroMessage: '',
          encrypted: false,
          tags: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2: {
              const entry = CommunityDescription.CommunityDescription$membersEntry.codec().decode(reader, reader.uint32())
              obj.members.set(entry.key, entry.value)
              break
            }
            case 3:
              obj.permissions = CommunityPermissions.codec().decode(reader, reader.uint32())
              break
            case 5:
              obj.identity = ChatIdentity.codec().decode(reader, reader.uint32())
              break
            case 6: {
              const entry = CommunityDescription.CommunityDescription$chatsEntry.codec().decode(reader, reader.uint32())
              obj.chats.set(entry.key, entry.value)
              break
            }
            case 7:
              obj.banList.push(reader.string())
              break
            case 8: {
              const entry = CommunityDescription.CommunityDescription$categoriesEntry.codec().decode(reader, reader.uint32())
              obj.categories.set(entry.key, entry.value)
              break
            }
            case 9:
              obj.archiveMagnetlinkClock = reader.uint64()
              break
            case 10:
              obj.adminSettings = CommunityAdminSettings.codec().decode(reader, reader.uint32())
              break
            case 11:
              obj.introMessage = reader.string()
              break
            case 12:
              obj.outroMessage = reader.string()
              break
            case 13:
              obj.encrypted = reader.bool()
              break
            case 14:
              obj.tags.push(reader.string())
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

  export const encode = (obj: Partial<CommunityDescription>): Uint8Array => {
    return encodeMessage(obj, CommunityDescription.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityDescription => {
    return decodeMessage(buf, CommunityDescription.codec())
  }
}

export interface CommunityAdminSettings {
  pinMessageAllMembersEnabled: boolean
}

export namespace CommunityAdminSettings {
  let _codec: Codec<CommunityAdminSettings>

  export const codec = (): Codec<CommunityAdminSettings> => {
    if (_codec == null) {
      _codec = message<CommunityAdminSettings>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.pinMessageAllMembersEnabled != null && obj.pinMessageAllMembersEnabled !== false)) {
          w.uint32(8)
          w.bool(obj.pinMessageAllMembersEnabled ?? false)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          pinMessageAllMembersEnabled: false
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.pinMessageAllMembersEnabled = reader.bool()
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

  export const encode = (obj: Partial<CommunityAdminSettings>): Uint8Array => {
    return encodeMessage(obj, CommunityAdminSettings.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityAdminSettings => {
    return decodeMessage(buf, CommunityAdminSettings.codec())
  }
}

export interface CommunityChat {
  members: Map<string, CommunityMember>
  permissions?: CommunityPermissions
  identity?: ChatIdentity
  categoryId: string
  position: number
}

export namespace CommunityChat {
  export interface CommunityChat$membersEntry {
    key: string
    value: CommunityMember
  }

  export namespace CommunityChat$membersEntry {
    let _codec: Codec<CommunityChat$membersEntry>

    export const codec = (): Codec<CommunityChat$membersEntry> => {
      if (_codec == null) {
        _codec = message<CommunityChat$membersEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            CommunityMember.codec().encode(obj.value, w, {
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
                obj.value = CommunityMember.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<CommunityChat$membersEntry>): Uint8Array => {
      return encodeMessage(obj, CommunityChat$membersEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityChat$membersEntry => {
      return decodeMessage(buf, CommunityChat$membersEntry.codec())
    }
  }

  let _codec: Codec<CommunityChat>

  export const codec = (): Codec<CommunityChat> => {
    if (_codec == null) {
      _codec = message<CommunityChat>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.members != null && obj.members.size !== 0) {
          for (const [key, value] of obj.members.entries()) {
            w.uint32(10)
            CommunityChat.CommunityChat$membersEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (obj.permissions != null) {
          w.uint32(18)
          CommunityPermissions.codec().encode(obj.permissions, w, {
            writeDefaults: false
          })
        }

        if (obj.identity != null) {
          w.uint32(26)
          ChatIdentity.codec().encode(obj.identity, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.categoryId != null && obj.categoryId !== '')) {
          w.uint32(34)
          w.string(obj.categoryId ?? '')
        }

        if (opts.writeDefaults === true || (obj.position != null && obj.position !== 0)) {
          w.uint32(40)
          w.int32(obj.position ?? 0)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          members: new Map<string, undefined>(),
          categoryId: '',
          position: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              const entry = CommunityChat.CommunityChat$membersEntry.codec().decode(reader, reader.uint32())
              obj.members.set(entry.key, entry.value)
              break
            }
            case 2:
              obj.permissions = CommunityPermissions.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.identity = ChatIdentity.codec().decode(reader, reader.uint32())
              break
            case 4:
              obj.categoryId = reader.string()
              break
            case 5:
              obj.position = reader.int32()
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

  export const encode = (obj: Partial<CommunityChat>): Uint8Array => {
    return encodeMessage(obj, CommunityChat.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityChat => {
    return decodeMessage(buf, CommunityChat.codec())
  }
}

export interface CommunityCategory {
  categoryId: string
  name: string
  position: number
}

export namespace CommunityCategory {
  let _codec: Codec<CommunityCategory>

  export const codec = (): Codec<CommunityCategory> => {
    if (_codec == null) {
      _codec = message<CommunityCategory>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.categoryId != null && obj.categoryId !== '')) {
          w.uint32(10)
          w.string(obj.categoryId ?? '')
        }

        if (opts.writeDefaults === true || (obj.name != null && obj.name !== '')) {
          w.uint32(18)
          w.string(obj.name ?? '')
        }

        if (opts.writeDefaults === true || (obj.position != null && obj.position !== 0)) {
          w.uint32(24)
          w.int32(obj.position ?? 0)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          categoryId: '',
          name: '',
          position: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.categoryId = reader.string()
              break
            case 2:
              obj.name = reader.string()
              break
            case 3:
              obj.position = reader.int32()
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

  export const encode = (obj: Partial<CommunityCategory>): Uint8Array => {
    return encodeMessage(obj, CommunityCategory.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityCategory => {
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
  let _codec: Codec<CommunityInvitation>

  export const codec = (): Codec<CommunityInvitation> => {
    if (_codec == null) {
      _codec = message<CommunityInvitation>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.communityDescription != null && obj.communityDescription.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.communityDescription ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.grant ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.publicKey != null && obj.publicKey.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.publicKey ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          communityDescription: new Uint8Array(0),
          grant: new Uint8Array(0),
          chatId: '',
          publicKey: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.communityDescription = reader.bytes()
              break
            case 2:
              obj.grant = reader.bytes()
              break
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.publicKey = reader.bytes()
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

  export const encode = (obj: Partial<CommunityInvitation>): Uint8Array => {
    return encodeMessage(obj, CommunityInvitation.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityInvitation => {
    return decodeMessage(buf, CommunityInvitation.codec())
  }
}

export interface CommunityRequestToJoin {
  clock: bigint
  ensName: string
  chatId: string
  communityId: Uint8Array
  displayName: string
}

export namespace CommunityRequestToJoin {
  let _codec: Codec<CommunityRequestToJoin>

  export const codec = (): Codec<CommunityRequestToJoin> => {
    if (_codec == null) {
      _codec = message<CommunityRequestToJoin>((obj, w, opts = {}) => {
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

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.communityId != null && obj.communityId.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.communityId ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.displayName != null && obj.displayName !== '')) {
          w.uint32(42)
          w.string(obj.displayName ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          ensName: '',
          chatId: '',
          communityId: new Uint8Array(0),
          displayName: ''
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
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.communityId = reader.bytes()
              break
            case 5:
              obj.displayName = reader.string()
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

  export const encode = (obj: Partial<CommunityRequestToJoin>): Uint8Array => {
    return encodeMessage(obj, CommunityRequestToJoin.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityRequestToJoin => {
    return decodeMessage(buf, CommunityRequestToJoin.codec())
  }
}

export interface CommunityCancelRequestToJoin {
  clock: bigint
  ensName: string
  chatId: string
  communityId: Uint8Array
  displayName: string
}

export namespace CommunityCancelRequestToJoin {
  let _codec: Codec<CommunityCancelRequestToJoin>

  export const codec = (): Codec<CommunityCancelRequestToJoin> => {
    if (_codec == null) {
      _codec = message<CommunityCancelRequestToJoin>((obj, w, opts = {}) => {
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

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.communityId != null && obj.communityId.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.communityId ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.displayName != null && obj.displayName !== '')) {
          w.uint32(42)
          w.string(obj.displayName ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          ensName: '',
          chatId: '',
          communityId: new Uint8Array(0),
          displayName: ''
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
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.communityId = reader.bytes()
              break
            case 5:
              obj.displayName = reader.string()
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

  export const encode = (obj: Partial<CommunityCancelRequestToJoin>): Uint8Array => {
    return encodeMessage(obj, CommunityCancelRequestToJoin.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityCancelRequestToJoin => {
    return decodeMessage(buf, CommunityCancelRequestToJoin.codec())
  }
}

export interface CommunityRequestToJoinResponse {
  clock: bigint
  community?: CommunityDescription
  accepted: boolean
  grant: Uint8Array
  communityId: Uint8Array
  magnetUri: string
}

export namespace CommunityRequestToJoinResponse {
  let _codec: Codec<CommunityRequestToJoinResponse>

  export const codec = (): Codec<CommunityRequestToJoinResponse> => {
    if (_codec == null) {
      _codec = message<CommunityRequestToJoinResponse>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (obj.community != null) {
          w.uint32(18)
          CommunityDescription.codec().encode(obj.community, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.accepted != null && obj.accepted !== false)) {
          w.uint32(24)
          w.bool(obj.accepted ?? false)
        }

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.grant ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.communityId != null && obj.communityId.byteLength > 0)) {
          w.uint32(42)
          w.bytes(obj.communityId ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.magnetUri != null && obj.magnetUri !== '')) {
          w.uint32(50)
          w.string(obj.magnetUri ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          accepted: false,
          grant: new Uint8Array(0),
          communityId: new Uint8Array(0),
          magnetUri: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.community = CommunityDescription.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.accepted = reader.bool()
              break
            case 4:
              obj.grant = reader.bytes()
              break
            case 5:
              obj.communityId = reader.bytes()
              break
            case 6:
              obj.magnetUri = reader.string()
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

  export const encode = (obj: Partial<CommunityRequestToJoinResponse>): Uint8Array => {
    return encodeMessage(obj, CommunityRequestToJoinResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityRequestToJoinResponse => {
    return decodeMessage(buf, CommunityRequestToJoinResponse.codec())
  }
}

export interface CommunityRequestToLeave {
  clock: bigint
  communityId: Uint8Array
}

export namespace CommunityRequestToLeave {
  let _codec: Codec<CommunityRequestToLeave>

  export const codec = (): Codec<CommunityRequestToLeave> => {
    if (_codec == null) {
      _codec = message<CommunityRequestToLeave>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.communityId != null && obj.communityId.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.communityId ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          communityId: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.communityId = reader.bytes()
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

  export const encode = (obj: Partial<CommunityRequestToLeave>): Uint8Array => {
    return encodeMessage(obj, CommunityRequestToLeave.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityRequestToLeave => {
    return decodeMessage(buf, CommunityRequestToLeave.codec())
  }
}

export interface CommunityMessageArchiveMagnetlink {
  clock: bigint
  magnetUri: string
}

export namespace CommunityMessageArchiveMagnetlink {
  let _codec: Codec<CommunityMessageArchiveMagnetlink>

  export const codec = (): Codec<CommunityMessageArchiveMagnetlink> => {
    if (_codec == null) {
      _codec = message<CommunityMessageArchiveMagnetlink>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.magnetUri != null && obj.magnetUri !== '')) {
          w.uint32(18)
          w.string(obj.magnetUri ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          magnetUri: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.magnetUri = reader.string()
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

  export const encode = (obj: Partial<CommunityMessageArchiveMagnetlink>): Uint8Array => {
    return encodeMessage(obj, CommunityMessageArchiveMagnetlink.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): CommunityMessageArchiveMagnetlink => {
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
  thirdPartyId: string
}

export namespace WakuMessage {
  let _codec: Codec<WakuMessage>

  export const codec = (): Codec<WakuMessage> => {
    if (_codec == null) {
      _codec = message<WakuMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.sig != null && obj.sig.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.sig ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.timestamp != null && obj.timestamp !== 0n)) {
          w.uint32(16)
          w.uint64(obj.timestamp ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.topic != null && obj.topic.byteLength > 0)) {
          w.uint32(26)
          w.bytes(obj.topic ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.padding != null && obj.padding.byteLength > 0)) {
          w.uint32(42)
          w.bytes(obj.padding ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.hash != null && obj.hash.byteLength > 0)) {
          w.uint32(50)
          w.bytes(obj.hash ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.thirdPartyId != null && obj.thirdPartyId !== '')) {
          w.uint32(58)
          w.string(obj.thirdPartyId ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          sig: new Uint8Array(0),
          timestamp: 0n,
          topic: new Uint8Array(0),
          payload: new Uint8Array(0),
          padding: new Uint8Array(0),
          hash: new Uint8Array(0),
          thirdPartyId: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.sig = reader.bytes()
              break
            case 2:
              obj.timestamp = reader.uint64()
              break
            case 3:
              obj.topic = reader.bytes()
              break
            case 4:
              obj.payload = reader.bytes()
              break
            case 5:
              obj.padding = reader.bytes()
              break
            case 6:
              obj.hash = reader.bytes()
              break
            case 7:
              obj.thirdPartyId = reader.string()
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

  export const encode = (obj: Partial<WakuMessage>): Uint8Array => {
    return encodeMessage(obj, WakuMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessage => {
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
  let _codec: Codec<WakuMessageArchiveMetadata>

  export const codec = (): Codec<WakuMessageArchiveMetadata> => {
    if (_codec == null) {
      _codec = message<WakuMessageArchiveMetadata>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.version != null && obj.version !== 0)) {
          w.uint32(8)
          w.uint32(obj.version ?? 0)
        }

        if (opts.writeDefaults === true || (obj.from != null && obj.from !== 0n)) {
          w.uint32(16)
          w.uint64(obj.from ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.to != null && obj.to !== 0n)) {
          w.uint32(24)
          w.uint64(obj.to ?? 0n)
        }

        if (obj.contentTopic != null) {
          for (const value of obj.contentTopic) {
            w.uint32(34)
            w.bytes(value)
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          version: 0,
          from: 0n,
          to: 0n,
          contentTopic: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.version = reader.uint32()
              break
            case 2:
              obj.from = reader.uint64()
              break
            case 3:
              obj.to = reader.uint64()
              break
            case 4:
              obj.contentTopic.push(reader.bytes())
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

  export const encode = (obj: Partial<WakuMessageArchiveMetadata>): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveMetadata.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessageArchiveMetadata => {
    return decodeMessage(buf, WakuMessageArchiveMetadata.codec())
  }
}

export interface WakuMessageArchive {
  version: number
  metadata?: WakuMessageArchiveMetadata
  messages: WakuMessage[]
}

export namespace WakuMessageArchive {
  let _codec: Codec<WakuMessageArchive>

  export const codec = (): Codec<WakuMessageArchive> => {
    if (_codec == null) {
      _codec = message<WakuMessageArchive>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.version != null && obj.version !== 0)) {
          w.uint32(8)
          w.uint32(obj.version ?? 0)
        }

        if (obj.metadata != null) {
          w.uint32(18)
          WakuMessageArchiveMetadata.codec().encode(obj.metadata, w, {
            writeDefaults: false
          })
        }

        if (obj.messages != null) {
          for (const value of obj.messages) {
            w.uint32(26)
            WakuMessage.codec().encode(value, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          version: 0,
          messages: []
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.version = reader.uint32()
              break
            case 2:
              obj.metadata = WakuMessageArchiveMetadata.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.messages.push(WakuMessage.codec().decode(reader, reader.uint32()))
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

  export const encode = (obj: Partial<WakuMessageArchive>): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchive.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessageArchive => {
    return decodeMessage(buf, WakuMessageArchive.codec())
  }
}

export interface WakuMessageArchiveIndexMetadata {
  version: number
  metadata?: WakuMessageArchiveMetadata
  offset: bigint
  size: bigint
  padding: bigint
}

export namespace WakuMessageArchiveIndexMetadata {
  let _codec: Codec<WakuMessageArchiveIndexMetadata>

  export const codec = (): Codec<WakuMessageArchiveIndexMetadata> => {
    if (_codec == null) {
      _codec = message<WakuMessageArchiveIndexMetadata>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.version != null && obj.version !== 0)) {
          w.uint32(8)
          w.uint32(obj.version ?? 0)
        }

        if (obj.metadata != null) {
          w.uint32(18)
          WakuMessageArchiveMetadata.codec().encode(obj.metadata, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.offset != null && obj.offset !== 0n)) {
          w.uint32(24)
          w.uint64(obj.offset ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.size != null && obj.size !== 0n)) {
          w.uint32(32)
          w.uint64(obj.size ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.padding != null && obj.padding !== 0n)) {
          w.uint32(40)
          w.uint64(obj.padding ?? 0n)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          version: 0,
          offset: 0n,
          size: 0n,
          padding: 0n
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.version = reader.uint32()
              break
            case 2:
              obj.metadata = WakuMessageArchiveMetadata.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.offset = reader.uint64()
              break
            case 4:
              obj.size = reader.uint64()
              break
            case 5:
              obj.padding = reader.uint64()
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

  export const encode = (obj: Partial<WakuMessageArchiveIndexMetadata>): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveIndexMetadata.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessageArchiveIndexMetadata => {
    return decodeMessage(buf, WakuMessageArchiveIndexMetadata.codec())
  }
}

export interface WakuMessageArchiveIndex {
  archives: Map<string, WakuMessageArchiveIndexMetadata>
}

export namespace WakuMessageArchiveIndex {
  export interface WakuMessageArchiveIndex$archivesEntry {
    key: string
    value: WakuMessageArchiveIndexMetadata
  }

  export namespace WakuMessageArchiveIndex$archivesEntry {
    let _codec: Codec<WakuMessageArchiveIndex$archivesEntry>

    export const codec = (): Codec<WakuMessageArchiveIndex$archivesEntry> => {
      if (_codec == null) {
        _codec = message<WakuMessageArchiveIndex$archivesEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            WakuMessageArchiveIndexMetadata.codec().encode(obj.value, w, {
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
                obj.value = WakuMessageArchiveIndexMetadata.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<WakuMessageArchiveIndex$archivesEntry>): Uint8Array => {
      return encodeMessage(obj, WakuMessageArchiveIndex$archivesEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessageArchiveIndex$archivesEntry => {
      return decodeMessage(buf, WakuMessageArchiveIndex$archivesEntry.codec())
    }
  }

  let _codec: Codec<WakuMessageArchiveIndex>

  export const codec = (): Codec<WakuMessageArchiveIndex> => {
    if (_codec == null) {
      _codec = message<WakuMessageArchiveIndex>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.archives != null && obj.archives.size !== 0) {
          for (const [key, value] of obj.archives.entries()) {
            w.uint32(10)
            WakuMessageArchiveIndex.WakuMessageArchiveIndex$archivesEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          archives: new Map<string, undefined>()
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              const entry = WakuMessageArchiveIndex.WakuMessageArchiveIndex$archivesEntry.codec().decode(reader, reader.uint32())
              obj.archives.set(entry.key, entry.value)
              break
            }
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

  export const encode = (obj: Partial<WakuMessageArchiveIndex>): Uint8Array => {
    return encodeMessage(obj, WakuMessageArchiveIndex.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): WakuMessageArchiveIndex => {
    return decodeMessage(buf, WakuMessageArchiveIndex.codec())
  }
}

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
