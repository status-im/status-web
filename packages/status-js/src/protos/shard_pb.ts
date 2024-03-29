// @generated by protoc-gen-es v1.4.2 with parameter "target=ts"
// @generated from file shard.proto (syntax proto3)
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

/**
 * @generated from message Shard
 */
export class Shard extends Message<Shard> {
  /**
   * @generated from field: int32 cluster = 1;
   */
  cluster = 0

  /**
   * @generated from field: int32 index = 2;
   */
  index = 0

  constructor(data?: PartialMessage<Shard>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'Shard'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'cluster', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: 'index', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): Shard {
    return new Shard().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): Shard {
    return new Shard().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): Shard {
    return new Shard().fromJsonString(jsonString, options)
  }

  static equals(
    a: Shard | PlainMessage<Shard> | undefined,
    b: Shard | PlainMessage<Shard> | undefined
  ): boolean {
    return proto3.util.equals(Shard, a, b)
  }
}

/**
 * @generated from message PublicShardInfo
 */
export class PublicShardInfo extends Message<PublicShardInfo> {
  /**
   * clock
   *
   * @generated from field: uint64 clock = 1;
   */
  clock = protoInt64.zero

  /**
   * community ID
   *
   * @generated from field: bytes community_id = 2;
   */
  communityId = new Uint8Array(0)

  /**
   * shard information
   *
   * @generated from field: Shard shard = 3;
   */
  shard?: Shard

  /**
   * if chainID > 0, the signer must be verified through the community contract
   *
   * @generated from field: uint64 chainId = 4;
   */
  chainId = protoInt64.zero

  constructor(data?: PartialMessage<PublicShardInfo>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'PublicShardInfo'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'clock', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    {
      no: 2,
      name: 'community_id',
      kind: 'scalar',
      T: 12 /* ScalarType.BYTES */,
    },
    { no: 3, name: 'shard', kind: 'message', T: Shard },
    { no: 4, name: 'chainId', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PublicShardInfo {
    return new PublicShardInfo().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PublicShardInfo {
    return new PublicShardInfo().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PublicShardInfo {
    return new PublicShardInfo().fromJsonString(jsonString, options)
  }

  static equals(
    a: PublicShardInfo | PlainMessage<PublicShardInfo> | undefined,
    b: PublicShardInfo | PlainMessage<PublicShardInfo> | undefined
  ): boolean {
    return proto3.util.equals(PublicShardInfo, a, b)
  }
}

/**
 * @generated from message CommunityPublicShardInfo
 */
export class CommunityPublicShardInfo extends Message<CommunityPublicShardInfo> {
  /**
   * Signature of the payload field
   *
   * @generated from field: bytes signature = 1;
   */
  signature = new Uint8Array(0)

  /**
   * Marshaled PublicShardInfo
   *
   * @generated from field: bytes payload = 2;
   */
  payload = new Uint8Array(0)

  constructor(data?: PartialMessage<CommunityPublicShardInfo>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'CommunityPublicShardInfo'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'signature', kind: 'scalar', T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: 'payload', kind: 'scalar', T: 12 /* ScalarType.BYTES */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): CommunityPublicShardInfo {
    return new CommunityPublicShardInfo().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): CommunityPublicShardInfo {
    return new CommunityPublicShardInfo().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): CommunityPublicShardInfo {
    return new CommunityPublicShardInfo().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | CommunityPublicShardInfo
      | PlainMessage<CommunityPublicShardInfo>
      | undefined,
    b:
      | CommunityPublicShardInfo
      | PlainMessage<CommunityPublicShardInfo>
      | undefined
  ): boolean {
    return proto3.util.equals(CommunityPublicShardInfo, a, b)
  }
}
