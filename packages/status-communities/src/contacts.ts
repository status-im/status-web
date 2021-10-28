import { Waku, WakuMessage } from "js-waku";

import { idToContactCodeTopic } from "./contentTopic";
import { Identity } from "./identity";
import { StatusUpdate_StatusType } from "./proto/communities/v1/status_update";
import { bufToHex } from "./utils";
import { StatusUpdate } from "./wire/status_update";

export class Contacts {
  waku: Waku;
  identity: Identity;
  private callback: (id: string, clock: number) => void;
  private contacts: string[] = [];

  public constructor(
    identity: Identity,
    waku: Waku,
    callback: (id: string, clock: number) => void
  ) {
    this.waku = waku;
    this.identity = identity;
    this.callback = callback;
    this.startBroadcast();
  }

  public addContact(id: string): void {
    if (!this.contacts.find((e) => id === e)) {
      const now = new Date();
      const callback = (wakuMessage: WakuMessage): void => {
        if (wakuMessage.payload) {
          const msg = StatusUpdate.decode(wakuMessage.payload);
          this.callback(id, msg.clock ?? 0);
        }
      };
      this.contacts.push(id);
      this.callback(id, 0);
      this.waku.store.queryHistory([idToContactCodeTopic(id)], {
        callback: (msgs) => msgs.forEach((e) => callback(e)),
        timeFilter: {
          startTime: new Date(now.getTime() - 400000),
          endTime: now,
        },
      });
      this.waku.relay.addObserver(callback, [idToContactCodeTopic(id)]);
    }
  }

  private startBroadcast(): void {
    const send = async (): Promise<void> => {
      const statusUpdate = StatusUpdate.create(
        StatusUpdate_StatusType.AUTOMATIC,
        ""
      );
      const msg = await WakuMessage.fromBytes(
        statusUpdate.encode(),
        idToContactCodeTopic(bufToHex(this.identity.publicKey))
      );
      this.waku.relay.send(msg);
    };
    send();
    setInterval(send, 300000);
  }
}
