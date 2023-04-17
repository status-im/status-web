// @generated by protoc-gen-es v1.0.0 with parameter "target=ts"
// @generated from file membership-update-message.proto (syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf'
import { Message, proto3, protoInt64 } from '@bufbuild/protobuf'
import { ChatMessage } from './chat-message_pb.js'
import { EmojiReaction } from './emoji-reaction_pb.js'

/**
 * @generated from message MembershipUpdateEvent
 */
export class MembershipUpdateEvent extends Message<MembershipUpdateEvent> {
  /**
   * Lamport timestamp of the event
   *
   * @generated from field: uint64 clock = 1;
   */
  clock = protoInt64.zero

  /**
   * List of public keys of objects of the action
   *
   * @generated from field: repeated string members = 2;
   */
  members: string[] = []

  /**
   * Name of the chat for the CHAT_CREATED/NAME_CHANGED event types
   *
   * @generated from field: string name = 3;
   */
  name = ''

  /**
   * The type of the event
   *
   * @generated from field: MembershipUpdateEvent.EventType type = 4;
   */
  type = MembershipUpdateEvent_EventType.UNKNOWN

  constructor(data?: PartialMessage<MembershipUpdateEvent>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime = proto3
  static readonly typeName = 'MembershipUpdateEvent'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'clock', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    {
      no: 2,
      name: 'members',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
    { no: 3, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 4,
      name: 'type',
      kind: 'enum',
      T: proto3.getEnumType(MembershipUpdateEvent_EventType),
    },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): MembershipUpdateEvent {
    return new MembershipUpdateEvent().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): MembershipUpdateEvent {
    return new MembershipUpdateEvent().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): MembershipUpdateEvent {
    return new MembershipUpdateEvent().fromJsonString(jsonString, options)
  }

  static equals(
    a: MembershipUpdateEvent | PlainMessage<MembershipUpdateEvent> | undefined,
    b: MembershipUpdateEvent | PlainMessage<MembershipUpdateEvent> | undefined
  ): boolean {
    return proto3.util.equals(MembershipUpdateEvent, a, b)
  }
}

/**
 * @generated from enum MembershipUpdateEvent.EventType
 */
export enum MembershipUpdateEvent_EventType {
  /**
   * @generated from enum value: UNKNOWN = 0;
   */
  UNKNOWN = 0,

  /**
   * @generated from enum value: CHAT_CREATED = 1;
   */
  CHAT_CREATED = 1,

  /**
   * @generated from enum value: NAME_CHANGED = 2;
   */
  NAME_CHANGED = 2,

  /**
   * @generated from enum value: MEMBERS_ADDED = 3;
   */
  MEMBERS_ADDED = 3,

  /**
   * @generated from enum value: MEMBER_JOINED = 4;
   */
  MEMBER_JOINED = 4,

  /**
   * @generated from enum value: MEMBER_REMOVED = 5;
   */
  MEMBER_REMOVED = 5,

  /**
   * @generated from enum value: ADMINS_ADDED = 6;
   */
  ADMINS_ADDED = 6,

  /**
   * @generated from enum value: ADMIN_REMOVED = 7;
   */
  ADMIN_REMOVED = 7,
}
// Retrieve enum metadata with: proto3.getEnumType(MembershipUpdateEvent_EventType)
proto3.util.setEnumType(
  MembershipUpdateEvent_EventType,
  'MembershipUpdateEvent.EventType',
  [
    { no: 0, name: 'UNKNOWN' },
    { no: 1, name: 'CHAT_CREATED' },
    { no: 2, name: 'NAME_CHANGED' },
    { no: 3, name: 'MEMBERS_ADDED' },
    { no: 4, name: 'MEMBER_JOINED' },
    { no: 5, name: 'MEMBER_REMOVED' },
    { no: 6, name: 'ADMINS_ADDED' },
    { no: 7, name: 'ADMIN_REMOVED' },
  ]
)

/**
 * MembershipUpdateMessage is a message used to propagate information
 * about group membership changes.
 * For more information, see https://github.com/status-im/specs/blob/master/status-group-chats-spec.md.
 *
 * @generated from message MembershipUpdateMessage
 */
export class MembershipUpdateMessage extends Message<MembershipUpdateMessage> {
  /**
   * The chat id of the private group chat
   *
   * @generated from field: string chat_id = 1;
   */
  chatId = ''

  /**
   * A list of events for this group chat, first x bytes are the signature, then is a
   * protobuf encoded MembershipUpdateEvent
   *
   * @generated from field: repeated bytes events = 2;
   */
  events: Uint8Array[] = []

  /**
   * An optional chat message
   *
   * @generated from oneof MembershipUpdateMessage.chat_entity
   */
  chatEntity:
    | {
        /**
         * @generated from field: ChatMessage message = 3;
         */
        value: ChatMessage
        case: 'message'
      }
    | {
        /**
         * @generated from field: EmojiReaction emoji_reaction = 4;
         */
        value: EmojiReaction
        case: 'emojiReaction'
      }
    | { case: undefined; value?: undefined } = { case: undefined }

  constructor(data?: PartialMessage<MembershipUpdateMessage>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime = proto3
  static readonly typeName = 'MembershipUpdateMessage'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'chat_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'events',
      kind: 'scalar',
      T: 12 /* ScalarType.BYTES */,
      repeated: true,
    },
    {
      no: 3,
      name: 'message',
      kind: 'message',
      T: ChatMessage,
      oneof: 'chat_entity',
    },
    {
      no: 4,
      name: 'emoji_reaction',
      kind: 'message',
      T: EmojiReaction,
      oneof: 'chat_entity',
    },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): MembershipUpdateMessage {
    return new MembershipUpdateMessage().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): MembershipUpdateMessage {
    return new MembershipUpdateMessage().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): MembershipUpdateMessage {
    return new MembershipUpdateMessage().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | MembershipUpdateMessage
      | PlainMessage<MembershipUpdateMessage>
      | undefined,
    b:
      | MembershipUpdateMessage
      | PlainMessage<MembershipUpdateMessage>
      | undefined
  ): boolean {
    return proto3.util.equals(MembershipUpdateMessage, a, b)
  }
}
