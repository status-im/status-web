/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  ImageType,
  imageTypeFromJSON,
  imageTypeToJSON,
} from "../../communities/v1/enums";

export const protobufPackage = "communities.v1";

/** ChatIdentity represents the user defined identity associated with their public chat key */
export interface ChatIdentity {
  /** Lamport timestamp of the message */
  clock: number;
  /** ens_name is the valid ENS name associated with the chat key */
  ensName: string;
  /** images is a string indexed mapping of images associated with an identity */
  images: { [key: string]: IdentityImage };
  /** display name is the user set identity, valid only for organisations */
  displayName: string;
  /** description is the user set description, valid only for organisations */
  description: string;
  color: string;
}

export interface ChatIdentity_ImagesEntry {
  key: string;
  value: IdentityImage | undefined;
}

/** ProfileImage represents data associated with a user's profile image */
export interface IdentityImage {
  /**
   * payload is a context based payload for the profile image data,
   * context is determined by the `source_type`
   */
  payload: Uint8Array;
  /** source_type signals the image payload source */
  sourceType: IdentityImage_SourceType;
  /** image_type signals the image type and method of parsing the payload */
  imageType: ImageType;
}

/** SourceType are the predefined types of image source allowed */
export enum IdentityImage_SourceType {
  UNKNOWN_SOURCE_TYPE = 0,
  /** RAW_PAYLOAD - RAW_PAYLOAD image byte data */
  RAW_PAYLOAD = 1,
  /**
   * ENS_AVATAR - ENS_AVATAR uses the ENS record's resolver get-text-data.avatar data
   * The `payload` field will be ignored if ENS_AVATAR is selected
   * The application will read and parse the ENS avatar data as image payload data, URLs will be ignored
   * The parent `ChatMessageIdentity` must have a valid `ens_name` set
   */
  ENS_AVATAR = 2,
  UNRECOGNIZED = -1,
}

export function identityImage_SourceTypeFromJSON(
  object: any
): IdentityImage_SourceType {
  switch (object) {
    case 0:
    case "UNKNOWN_SOURCE_TYPE":
      return IdentityImage_SourceType.UNKNOWN_SOURCE_TYPE;
    case 1:
    case "RAW_PAYLOAD":
      return IdentityImage_SourceType.RAW_PAYLOAD;
    case 2:
    case "ENS_AVATAR":
      return IdentityImage_SourceType.ENS_AVATAR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return IdentityImage_SourceType.UNRECOGNIZED;
  }
}

export function identityImage_SourceTypeToJSON(
  object: IdentityImage_SourceType
): string {
  switch (object) {
    case IdentityImage_SourceType.UNKNOWN_SOURCE_TYPE:
      return "UNKNOWN_SOURCE_TYPE";
    case IdentityImage_SourceType.RAW_PAYLOAD:
      return "RAW_PAYLOAD";
    case IdentityImage_SourceType.ENS_AVATAR:
      return "ENS_AVATAR";
    default:
      return "UNKNOWN";
  }
}

const baseChatIdentity: object = {
  clock: 0,
  ensName: "",
  displayName: "",
  description: "",
  color: "",
};

export const ChatIdentity = {
  encode(
    message: ChatIdentity,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock);
    }
    if (message.ensName !== "") {
      writer.uint32(18).string(message.ensName);
    }
    Object.entries(message.images).forEach(([key, value]) => {
      ChatIdentity_ImagesEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    if (message.displayName !== "") {
      writer.uint32(34).string(message.displayName);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.color !== "") {
      writer.uint32(50).string(message.color);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatIdentity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseChatIdentity } as ChatIdentity;
    message.images = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.ensName = reader.string();
          break;
        case 3:
          const entry3 = ChatIdentity_ImagesEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry3.value !== undefined) {
            message.images[entry3.key] = entry3.value;
          }
          break;
        case 4:
          message.displayName = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.color = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChatIdentity {
    const message = { ...baseChatIdentity } as ChatIdentity;
    message.images = {};
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock);
    } else {
      message.clock = 0;
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = String(object.ensName);
    } else {
      message.ensName = "";
    }
    if (object.images !== undefined && object.images !== null) {
      Object.entries(object.images).forEach(([key, value]) => {
        message.images[key] = IdentityImage.fromJSON(value);
      });
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    } else {
      message.displayName = "";
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    } else {
      message.description = "";
    }
    if (object.color !== undefined && object.color !== null) {
      message.color = String(object.color);
    } else {
      message.color = "";
    }
    return message;
  },

  toJSON(message: ChatIdentity): unknown {
    const obj: any = {};
    message.clock !== undefined && (obj.clock = message.clock);
    message.ensName !== undefined && (obj.ensName = message.ensName);
    obj.images = {};
    if (message.images) {
      Object.entries(message.images).forEach(([k, v]) => {
        obj.images[k] = IdentityImage.toJSON(v);
      });
    }
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.color !== undefined && (obj.color = message.color);
    return obj;
  },

  fromPartial(object: DeepPartial<ChatIdentity>): ChatIdentity {
    const message = { ...baseChatIdentity } as ChatIdentity;
    message.images = {};
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock;
    } else {
      message.clock = 0;
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = object.ensName;
    } else {
      message.ensName = "";
    }
    if (object.images !== undefined && object.images !== null) {
      Object.entries(object.images).forEach(([key, value]) => {
        if (value !== undefined) {
          message.images[key] = IdentityImage.fromPartial(value);
        }
      });
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    } else {
      message.displayName = "";
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    } else {
      message.description = "";
    }
    if (object.color !== undefined && object.color !== null) {
      message.color = object.color;
    } else {
      message.color = "";
    }
    return message;
  },
};

const baseChatIdentity_ImagesEntry: object = { key: "" };

export const ChatIdentity_ImagesEntry = {
  encode(
    message: ChatIdentity_ImagesEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      IdentityImage.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ChatIdentity_ImagesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseChatIdentity_ImagesEntry,
    } as ChatIdentity_ImagesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = IdentityImage.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChatIdentity_ImagesEntry {
    const message = {
      ...baseChatIdentity_ImagesEntry,
    } as ChatIdentity_ImagesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    } else {
      message.key = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = IdentityImage.fromJSON(object.value);
    } else {
      message.value = undefined;
    }
    return message;
  },

  toJSON(message: ChatIdentity_ImagesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? IdentityImage.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ChatIdentity_ImagesEntry>
  ): ChatIdentity_ImagesEntry {
    const message = {
      ...baseChatIdentity_ImagesEntry,
    } as ChatIdentity_ImagesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = "";
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = IdentityImage.fromPartial(object.value);
    } else {
      message.value = undefined;
    }
    return message;
  },
};

const baseIdentityImage: object = { sourceType: 0, imageType: 0 };

export const IdentityImage = {
  encode(
    message: IdentityImage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.payload.length !== 0) {
      writer.uint32(10).bytes(message.payload);
    }
    if (message.sourceType !== 0) {
      writer.uint32(16).int32(message.sourceType);
    }
    if (message.imageType !== 0) {
      writer.uint32(24).int32(message.imageType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IdentityImage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseIdentityImage } as IdentityImage;
    message.payload = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payload = reader.bytes();
          break;
        case 2:
          message.sourceType = reader.int32() as any;
          break;
        case 3:
          message.imageType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IdentityImage {
    const message = { ...baseIdentityImage } as IdentityImage;
    message.payload = new Uint8Array();
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = bytesFromBase64(object.payload);
    }
    if (object.sourceType !== undefined && object.sourceType !== null) {
      message.sourceType = identityImage_SourceTypeFromJSON(object.sourceType);
    } else {
      message.sourceType = 0;
    }
    if (object.imageType !== undefined && object.imageType !== null) {
      message.imageType = imageTypeFromJSON(object.imageType);
    } else {
      message.imageType = 0;
    }
    return message;
  },

  toJSON(message: IdentityImage): unknown {
    const obj: any = {};
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    message.sourceType !== undefined &&
      (obj.sourceType = identityImage_SourceTypeToJSON(message.sourceType));
    message.imageType !== undefined &&
      (obj.imageType = imageTypeToJSON(message.imageType));
    return obj;
  },

  fromPartial(object: DeepPartial<IdentityImage>): IdentityImage {
    const message = { ...baseIdentityImage } as IdentityImage;
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = object.payload;
    } else {
      message.payload = new Uint8Array();
    }
    if (object.sourceType !== undefined && object.sourceType !== null) {
      message.sourceType = object.sourceType;
    } else {
      message.sourceType = 0;
    }
    if (object.imageType !== undefined && object.imageType !== null) {
      message.imageType = object.imageType;
    } else {
      message.imageType = 0;
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
