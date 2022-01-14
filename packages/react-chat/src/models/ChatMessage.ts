import {
  ApplicationMetadataMessage,
  utils,
} from "@waku/status-communities/dist/cjs";
import { keccak256 } from "js-sha3";

import { uintToImgUrl } from "../utils";

export class ChatMessage {
  content: string;
  date: Date;
  sender: string;
  image?: string;
  responseTo?: string;
  id: string;

  constructor(
    content: string,
    date: Date,
    sender: string,
    image?: string,
    responseTo?: string
  ) {
    this.content = content;
    this.date = date;
    this.sender = sender;
    this.image = image;
    this.responseTo = responseTo;
    this.id = keccak256(date.getTime().toString() + content);
  }

  public static fromMetadataMessage(
    msg: ApplicationMetadataMessage,
    date: Date
  ) {
    if (
      msg.signer &&
      (msg.chatMessage?.text || msg.chatMessage?.image) &&
      msg.chatMessage.clock
    ) {
      const content = msg.chatMessage.text ?? "";
      let image: string | undefined = undefined;
      if (msg.chatMessage?.image) {
        image = uintToImgUrl(msg.chatMessage?.image.payload);
      }
      const sender = utils.bufToHex(msg.signer);
      return new ChatMessage(
        content,
        date,
        sender,
        image,
        msg.chatMessage.responseTo
      );
    } else {
      return undefined;
    }
  }
}
