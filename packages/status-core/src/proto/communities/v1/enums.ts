/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "communities.v1";

export enum MessageType {
  MESSAGE_TYPE_UNKNOWN_UNSPECIFIED = 0,
  MESSAGE_TYPE_ONE_TO_ONE = 1,
  MESSAGE_TYPE_MESSAGE_TYPE_PUBLIC_GROUP = 2,
  MESSAGE_TYPE_PRIVATE_GROUP = 3,
  /** MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP - Only local */
  MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP = 4,
  MESSAGE_TYPE_COMMUNITY_CHAT = 5,
  /** MESSAGE_TYPE_SYSTEM_MESSAGE_GAP - Only local */
  MESSAGE_TYPE_SYSTEM_MESSAGE_GAP = 6,
  UNRECOGNIZED = -1,
}

export function messageTypeFromJSON(object: any): MessageType {
  switch (object) {
    case 0:
    case "MESSAGE_TYPE_UNKNOWN_UNSPECIFIED":
      return MessageType.MESSAGE_TYPE_UNKNOWN_UNSPECIFIED;
    case 1:
    case "MESSAGE_TYPE_ONE_TO_ONE":
      return MessageType.MESSAGE_TYPE_ONE_TO_ONE;
    case 2:
    case "MESSAGE_TYPE_MESSAGE_TYPE_PUBLIC_GROUP":
      return MessageType.MESSAGE_TYPE_MESSAGE_TYPE_PUBLIC_GROUP;
    case 3:
    case "MESSAGE_TYPE_PRIVATE_GROUP":
      return MessageType.MESSAGE_TYPE_PRIVATE_GROUP;
    case 4:
    case "MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP":
      return MessageType.MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP;
    case 5:
    case "MESSAGE_TYPE_COMMUNITY_CHAT":
      return MessageType.MESSAGE_TYPE_COMMUNITY_CHAT;
    case 6:
    case "MESSAGE_TYPE_SYSTEM_MESSAGE_GAP":
      return MessageType.MESSAGE_TYPE_SYSTEM_MESSAGE_GAP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MessageType.UNRECOGNIZED;
  }
}

export function messageTypeToJSON(object: MessageType): string {
  switch (object) {
    case MessageType.MESSAGE_TYPE_UNKNOWN_UNSPECIFIED:
      return "MESSAGE_TYPE_UNKNOWN_UNSPECIFIED";
    case MessageType.MESSAGE_TYPE_ONE_TO_ONE:
      return "MESSAGE_TYPE_ONE_TO_ONE";
    case MessageType.MESSAGE_TYPE_MESSAGE_TYPE_PUBLIC_GROUP:
      return "MESSAGE_TYPE_MESSAGE_TYPE_PUBLIC_GROUP";
    case MessageType.MESSAGE_TYPE_PRIVATE_GROUP:
      return "MESSAGE_TYPE_PRIVATE_GROUP";
    case MessageType.MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP:
      return "MESSAGE_TYPE_SYSTEM_MESSAGE_PRIVATE_GROUP";
    case MessageType.MESSAGE_TYPE_COMMUNITY_CHAT:
      return "MESSAGE_TYPE_COMMUNITY_CHAT";
    case MessageType.MESSAGE_TYPE_SYSTEM_MESSAGE_GAP:
      return "MESSAGE_TYPE_SYSTEM_MESSAGE_GAP";
    default:
      return "UNKNOWN";
  }
}

export enum ImageType {
  IMAGE_TYPE_UNKNOWN_UNSPECIFIED = 0,
  /** IMAGE_TYPE_PNG - Raster image files is payload data that can be read as a raster image */
  IMAGE_TYPE_PNG = 1,
  IMAGE_TYPE_JPEG = 2,
  IMAGE_TYPE_WEBP = 3,
  IMAGE_TYPE_GIF = 4,
  UNRECOGNIZED = -1,
}

export function imageTypeFromJSON(object: any): ImageType {
  switch (object) {
    case 0:
    case "IMAGE_TYPE_UNKNOWN_UNSPECIFIED":
      return ImageType.IMAGE_TYPE_UNKNOWN_UNSPECIFIED;
    case 1:
    case "IMAGE_TYPE_PNG":
      return ImageType.IMAGE_TYPE_PNG;
    case 2:
    case "IMAGE_TYPE_JPEG":
      return ImageType.IMAGE_TYPE_JPEG;
    case 3:
    case "IMAGE_TYPE_WEBP":
      return ImageType.IMAGE_TYPE_WEBP;
    case 4:
    case "IMAGE_TYPE_GIF":
      return ImageType.IMAGE_TYPE_GIF;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ImageType.UNRECOGNIZED;
  }
}

export function imageTypeToJSON(object: ImageType): string {
  switch (object) {
    case ImageType.IMAGE_TYPE_UNKNOWN_UNSPECIFIED:
      return "IMAGE_TYPE_UNKNOWN_UNSPECIFIED";
    case ImageType.IMAGE_TYPE_PNG:
      return "IMAGE_TYPE_PNG";
    case ImageType.IMAGE_TYPE_JPEG:
      return "IMAGE_TYPE_JPEG";
    case ImageType.IMAGE_TYPE_WEBP:
      return "IMAGE_TYPE_WEBP";
    case ImageType.IMAGE_TYPE_GIF:
      return "IMAGE_TYPE_GIF";
    default:
      return "UNKNOWN";
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
