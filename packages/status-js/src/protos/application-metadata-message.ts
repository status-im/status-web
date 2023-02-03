/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { enumeration, encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface ApplicationMetadataMessage {
  signature: Uint8Array
  payload: Uint8Array
  type: ApplicationMetadataMessage.Type
}

export namespace ApplicationMetadataMessage {
  export enum Type {
    TYPE_UNKNOWN_UNSPECIFIED = 'TYPE_UNKNOWN_UNSPECIFIED',
    TYPE_CHAT_MESSAGE = 'TYPE_CHAT_MESSAGE',
    TYPE_CONTACT_UPDATE = 'TYPE_CONTACT_UPDATE',
    TYPE_MEMBERSHIP_UPDATE_MESSAGE = 'TYPE_MEMBERSHIP_UPDATE_MESSAGE',
    TYPE_PAIR_INSTALLATION = 'TYPE_PAIR_INSTALLATION',
    TYPE_SYNC_INSTALLATION = 'TYPE_SYNC_INSTALLATION',
    TYPE_REQUEST_ADDRESS_FOR_TRANSACTION = 'TYPE_REQUEST_ADDRESS_FOR_TRANSACTION',
    TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION = 'TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION',
    TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION = 'TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION',
    TYPE_REQUEST_TRANSACTION = 'TYPE_REQUEST_TRANSACTION',
    TYPE_SEND_TRANSACTION = 'TYPE_SEND_TRANSACTION',
    TYPE_DECLINE_REQUEST_TRANSACTION = 'TYPE_DECLINE_REQUEST_TRANSACTION',
    TYPE_SYNC_INSTALLATION_CONTACT = 'TYPE_SYNC_INSTALLATION_CONTACT',
    TYPE_SYNC_INSTALLATION_ACCOUNT = 'TYPE_SYNC_INSTALLATION_ACCOUNT',
    TYPE_SYNC_INSTALLATION_PUBLIC_CHAT = 'TYPE_SYNC_INSTALLATION_PUBLIC_CHAT',
    TYPE_CONTACT_CODE_ADVERTISEMENT = 'TYPE_CONTACT_CODE_ADVERTISEMENT',
    TYPE_PUSH_NOTIFICATION_REGISTRATION = 'TYPE_PUSH_NOTIFICATION_REGISTRATION',
    TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE = 'TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE',
    TYPE_PUSH_NOTIFICATION_QUERY = 'TYPE_PUSH_NOTIFICATION_QUERY',
    TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE = 'TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE',
    TYPE_PUSH_NOTIFICATION_REQUEST = 'TYPE_PUSH_NOTIFICATION_REQUEST',
    TYPE_PUSH_NOTIFICATION_RESPONSE = 'TYPE_PUSH_NOTIFICATION_RESPONSE',
    TYPE_EMOJI_REACTION = 'TYPE_EMOJI_REACTION',
    TYPE_GROUP_CHAT_INVITATION = 'TYPE_GROUP_CHAT_INVITATION',
    TYPE_CHAT_IDENTITY = 'TYPE_CHAT_IDENTITY',
    TYPE_COMMUNITY_DESCRIPTION = 'TYPE_COMMUNITY_DESCRIPTION',
    TYPE_COMMUNITY_INVITATION = 'TYPE_COMMUNITY_INVITATION',
    TYPE_COMMUNITY_REQUEST_TO_JOIN = 'TYPE_COMMUNITY_REQUEST_TO_JOIN',
    TYPE_PIN_MESSAGE = 'TYPE_PIN_MESSAGE',
    TYPE_EDIT_MESSAGE = 'TYPE_EDIT_MESSAGE',
    TYPE_STATUS_UPDATE = 'TYPE_STATUS_UPDATE',
    TYPE_DELETE_MESSAGE = 'TYPE_DELETE_MESSAGE',
    TYPE_SYNC_INSTALLATION_COMMUNITY = 'TYPE_SYNC_INSTALLATION_COMMUNITY',
    TYPE_ANONYMOUS_METRIC_BATCH = 'TYPE_ANONYMOUS_METRIC_BATCH'
  }

  enum __TypeValues {
    TYPE_UNKNOWN_UNSPECIFIED = 0,
    TYPE_CHAT_MESSAGE = 1,
    TYPE_CONTACT_UPDATE = 2,
    TYPE_MEMBERSHIP_UPDATE_MESSAGE = 3,
    TYPE_PAIR_INSTALLATION = 4,
    TYPE_SYNC_INSTALLATION = 5,
    TYPE_REQUEST_ADDRESS_FOR_TRANSACTION = 6,
    TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION = 7,
    TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION = 8,
    TYPE_REQUEST_TRANSACTION = 9,
    TYPE_SEND_TRANSACTION = 10,
    TYPE_DECLINE_REQUEST_TRANSACTION = 11,
    TYPE_SYNC_INSTALLATION_CONTACT = 12,
    TYPE_SYNC_INSTALLATION_ACCOUNT = 13,
    TYPE_SYNC_INSTALLATION_PUBLIC_CHAT = 14,
    TYPE_CONTACT_CODE_ADVERTISEMENT = 15,
    TYPE_PUSH_NOTIFICATION_REGISTRATION = 16,
    TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE = 17,
    TYPE_PUSH_NOTIFICATION_QUERY = 18,
    TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE = 19,
    TYPE_PUSH_NOTIFICATION_REQUEST = 20,
    TYPE_PUSH_NOTIFICATION_RESPONSE = 21,
    TYPE_EMOJI_REACTION = 22,
    TYPE_GROUP_CHAT_INVITATION = 23,
    TYPE_CHAT_IDENTITY = 24,
    TYPE_COMMUNITY_DESCRIPTION = 25,
    TYPE_COMMUNITY_INVITATION = 26,
    TYPE_COMMUNITY_REQUEST_TO_JOIN = 27,
    TYPE_PIN_MESSAGE = 28,
    TYPE_EDIT_MESSAGE = 29,
    TYPE_STATUS_UPDATE = 30,
    TYPE_DELETE_MESSAGE = 31,
    TYPE_SYNC_INSTALLATION_COMMUNITY = 32,
    TYPE_ANONYMOUS_METRIC_BATCH = 33
  }

  export namespace Type {
    export const codec = (): Codec<Type> => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<ApplicationMetadataMessage>

  export const codec = (): Codec<ApplicationMetadataMessage> => {
    if (_codec == null) {
      _codec = message<ApplicationMetadataMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.signature != null && obj.signature.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.signature ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.type != null && __TypeValues[obj.type] !== 0)) {
          w.uint32(24)
          ApplicationMetadataMessage.Type.codec().encode(obj.type ?? ApplicationMetadataMessage.Type.TYPE_UNKNOWN_UNSPECIFIED, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          signature: new Uint8Array(0),
          payload: new Uint8Array(0),
          type: Type.TYPE_UNKNOWN_UNSPECIFIED
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.signature = reader.bytes()
              break
            case 2:
              obj.payload = reader.bytes()
              break
            case 3:
              obj.type = ApplicationMetadataMessage.Type.codec().decode(reader)
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

  export const encode = (obj: Partial<ApplicationMetadataMessage>): Uint8Array => {
    return encodeMessage(obj, ApplicationMetadataMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ApplicationMetadataMessage => {
    return decodeMessage(buf, ApplicationMetadataMessage.codec())
  }
}
