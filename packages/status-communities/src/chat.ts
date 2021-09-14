import { ChatMessage } from "./chat_message";
import { chatIdToContentTopic } from "./contentTopic";

export class Chat {
  private lastClockValue?: number;
  private lastMessage?: ChatMessage;
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  public get contentTopic(): string {
    return chatIdToContentTopic(this.id);
  }

  private createMessage(text: string): ChatMessage {
    const { timestamp, clock } = this.nextClockAndTimestamp();

    return ChatMessage.createMessage(clock, timestamp, text, this.id);
  }

  public handleNewMessage(message: ChatMessage) {
    this.updateFromMessage(message);

    // TODO: emit message
  }

  private nextClockAndTimestamp(): { clock: number; timestamp: number } {
    let clock = this.lastClockValue;
    const timestamp = Date.now();

    if (!clock || clock < timestamp) {
      clock = timestamp;
    } else {
      clock += 1;
    }

    return { clock, timestamp };
  }

  private updateFromMessage(message: ChatMessage): void {
    if (!this.lastMessage || this.lastMessage.clock <= message.clock) {
      this.lastMessage = message;
    }

    if (!this.lastClockValue || this.lastClockValue < message.clock) {
      this.lastClockValue = message.clock;
    }
  }
}
