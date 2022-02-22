import { idToContentTopic } from './contentTopic'
import { createSymKeyFromPassword } from './encryption'
import { ChatMessage, Content } from './wire/chat_message'
import { CommunityChat } from './wire/community_chat'

/**
 * Represent a chat room. Only public chats are currently supported.
 */
export class Chat {
  private lastClockValue?: number
  private lastMessage?: ChatMessage

  private constructor(
    public id: string,
    public symKey: Uint8Array,
    public communityChat?: CommunityChat
  ) {}

  /**
   * Create a public chat room.
   * [[Community.instantiateChat]] MUST be used for chats belonging to a community.
   */
  public static async create(
    id: string,
    communityChat?: CommunityChat
  ): Promise<Chat> {
    const symKey = await createSymKeyFromPassword(id)

    return new Chat(id, symKey, communityChat)
  }

  public get contentTopic(): string {
    return idToContentTopic(this.id)
  }

  public createMessage(content: Content, responseTo?: string): ChatMessage {
    const { timestamp, clock } = this._nextClockAndTimestamp()

    const message = ChatMessage.createMessage(
      clock,
      timestamp,
      this.id,
      content,
      responseTo
    )

    this._updateClockFromMessage(message)

    return message
  }

  public handleNewMessage(message: ChatMessage): void {
    this._updateClockFromMessage(message)
  }

  private _nextClockAndTimestamp(): { clock: number; timestamp: number } {
    let clock = this.lastClockValue
    const timestamp = Date.now()

    if (!clock || clock < timestamp) {
      clock = timestamp
    } else {
      clock += 1
    }

    return { clock, timestamp }
  }

  private _updateClockFromMessage(message: ChatMessage): void {
    if (
      !this.lastMessage ||
      !this.lastMessage.clock ||
      (message.clock && this.lastMessage.clock <= message.clock)
    ) {
      this.lastMessage = message
    }

    if (
      !this.lastClockValue ||
      (message.clock && this.lastClockValue < message.clock)
    ) {
      this.lastClockValue = message.clock
    }
  }
}
