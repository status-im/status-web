import React, { useState } from "react";
import styled from "styled-components";

import { ChatState, useChatState } from "../contexts/chatStateProvider";
import { useNarrow } from "../contexts/narrowProvider";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { ChatCreation } from "./Chat/ChatCreation";
import { Community } from "./Community";
import { Members } from "./Members/Members";
import { CommunityModal } from "./Modals/CommunityModal";
import { EditModal } from "./Modals/EditModal";
import { ProfileModal } from "./Modals/ProfileModal";
import { ToastMessageList } from "./ToastMessages/ToastMessageList";

function Modals() {
  return (
    <>
      <CommunityModal subtitle="Public Community" />
      <EditModal />
      <ProfileModal />
    </>
  );
}

export function Chat() {
  const [state] = useChatState();
  const [showMembers, setShowMembers] = useState(false);
  const narrow = useNarrow();

  return (
    <ChatWrapper>
      {!narrow && (
        <ChannelsWrapper>
          <StyledCommunity />
          <Channels />
        </ChannelsWrapper>
      )}
      {state === ChatState.ChatBody && (
        <ChatBody
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
        />
      )}
      {showMembers && !narrow && state === ChatState.ChatBody && <Members />}
      {state === ChatState.ChatCreation && <ChatCreation />}
      <Modals />
      <ToastMessageList />
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const ChannelsWrapper = styled.div`
  width: 21%;
  height: 100%;
  min-width: 196px;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
`;

const StyledCommunity = styled(Community)`
  padding: 0 0 0 8px;
  margin: 0 0 16px;
`;
