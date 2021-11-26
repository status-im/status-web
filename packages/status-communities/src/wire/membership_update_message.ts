import { Reader } from "protobufjs";
import { v4 as uuidV4 } from "uuid";

import { Identity } from "..";
import * as proto from "../proto/communities/v1/membership_update_message";
import { bufToHex, hexToBuf } from "../utils";

export class MembershipUpdateEvent {
  public constructor(public proto: proto.MembershipUpdateEvent) {}

  static decode(bytes: Uint8Array): MembershipUpdateEvent {
    const protoBuf = proto.MembershipUpdateEvent.decode(Reader.create(bytes));
    return new MembershipUpdateEvent(protoBuf);
  }

  encode(): Uint8Array {
    return proto.MembershipUpdateEvent.encode(this.proto).finish();
  }

  public get members(): string[] {
    return this.proto.members;
  }

  public get name(): string {
    return this.proto.name;
  }

  public get clock(): number {
    return this.proto.clock;
  }

  public get type(): proto.MembershipUpdateEvent_EventType {
    return this.proto.type;
  }
}

export class MembershipUpdateMessage {
  private clock: number = Date.now();
  private identity: Identity = Identity.generate();
  public constructor(public proto: proto.MembershipUpdateMessage) {}

  public static create(
    chatId: string,
    identity: Identity
  ): MembershipUpdateMessage {
    const partial = proto.MembershipUpdateMessage.fromPartial({
      chatId,
      events: [],
    });
    const newMessage = new MembershipUpdateMessage(partial);
    newMessage.clock = Date.now();
    newMessage.identity = identity;
    return newMessage;
  }

  private addEvent(event: MembershipUpdateEvent): void {
    const encEvent = event.encode();
    const eventToSign = Buffer.concat([hexToBuf(this.proto.chatId), encEvent]);
    const signature = this.identity.sign(eventToSign);
    this.proto.events.push(Buffer.concat([signature, encEvent]));
  }

  public static createChat(
    identity: Identity,
    members: string[],
    name?: string
  ): MembershipUpdateMessage {
    const chatId = `${uuidV4()}-${bufToHex(identity.publicKey)}`;

    const message = this.create(chatId, identity);
    const type = proto.MembershipUpdateEvent_EventType.CHAT_CREATED;
    const event = new MembershipUpdateEvent({
      clock: message.clock,
      members,
      name: name ?? "",
      type,
    });
    message.addEvent(event);
    return message;
  }

  public addNameChangeEvent(name: string): void {
    const type = proto.MembershipUpdateEvent_EventType.NAME_CHANGED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members: [],
      name: name,
      type,
    });
    this.addEvent(event);
  }

  public addMembersAddedEvent(members: string[]): void {
    const type = proto.MembershipUpdateEvent_EventType.MEMBERS_ADDED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members,
      name: "",
      type,
    });
    this.addEvent(event);
  }

  public addMemberJoinedEvent(member: string): void {
    const type = proto.MembershipUpdateEvent_EventType.MEMBER_JOINED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members: [member],
      name: "",
      type,
    });
    this.addEvent(event);
  }

  public addMemberRemovedEvent(member: string): void {
    const type = proto.MembershipUpdateEvent_EventType.MEMBER_REMOVED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members: [member],
      name: "",
      type,
    });
    this.addEvent(event);
  }

  public addAdminsAddedEvent(members: string[]): void {
    const type = proto.MembershipUpdateEvent_EventType.ADMINS_ADDED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members,
      name: "",
      type,
    });
    this.addEvent(event);
  }

  public addAdminRemovedEvent(member: string): void {
    const type = proto.MembershipUpdateEvent_EventType.ADMINS_ADDED;
    const event = new MembershipUpdateEvent({
      clock: this.clock,
      members: [member],
      name: "",
      type,
    });
    this.addEvent(event);
  }

  static decode(bytes: Uint8Array): MembershipUpdateMessage {
    const protoBuf = proto.MembershipUpdateMessage.decode(Reader.create(bytes));
    return new MembershipUpdateMessage(protoBuf);
  }

  public get events(): {
    sig: Uint8Array;
    event: MembershipUpdateEvent;
  }[] {
    return this.proto.events.map((bufArray) => {
      return {
        sig: bufArray.slice(0, 65),
        event: MembershipUpdateEvent.decode(bufArray.slice(65)),
      };
    });
  }

  public get chatId(): string {
    return this.proto.chatId;
  }

  encode(): Uint8Array {
    return proto.MembershipUpdateMessage.encode(this.proto).finish();
  }
}
