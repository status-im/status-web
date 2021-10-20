import { ApplicationMetadataMessage } from "status-communities/dist/cjs";

import { uintToImgUrl } from "../utils";

export class ChatMessage {
  content: string;
  date: Date;
  sender: string;
  image?: string;

  constructor(content: string, date: Date, sender: string, image?: string) {
    this.content = content;
    this.date = date;
    this.sender = sender;
    this.image = image;
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
      const sender = msg.signer.reduce(
        (p: string, c: number): string => p + c.toString(16),
        "0x"
      );
      return new ChatMessage(content, date, sender, image);
    } else {
      return undefined;
    }
  }
}
