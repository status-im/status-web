import { ChatMessage } from "./chat_message";

export class Chat {
  private lastClockValue?: number;
  private lastMessage?: ChatMessage;
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  private createMessage(text: string) {
    const { timestamp, clock } = this.nextClockAndTimestamp();

    return ChatMessage.createMessage(clock, timestamp, text, this.id);
  }

  private nextClockAndTimestamp() {
    let clock = this.lastClockValue;
    const timestamp = Date.now();

    if (!clock || clock < timestamp) {
      clock = timestamp;
    } else {
      clock += 1;
    }

    return { clock, timestamp };
  }

  private updateFromMessage(message: ChatMessage) {
    if (!this.lastMessage || this.lastMessage.clock <= message.clock) {
      this.lastMessage = message;
    }

    if (!this.lastClockValue || this.lastClockValue < message.clock) {
      this.lastClockValue = message.clock;
    }
  }
}
