// generated by buf generate src/protos

// @generated by protoc-gen-es v1.0.0 with parameter "target=ts"
// @generated from file link-preview.proto (syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message CommunityPreview
 */
export class CommunityPreview extends Message<CommunityPreview> {
  /**
   * bytes banner = 1;
   * bytes photo = 2;
   *
   * @generated from field: string display_name = 3;
   */
  displayName = "";

  /**
   * @generated from field: string description = 4;
   */
  description = "";

  /**
   * @generated from field: uint32 members_count = 5;
   */
  membersCount = 0;

  /**
   * string app_url = 6;
   * repeated Tag tags = 7;
   *
   * @generated from field: string color = 8;
   */
  color = "";

  /**
   * todo?!: try it here instead of url
   * bytes public_key = 9;
   * bytes description = 10;
   * bytes signature = 11;
   *
   * @generated from field: string public_key = 12;
   */
  publicKey = "";

  constructor(data?: PartialMessage<CommunityPreview>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "CommunityPreview";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 3, name: "display_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "members_count", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 8, name: "color", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "public_key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CommunityPreview {
    return new CommunityPreview().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CommunityPreview {
    return new CommunityPreview().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CommunityPreview {
    return new CommunityPreview().fromJsonString(jsonString, options);
  }

  static equals(a: CommunityPreview | PlainMessage<CommunityPreview> | undefined, b: CommunityPreview | PlainMessage<CommunityPreview> | undefined): boolean {
    return proto3.util.equals(CommunityPreview, a, b);
  }
}

/**
 * @generated from message CommunityChatPreview
 */
export class CommunityChatPreview extends Message<CommunityChatPreview> {
  /**
   * todo?!: try it here instead of url
   * string uuid = 1;
   *
   * @generated from field: string display_name = 2;
   */
  displayName = "";

  /**
   * string description = 3;
   * uint32 members_count = 4;
   *
   * @generated from field: string emoji = 5;
   */
  emoji = "";

  /**
   * @generated from field: string color = 6;
   */
  color = "";

  /**
   * todo?!: try spreading instead to reduce size
   *
   * bytes public_key = 8;
   *
   * @generated from field: CommunityPreview community = 7;
   */
  community?: CommunityPreview;

  constructor(data?: PartialMessage<CommunityChatPreview>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "CommunityChatPreview";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "display_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "emoji", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "color", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "community", kind: "message", T: CommunityPreview },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CommunityChatPreview {
    return new CommunityChatPreview().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CommunityChatPreview {
    return new CommunityChatPreview().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CommunityChatPreview {
    return new CommunityChatPreview().fromJsonString(jsonString, options);
  }

  static equals(a: CommunityChatPreview | PlainMessage<CommunityChatPreview> | undefined, b: CommunityChatPreview | PlainMessage<CommunityChatPreview> | undefined): boolean {
    return proto3.util.equals(CommunityChatPreview, a, b);
  }
}

/**
 * @generated from message UserPreview
 */
export class UserPreview extends Message<UserPreview> {
  /**
   * bytes photo = 1;
   *
   * @generated from field: string display_name = 2;
   */
  displayName = "";

  /**
   * @generated from field: string description = 3;
   */
  description = "";

  /**
   * string emoji_hash = 4;
   * repeated Url social_urls = 5;
   * string app_url = 6;
   *
   * @generated from field: string color = 7;
   */
  color = "";

  constructor(data?: PartialMessage<UserPreview>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "UserPreview";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "display_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "color", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserPreview {
    return new UserPreview().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserPreview {
    return new UserPreview().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserPreview {
    return new UserPreview().fromJsonString(jsonString, options);
  }

  static equals(a: UserPreview | PlainMessage<UserPreview> | undefined, b: UserPreview | PlainMessage<UserPreview> | undefined): boolean {
    return proto3.util.equals(UserPreview, a, b);
  }
}
