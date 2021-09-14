import * as proto from './proto/communities/v2/chat_message';
import {MessageType} from "./proto/communities/v2/enums";
import {AudioMessage, ChatMessage_ContentType, ImageMessage, StickerMessage} from "./proto/communities/v2/chat_message";

export class ChatMessage {
    private constructor(
        public proto: proto.ChatMessage,
    ) {
    }

    /**
     * Create a chat message to be sent to an Open (permission = no membership) community
     */
    public static createMessage(clock: number, timestamp: number, text: string, chatId: string) {

        const proto = {
            clock, // ms?
            timestamp, //ms?
            text,
            /** Id of the message that we are replying to */
            responseTo: "",
            /** Ens name of the sender */
            ensName: "",
            /** Public Key of the community (TBC) **/
            chatId,
            /** The type of message (public/one-to-one/private-group-chat) */
            messageType: MessageType.MESSAGE_TYPE_COMMUNITY_CHAT,
            /** The type of the content of the message */
            contentType: ChatMessage_ContentType.CONTENT_TYPE_COMMUNITY,
            sticker: undefined,
            image: undefined,
            audio: undefined,
            community: undefined, // Used to share a community
            grant: undefined
        }

        return new ChatMessage(proto)
    }

    public get clock() {
        return this.proto.clock;
    }
}
