import { PageDirection, Waku, WakuMessage } from "js-waku";

import { idToContactCodeTopic } from "./contentTopic";
import { Identity } from "./identity";
import { StatusUpdate_StatusType } from "./proto/communities/v1/status_update";
import { bufToHex } from "./utils";
import { ChatIdentity } from "./wire/chat_identity";
import { StatusUpdate } from "./wire/status_update";

const STATUS_BROADCAST_INTERVAL = 30000;
const NICKNAME_BROADCAST_INTERVAL = 300000;

export class Contacts {
  waku: Waku;
  identity: Identity | undefined;
  nickname?: string;
  private callback: (publicKey: string, clock: number) => void;
  private callbackNickname: (publicKey: string, nickname: string) => void;
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
    identity: Identity | undefined,
    waku: Waku,
    callback: (publicKey: string, clock: number) => void,
    callbackNickname: (publicKey: string, nickname: string) => void,
    nickname?: string
  ) {
    this.waku = waku;
    this.identity = identity;
    this.nickname = nickname;
    this.callback = callback;
    this.callbackNickname = callbackNickname;
    this.startBroadcast();
    if (identity) {
      this.addContact(bufToHex(identity.publicKey));
    }
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
      this.waku.store.queryHistory([idToContactCodeTopic(publicKey)], {
        callback: (msgs) =>
          msgs.some((e) => {
            try {
              if (e.payload) {
                const chatIdentity = ChatIdentity.decode(e?.payload);
                if (chatIdentity) {
                  this.callbackNickname(
                    publicKey,
                    chatIdentity?.displayName ?? ""
                  );
                }
                return true;
              }
            } catch {
              return false;
            }
          }),
        pageDirection: PageDirection.BACKWARD,
      });
      this.waku.relay.addObserver(callback, [idToContactCodeTopic(publicKey)]);
    }
  }

  private startBroadcast(): void {
    const send = async (): Promise<void> => {
      if (this.identity) {
        const statusUpdate = StatusUpdate.create(
          StatusUpdate_StatusType.AUTOMATIC,
          ""
        );
        const msg = await WakuMessage.fromBytes(
          statusUpdate.encode(),
          idToContactCodeTopic(bufToHex(this.identity.publicKey))
        );
        this.waku.relay.send(msg);
      }
    };

    const handleNickname = async (): Promise<void> => {
      if (this.identity) {
        const publicKey = bufToHex(this.identity.publicKey);
        const now = new Date().getTime();
        let newNickname = "";
        let clock = 0;
        await this.waku.store.queryHistory([idToContactCodeTopic(publicKey)], {
          callback: (msgs) =>
            msgs.some((e) => {
              try {
                if (e.payload) {
                  const chatIdentity = ChatIdentity.decode(e?.payload);
                  if (chatIdentity) {
                    if (chatIdentity?.displayName) {
                      clock = chatIdentity?.clock ?? 0;
                      newNickname = chatIdentity?.displayName;
                    }
                  }
                  return true;
                }
              } catch {
                return false;
              }
            }),
          pageDirection: PageDirection.BACKWARD,
        });

        if (this.nickname) {
          if (this.nickname !== newNickname) {
            await sendNickname();
          } else {
            if (clock < now - NICKNAME_BROADCAST_INTERVAL) {
              await sendNickname();
            }
          }
        } else {
          this.nickname = newNickname;
          this.callbackNickname(publicKey, newNickname);
          if (clock < now - NICKNAME_BROADCAST_INTERVAL) {
            await sendNickname();
          }
        }
      }
      setInterval(send, NICKNAME_BROADCAST_INTERVAL);
    };

    const sendNickname = async (): Promise<void> => {
      if (this.identity) {
        const publicKey = bufToHex(this.identity.publicKey);
        if (this.nickname) {
          const chatIdentity = new ChatIdentity({
            clock: new Date().getTime(),
            color: "",
            description: "",
            emoji: "",
            images: {},
            ensName: "",
            displayName: this?.nickname ?? "",
          });
          const msg = await WakuMessage.fromBytes(
            chatIdentity.encode(),
            idToContactCodeTopic(publicKey),
            { sigPrivKey: this.identity.privateKey }
          );
          await this.waku.relay.send(msg);
        }
      }
    };
    handleNickname();
    send();
    setInterval(send, STATUS_BROADCAST_INTERVAL);
  }
}
