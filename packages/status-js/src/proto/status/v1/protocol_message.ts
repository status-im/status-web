/* eslint-disable */
import Long from 'long'
import * as _m0 from 'protobufjs/minimal'

export const protobufPackage = ''

export interface SignedPreKey {
  signedPreKey: Uint8Array
  version: number
  protocolVersion: number
}

/** X3DH prekey bundle */
export interface Bundle {
  /** Identity key */
  identity: Uint8Array
  /** Installation id */
  signedPreKeys: { [key: string]: SignedPreKey }
  /** Prekey signature */
  signature: Uint8Array
  /** When the bundle was created locally */
  timestamp: number
}

export interface Bundle_SignedPreKeysEntry {
  key: string
  value: SignedPreKey | undefined
}

export interface BundleContainer {
  /** X3DH prekey bundle */
  bundle: Bundle | undefined
  /** Private signed prekey */
  privateSignedPreKey: Uint8Array
}

export interface DRHeader {
  /** Current ratchet public key */
  key: Uint8Array
  /** Number of the message in the sending chain */
  n: number
  /** Length of the previous sending chain */
  pn: number
  /** Bundle ID */
  id: Uint8Array
}

export interface DHHeader {
  /** Compressed ephemeral public key */
  key: Uint8Array
}

export interface X3DHHeader {
  /** Ephemeral key used */
  key: Uint8Array
  /** Used bundle's signed prekey */
  id: Uint8Array
}

/** Hash Ratchet Header */
export interface HRHeader {
  /** community key ID */
  keyId: number
  /** Community message number for this key_id */
  seqNo: number
  /** Community ID */
  groupId: string
}

/** Direct message value */
export interface EncryptedMessageProtocol {
  x3dhHeader: X3DHHeader | undefined
  drHeader: DRHeader | undefined
  dhHeader: DHHeader | undefined
  hrHeader: HRHeader | undefined
  /** Encrypted payload */
  payload: Uint8Array
}

/** Top-level protocol message */
export interface ProtocolMessage {
  /** The device id of the sender */
  installationId: string
  /** List of bundles */
  bundles: Bundle[]
  /**
   * One to one message, encrypted, indexed by installation_id
   * TODO map here is redundant in case of community messages
   */
  encryptedMessage: { [key: string]: EncryptedMessageProtocol }
  /** Public chats, not encrypted */
  publicMessage: Uint8Array
}

export interface ProtocolMessage_EncryptedMessageEntry {
  key: string
  value: EncryptedMessageProtocol | undefined
}

function createBaseSignedPreKey(): SignedPreKey {
  return { signedPreKey: new Uint8Array(), version: 0, protocolVersion: 0 }
}

export const SignedPreKey = {
  encode(
    message: SignedPreKey,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.signedPreKey.length !== 0) {
      writer.uint32(10).bytes(message.signedPreKey)
    }
    if (message.version !== 0) {
      writer.uint32(16).uint32(message.version)
    }
    if (message.protocolVersion !== 0) {
      writer.uint32(24).uint32(message.protocolVersion)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignedPreKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSignedPreKey()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.signedPreKey = reader.bytes()
          break
        case 2:
          message.version = reader.uint32()
          break
        case 3:
          message.protocolVersion = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): SignedPreKey {
    return {
      signedPreKey: isSet(object.signedPreKey)
        ? bytesFromBase64(object.signedPreKey)
        : new Uint8Array(),
      version: isSet(object.version) ? Number(object.version) : 0,
      protocolVersion: isSet(object.protocolVersion)
        ? Number(object.protocolVersion)
        : 0,
    }
  },

  toJSON(message: SignedPreKey): unknown {
    const obj: any = {}
    message.signedPreKey !== undefined &&
      (obj.signedPreKey = base64FromBytes(
        message.signedPreKey !== undefined
          ? message.signedPreKey
          : new Uint8Array()
      ))
    message.version !== undefined && (obj.version = Math.round(message.version))
    message.protocolVersion !== undefined &&
      (obj.protocolVersion = Math.round(message.protocolVersion))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<SignedPreKey>, I>>(
    object: I
  ): SignedPreKey {
    const message = createBaseSignedPreKey()
    message.signedPreKey = object.signedPreKey ?? new Uint8Array()
    message.version = object.version ?? 0
    message.protocolVersion = object.protocolVersion ?? 0
    return message
  },
}

function createBaseBundle(): Bundle {
  return {
    identity: new Uint8Array(),
    signedPreKeys: {},
    signature: new Uint8Array(),
    timestamp: 0,
  }
}

export const Bundle = {
  encode(
    message: Bundle,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.identity.length !== 0) {
      writer.uint32(10).bytes(message.identity)
    }
    Object.entries(message.signedPreKeys).forEach(([key, value]) => {
      Bundle_SignedPreKeysEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim()
    })
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature)
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).int64(message.timestamp)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Bundle {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseBundle()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.identity = reader.bytes()
          break
        case 2:
          const entry2 = Bundle_SignedPreKeysEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry2.value !== undefined) {
            message.signedPreKeys[entry2.key] = entry2.value
          }
          break
        case 4:
          message.signature = reader.bytes()
          break
        case 5:
          message.timestamp = longToNumber(reader.int64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Bundle {
    return {
      identity: isSet(object.identity)
        ? bytesFromBase64(object.identity)
        : new Uint8Array(),
      signedPreKeys: isObject(object.signedPreKeys)
        ? Object.entries(object.signedPreKeys).reduce<{
            [key: string]: SignedPreKey
          }>((acc, [key, value]) => {
            acc[key] = SignedPreKey.fromJSON(value)
            return acc
          }, {})
        : {},
      signature: isSet(object.signature)
        ? bytesFromBase64(object.signature)
        : new Uint8Array(),
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
    }
  },

  toJSON(message: Bundle): unknown {
    const obj: any = {}
    message.identity !== undefined &&
      (obj.identity = base64FromBytes(
        message.identity !== undefined ? message.identity : new Uint8Array()
      ))
    obj.signedPreKeys = {}
    if (message.signedPreKeys) {
      Object.entries(message.signedPreKeys).forEach(([k, v]) => {
        obj.signedPreKeys[k] = SignedPreKey.toJSON(v)
      })
    }
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(
        message.signature !== undefined ? message.signature : new Uint8Array()
      ))
    message.timestamp !== undefined &&
      (obj.timestamp = Math.round(message.timestamp))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Bundle>, I>>(object: I): Bundle {
    const message = createBaseBundle()
    message.identity = object.identity ?? new Uint8Array()
    message.signedPreKeys = Object.entries(object.signedPreKeys ?? {}).reduce<{
      [key: string]: SignedPreKey
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = SignedPreKey.fromPartial(value)
      }
      return acc
    }, {})
    message.signature = object.signature ?? new Uint8Array()
    message.timestamp = object.timestamp ?? 0
    return message
  },
}

function createBaseBundle_SignedPreKeysEntry(): Bundle_SignedPreKeysEntry {
  return { key: '', value: undefined }
}

export const Bundle_SignedPreKeysEntry = {
  encode(
    message: Bundle_SignedPreKeysEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      SignedPreKey.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): Bundle_SignedPreKeysEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseBundle_SignedPreKeysEntry()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = SignedPreKey.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Bundle_SignedPreKeysEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value)
        ? SignedPreKey.fromJSON(object.value)
        : undefined,
    }
  },

  toJSON(message: Bundle_SignedPreKeysEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? SignedPreKey.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Bundle_SignedPreKeysEntry>, I>>(
    object: I
  ): Bundle_SignedPreKeysEntry {
    const message = createBaseBundle_SignedPreKeysEntry()
    message.key = object.key ?? ''
    message.value =
      object.value !== undefined && object.value !== null
        ? SignedPreKey.fromPartial(object.value)
        : undefined
    return message
  },
}

function createBaseBundleContainer(): BundleContainer {
  return { bundle: undefined, privateSignedPreKey: new Uint8Array() }
}

export const BundleContainer = {
  encode(
    message: BundleContainer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.bundle !== undefined) {
      Bundle.encode(message.bundle, writer.uint32(10).fork()).ldelim()
    }
    if (message.privateSignedPreKey.length !== 0) {
      writer.uint32(18).bytes(message.privateSignedPreKey)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BundleContainer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseBundleContainer()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.bundle = Bundle.decode(reader, reader.uint32())
          break
        case 2:
          message.privateSignedPreKey = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): BundleContainer {
    return {
      bundle: isSet(object.bundle) ? Bundle.fromJSON(object.bundle) : undefined,
      privateSignedPreKey: isSet(object.privateSignedPreKey)
        ? bytesFromBase64(object.privateSignedPreKey)
        : new Uint8Array(),
    }
  },

  toJSON(message: BundleContainer): unknown {
    const obj: any = {}
    message.bundle !== undefined &&
      (obj.bundle = message.bundle ? Bundle.toJSON(message.bundle) : undefined)
    message.privateSignedPreKey !== undefined &&
      (obj.privateSignedPreKey = base64FromBytes(
        message.privateSignedPreKey !== undefined
          ? message.privateSignedPreKey
          : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<BundleContainer>, I>>(
    object: I
  ): BundleContainer {
    const message = createBaseBundleContainer()
    message.bundle =
      object.bundle !== undefined && object.bundle !== null
        ? Bundle.fromPartial(object.bundle)
        : undefined
    message.privateSignedPreKey = object.privateSignedPreKey ?? new Uint8Array()
    return message
  },
}

function createBaseDRHeader(): DRHeader {
  return { key: new Uint8Array(), n: 0, pn: 0, id: new Uint8Array() }
}

export const DRHeader = {
  encode(
    message: DRHeader,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key)
    }
    if (message.n !== 0) {
      writer.uint32(16).uint32(message.n)
    }
    if (message.pn !== 0) {
      writer.uint32(24).uint32(message.pn)
    }
    if (message.id.length !== 0) {
      writer.uint32(34).bytes(message.id)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DRHeader {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseDRHeader()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes()
          break
        case 2:
          message.n = reader.uint32()
          break
        case 3:
          message.pn = reader.uint32()
          break
        case 4:
          message.id = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DRHeader {
    return {
      key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
      n: isSet(object.n) ? Number(object.n) : 0,
      pn: isSet(object.pn) ? Number(object.pn) : 0,
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(),
    }
  },

  toJSON(message: DRHeader): unknown {
    const obj: any = {}
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : new Uint8Array()
      ))
    message.n !== undefined && (obj.n = Math.round(message.n))
    message.pn !== undefined && (obj.pn = Math.round(message.pn))
    message.id !== undefined &&
      (obj.id = base64FromBytes(
        message.id !== undefined ? message.id : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<DRHeader>, I>>(object: I): DRHeader {
    const message = createBaseDRHeader()
    message.key = object.key ?? new Uint8Array()
    message.n = object.n ?? 0
    message.pn = object.pn ?? 0
    message.id = object.id ?? new Uint8Array()
    return message
  },
}

function createBaseDHHeader(): DHHeader {
  return { key: new Uint8Array() }
}

export const DHHeader = {
  encode(
    message: DHHeader,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DHHeader {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseDHHeader()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DHHeader {
    return {
      key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
    }
  },

  toJSON(message: DHHeader): unknown {
    const obj: any = {}
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<DHHeader>, I>>(object: I): DHHeader {
    const message = createBaseDHHeader()
    message.key = object.key ?? new Uint8Array()
    return message
  },
}

function createBaseX3DHHeader(): X3DHHeader {
  return { key: new Uint8Array(), id: new Uint8Array() }
}

export const X3DHHeader = {
  encode(
    message: X3DHHeader,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key)
    }
    if (message.id.length !== 0) {
      writer.uint32(34).bytes(message.id)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): X3DHHeader {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseX3DHHeader()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes()
          break
        case 4:
          message.id = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): X3DHHeader {
    return {
      key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
      id: isSet(object.id) ? bytesFromBase64(object.id) : new Uint8Array(),
    }
  },

  toJSON(message: X3DHHeader): unknown {
    const obj: any = {}
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : new Uint8Array()
      ))
    message.id !== undefined &&
      (obj.id = base64FromBytes(
        message.id !== undefined ? message.id : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<X3DHHeader>, I>>(
    object: I
  ): X3DHHeader {
    const message = createBaseX3DHHeader()
    message.key = object.key ?? new Uint8Array()
    message.id = object.id ?? new Uint8Array()
    return message
  },
}

function createBaseHRHeader(): HRHeader {
  return { keyId: 0, seqNo: 0, groupId: '' }
}

export const HRHeader = {
  encode(
    message: HRHeader,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.keyId !== 0) {
      writer.uint32(8).uint32(message.keyId)
    }
    if (message.seqNo !== 0) {
      writer.uint32(16).uint32(message.seqNo)
    }
    if (message.groupId !== '') {
      writer.uint32(26).string(message.groupId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HRHeader {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHRHeader()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.keyId = reader.uint32()
          break
        case 2:
          message.seqNo = reader.uint32()
          break
        case 3:
          message.groupId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): HRHeader {
    return {
      keyId: isSet(object.keyId) ? Number(object.keyId) : 0,
      seqNo: isSet(object.seqNo) ? Number(object.seqNo) : 0,
      groupId: isSet(object.groupId) ? String(object.groupId) : '',
    }
  },

  toJSON(message: HRHeader): unknown {
    const obj: any = {}
    message.keyId !== undefined && (obj.keyId = Math.round(message.keyId))
    message.seqNo !== undefined && (obj.seqNo = Math.round(message.seqNo))
    message.groupId !== undefined && (obj.groupId = message.groupId)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<HRHeader>, I>>(object: I): HRHeader {
    const message = createBaseHRHeader()
    message.keyId = object.keyId ?? 0
    message.seqNo = object.seqNo ?? 0
    message.groupId = object.groupId ?? ''
    return message
  },
}

function createBaseEncryptedMessageProtocol(): EncryptedMessageProtocol {
  return {
    x3dhHeader: undefined,
    drHeader: undefined,
    dhHeader: undefined,
    hrHeader: undefined,
    payload: new Uint8Array(),
  }
}

export const EncryptedMessageProtocol = {
  encode(
    message: EncryptedMessageProtocol,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.x3dhHeader !== undefined) {
      X3DHHeader.encode(message.x3dhHeader, writer.uint32(10).fork()).ldelim()
    }
    if (message.drHeader !== undefined) {
      DRHeader.encode(message.drHeader, writer.uint32(18).fork()).ldelim()
    }
    if (message.dhHeader !== undefined) {
      DHHeader.encode(message.dhHeader, writer.uint32(810).fork()).ldelim()
    }
    if (message.hrHeader !== undefined) {
      HRHeader.encode(message.hrHeader, writer.uint32(818).fork()).ldelim()
    }
    if (message.payload.length !== 0) {
      writer.uint32(26).bytes(message.payload)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): EncryptedMessageProtocol {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseEncryptedMessageProtocol()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.x3dhHeader = X3DHHeader.decode(reader, reader.uint32())
          break
        case 2:
          message.drHeader = DRHeader.decode(reader, reader.uint32())
          break
        case 101:
          message.dhHeader = DHHeader.decode(reader, reader.uint32())
          break
        case 102:
          message.hrHeader = HRHeader.decode(reader, reader.uint32())
          break
        case 3:
          message.payload = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): EncryptedMessageProtocol {
    return {
      x3dhHeader: isSet(object.x3dhHeader)
        ? X3DHHeader.fromJSON(object.x3dhHeader)
        : undefined,
      drHeader: isSet(object.drHeader)
        ? DRHeader.fromJSON(object.drHeader)
        : undefined,
      dhHeader: isSet(object.dhHeader)
        ? DHHeader.fromJSON(object.dhHeader)
        : undefined,
      hrHeader: isSet(object.hrHeader)
        ? HRHeader.fromJSON(object.hrHeader)
        : undefined,
      payload: isSet(object.payload)
        ? bytesFromBase64(object.payload)
        : new Uint8Array(),
    }
  },

  toJSON(message: EncryptedMessageProtocol): unknown {
    const obj: any = {}
    message.x3dhHeader !== undefined &&
      (obj.x3dhHeader = message.x3dhHeader
        ? X3DHHeader.toJSON(message.x3dhHeader)
        : undefined)
    message.drHeader !== undefined &&
      (obj.drHeader = message.drHeader
        ? DRHeader.toJSON(message.drHeader)
        : undefined)
    message.dhHeader !== undefined &&
      (obj.dhHeader = message.dhHeader
        ? DHHeader.toJSON(message.dhHeader)
        : undefined)
    message.hrHeader !== undefined &&
      (obj.hrHeader = message.hrHeader
        ? HRHeader.toJSON(message.hrHeader)
        : undefined)
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedMessageProtocol>, I>>(
    object: I
  ): EncryptedMessageProtocol {
    const message = createBaseEncryptedMessageProtocol()
    message.x3dhHeader =
      object.x3dhHeader !== undefined && object.x3dhHeader !== null
        ? X3DHHeader.fromPartial(object.x3dhHeader)
        : undefined
    message.drHeader =
      object.drHeader !== undefined && object.drHeader !== null
        ? DRHeader.fromPartial(object.drHeader)
        : undefined
    message.dhHeader =
      object.dhHeader !== undefined && object.dhHeader !== null
        ? DHHeader.fromPartial(object.dhHeader)
        : undefined
    message.hrHeader =
      object.hrHeader !== undefined && object.hrHeader !== null
        ? HRHeader.fromPartial(object.hrHeader)
        : undefined
    message.payload = object.payload ?? new Uint8Array()
    return message
  },
}

function createBaseProtocolMessage(): ProtocolMessage {
  return {
    installationId: '',
    bundles: [],
    encryptedMessage: {},
    publicMessage: new Uint8Array(),
  }
}

export const ProtocolMessage = {
  encode(
    message: ProtocolMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.installationId !== '') {
      writer.uint32(18).string(message.installationId)
    }
    for (const v of message.bundles) {
      Bundle.encode(v!, writer.uint32(26).fork()).ldelim()
    }
    Object.entries(message.encryptedMessage).forEach(([key, value]) => {
      ProtocolMessage_EncryptedMessageEntry.encode(
        { key: key as any, value },
        writer.uint32(810).fork()
      ).ldelim()
    })
    if (message.publicMessage.length !== 0) {
      writer.uint32(818).bytes(message.publicMessage)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtocolMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseProtocolMessage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 2:
          message.installationId = reader.string()
          break
        case 3:
          message.bundles.push(Bundle.decode(reader, reader.uint32()))
          break
        case 101:
          const entry101 = ProtocolMessage_EncryptedMessageEntry.decode(
            reader,
            reader.uint32()
          )
          if (entry101.value !== undefined) {
            message.encryptedMessage[entry101.key] = entry101.value
          }
          break
        case 102:
          message.publicMessage = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ProtocolMessage {
    return {
      installationId: isSet(object.installationId)
        ? String(object.installationId)
        : '',
      bundles: Array.isArray(object?.bundles)
        ? object.bundles.map((e: any) => Bundle.fromJSON(e))
        : [],
      encryptedMessage: isObject(object.encryptedMessage)
        ? Object.entries(object.encryptedMessage).reduce<{
            [key: string]: EncryptedMessageProtocol
          }>((acc, [key, value]) => {
            acc[key] = EncryptedMessageProtocol.fromJSON(value)
            return acc
          }, {})
        : {},
      publicMessage: isSet(object.publicMessage)
        ? bytesFromBase64(object.publicMessage)
        : new Uint8Array(),
    }
  },

  toJSON(message: ProtocolMessage): unknown {
    const obj: any = {}
    message.installationId !== undefined &&
      (obj.installationId = message.installationId)
    if (message.bundles) {
      obj.bundles = message.bundles.map(e => (e ? Bundle.toJSON(e) : undefined))
    } else {
      obj.bundles = []
    }
    obj.encryptedMessage = {}
    if (message.encryptedMessage) {
      Object.entries(message.encryptedMessage).forEach(([k, v]) => {
        obj.encryptedMessage[k] = EncryptedMessageProtocol.toJSON(v)
      })
    }
    message.publicMessage !== undefined &&
      (obj.publicMessage = base64FromBytes(
        message.publicMessage !== undefined
          ? message.publicMessage
          : new Uint8Array()
      ))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<ProtocolMessage>, I>>(
    object: I
  ): ProtocolMessage {
    const message = createBaseProtocolMessage()
    message.installationId = object.installationId ?? ''
    message.bundles = object.bundles?.map(e => Bundle.fromPartial(e)) || []
    message.encryptedMessage = Object.entries(
      object.encryptedMessage ?? {}
    ).reduce<{ [key: string]: EncryptedMessageProtocol }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = EncryptedMessageProtocol.fromPartial(value)
        }
        return acc
      },
      {}
    )
    message.publicMessage = object.publicMessage ?? new Uint8Array()
    return message
  },
}

function createBaseProtocolMessage_EncryptedMessageEntry(): ProtocolMessage_EncryptedMessageEntry {
  return { key: '', value: undefined }
}

export const ProtocolMessage_EncryptedMessageEntry = {
  encode(
    message: ProtocolMessage_EncryptedMessageEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      EncryptedMessageProtocol.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ProtocolMessage_EncryptedMessageEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseProtocolMessage_EncryptedMessageEntry()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = EncryptedMessageProtocol.decode(
            reader,
            reader.uint32()
          )
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ProtocolMessage_EncryptedMessageEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value)
        ? EncryptedMessageProtocol.fromJSON(object.value)
        : undefined,
    }
  },

  toJSON(message: ProtocolMessage_EncryptedMessageEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined &&
      (obj.value = message.value
        ? EncryptedMessageProtocol.toJSON(message.value)
        : undefined)
    return obj
  },

  fromPartial<
    I extends Exact<DeepPartial<ProtocolMessage_EncryptedMessageEntry>, I>
  >(object: I): ProtocolMessage_EncryptedMessageEntry {
    const message = createBaseProtocolMessage_EncryptedMessageEntry()
    message.key = object.key ?? ''
    message.value =
      object.value !== undefined && object.value !== null
        ? EncryptedMessageProtocol.fromPartial(object.value)
        : undefined
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
  arr.forEach(byte => {
    bin.push(String.fromCharCode(byte))
  })
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

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >

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

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
