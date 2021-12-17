import { useCallback, useMemo } from "react";
import {
  GroupChat,
  GroupChats,
  Identity,
  Messenger,
  ChatMessage as StatusChatMessage,
} from "status-communities/dist/cjs";

import { ChannelData, ChannelsData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { Contact } from "../../models/Contact";
import { uintToImgUrl } from "../../utils";

const contactFromId = (member: string): Contact => {
  return {
    blocked: false,
    id: member,
    isUntrustworthy: false,
    online: false,
    trueName: member,
  };
};

export function useGroupChats(
  messenger: Messenger | undefined,
  identity: Identity | undefined,
  setChannels: React.Dispatch<React.SetStateAction<ChannelsData>>,
  setActiveChannel: (channel: ChannelData) => void,
  addChatMessage: (newMessage: ChatMessage | undefined, id: string) => void,
  channels: ChannelsData
) {
  const groupChat = useMemo(() => {
    if (messenger && identity) {
      const addChat = (chat: GroupChat) => {
        const members = chat.members.map(contactFromId);
        const channel: ChannelData = {
          id: chat.chatId,
          name: chat.name ?? chat.chatId,
          type: "group",
          members: members,
        };
        setChannels((prev) => {
          return { ...prev, [channel.id]: channel };
        });
        setActiveChannel(channel);
      };
      const removeChat = (chat: GroupChat) => {
        setChannels((prev) => {
          delete prev[chat.chatId];
          return prev;
        });
        setActiveChannel({
          id: "",
          name: "",
          type: "channel",
        } as ChannelData);
      };
      const handleMessage = (msg: StatusChatMessage, sender: string) => {
        let image: string | undefined = undefined;
        if (msg.image) {
          image = uintToImgUrl(msg.image.payload);
        }
        addChatMessage(
          new ChatMessage(
            msg.text ?? "",
            new Date(msg.clock ?? 0),
            sender,
            image,
            msg.responseTo
          ),
          msg.chatId
        );
      };
      return new GroupChats(
        identity,
        messenger.waku,
        addChat,
        removeChat,
        handleMessage
      );
    }
  }, [messenger, identity]);

  const createGroupChat = useCallback(
    (members: string[]) => {
      if (groupChat) {
        groupChat.createGroupChat(members);
      }
    },
    [groupChat]
  );

  const changeGroupChatName = useCallback(
    (name: string, chatId: string) => {
      if (groupChat) {
        groupChat.changeChatName(chatId, name);
      }
    },
    [groupChat]
  );

  const removeChannel = useCallback(
    (channelId: string) => {
      if (groupChat) {
        groupChat.quitChat(channelId);
      }
    },
    [channels, groupChat]
  );

  const addMembers = useCallback(
    (members: string[], chatId: string) => {
      if (groupChat) {
        groupChat.addMembers(chatId, members);
      }
    },
    [groupChat]
  );

  return {
    createGroupChat,
    removeChannel,
    groupChat,
    changeGroupChatName,
    addMembers,
  };
}
