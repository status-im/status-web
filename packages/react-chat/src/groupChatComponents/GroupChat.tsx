import React, { useState } from "react";
import styled from "styled-components";

import { Channels } from "../components/Channels/Channels";
import { ChatCreation } from "../components/Chat/ChatCreation";
import { AgreementModal } from "../components/Modals/AgreementModal";
import { CoinbaseModal } from "../components/Modals/CoinbaseModal";
import { EditModal } from "../components/Modals/EditModal";
import { LeavingModal } from "../components/Modals/LeavingModal";
import { LogoutModal } from "../components/Modals/LogoutModal";
import { ProfileFoundModal } from "../components/Modals/ProfileFoundModal";
import { ProfileModal } from "../components/Modals/ProfileModal";
import { StatusModal } from "../components/Modals/StatusModal";
import { UserCreationModal } from "../components/Modals/UserCreationModal";
import { UserCreationStartModal } from "../components/Modals/UserCreationStartModal";
import { WalletConnectModal } from "../components/Modals/WalletConnectModal";
import { WalletModal } from "../components/Modals/WalletModal";
import { ToastMessageList } from "../components/ToastMessages/ToastMessageList";
import { ChatState, useChatState } from "../contexts/chatStateProvider";
import { useNarrow } from "../contexts/narrowProvider";

import { GroupChatBody } from "./GroupChat/GroupChatBody";
import { GroupMembers } from "./GroupMembers/GroupMembers";

function Modals() {
  return (
    <>
      <UserCreationModal />
      <EditModal />
      <ProfileModal />
      <StatusModal />
      <WalletModal />
      <WalletConnectModal />
      <CoinbaseModal />
      <LogoutModal />
      <AgreementModal />
      <ProfileFoundModal />
      <UserCreationStartModal />
      <LeavingModal />
    </>
  );
}

export function GroupChat() {
  const [state] = useChatState();
  const [showMembers, setShowMembers] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const narrow = useNarrow();
  return (
    <ChatWrapper>
      {!narrow && (
        <ChannelsWrapper>
          <Channels setEditGroup={setEditGroup} />
        </ChannelsWrapper>
      )}
      {state === ChatState.ChatBody && (
        <GroupChatBody
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          permission={true}
          editGroup={editGroup}
          setEditGroup={setEditGroup}
        />
      )}
      {showMembers && !narrow && state === ChatState.ChatBody && (
        <GroupMembers />
      )}
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
  min-width: 250px;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
`;
