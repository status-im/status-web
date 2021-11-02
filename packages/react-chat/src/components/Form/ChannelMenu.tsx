import React from "react";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CheckSvg } from "../Icons/CheckIcon";
import { ClearSvg } from "../Icons/ClearIcon";
import { MembersSmallSvg } from "../Icons/MembersSmallIcon";
import { MuteSvg } from "../Icons/MuteIcon";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ChannelMenuProps {
  channel: ChannelData;
  messages: ChatMessage[];
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
}

export const ChannelMenu = ({
  channel,
  messages,
  switchMemberList,
  setShowChannelMenu,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications } = useMessengerContext();

  return (
    <DropdownMenu>
      {narrow && (
        <MenuItem
          onClick={() => {
            switchMemberList();
            setShowChannelMenu(false);
          }}
        >
          <MembersSmallSvg height={16} width={16} />
          <MenuText>View Members</MenuText>
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          channel.isMuted = true;
          setShowChannelMenu(false);
        }}
      >
        <MuteSvg height={16} width={16} />
        <MenuText>Mute Chat</MenuText>
      </MenuItem>
      <MenuItem onClick={() => clearNotifications(channel.id)}>
        <CheckSvg height={16} width={16} />
        <MenuText>Mark as Read</MenuText>
      </MenuItem>
      <MenuItem onClick={() => messages.length === 0}>
        <ClearSvg height={16} width={16} />
        <MenuText>Clear History</MenuText>
      </MenuItem>
    </DropdownMenu>
  );
};
