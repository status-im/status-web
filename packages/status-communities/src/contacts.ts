import { Waku, WakuMessage } from "js-waku";

import { idToContactCodeTopic } from "./contentTopic";
import { Identity } from "./identity";
import { StatusUpdate_StatusType } from "./proto/communities/v1/status_update";
import { bufToHex } from "./utils";
import { StatusUpdate } from "./wire/status_update";

const STATUS_BROADCAST_INTERVAL = 300000;

export class Contacts {
  waku: Waku;
  identity: Identity;
  private callback: (publicKey: string, clock: number) => void;
  private contacts: string[] = [];

  /**
   * Contacts holds a list of user contacts and listens to their status broadcast
   *
   * When watched user broadcast callback is called.
   *
   * Class also broadcasts own status on contact-code topic
   *
   * @param identity identity of user that is used to broadcast status message
   *
   * @param waku waku class used to listen to broadcast and broadcast status
   *
   * @param callback callback function called when user status broadcast is received
   */
  public constructor(
    identity: Identity,
    waku: Waku,
    callback: (publicKey: string, clock: number) => void
  ) {
    this.waku = waku;
    this.identity = identity;
    this.callback = callback;
    this.startBroadcast();
    this.addContact(bufToHex(identity.publicKey));
  }

  /**
   * Add contact to watch list of status broadcast
   *
   * When user broadcasts its status callback is called
   *
   * @param publicKey public key of user
   */
  public addContact(publicKey: string): void {
    if (!this.contacts.find((e) => publicKey === e)) {
      const now = new Date();
      const callback = (wakuMessage: WakuMessage): void => {
        if (wakuMessage.payload) {
          const msg = StatusUpdate.decode(wakuMessage.payload);
          this.callback(publicKey, msg.clock ?? 0);
        }
      };
      this.contacts.push(publicKey);
      this.callback(publicKey, 0);
      this.waku.store.queryHistory([idToContactCodeTopic(publicKey)], {
        callback: (msgs) => msgs.forEach((e) => callback(e)),
        timeFilter: {
          startTime: new Date(now.getTime() - STATUS_BROADCAST_INTERVAL * 2),
          endTime: now,
        },
      });
      this.waku.relay.addObserver(callback, [idToContactCodeTopic(publicKey)]);
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
    setInterval(send, STATUS_BROADCAST_INTERVAL);
  }
}
