import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { Reply } from "../../hooks/useReply";
import { ChannelData } from "../../models/ChannelData";
import { TokenRequirement } from "../Form/TokenRequirement";
import { MessagesList } from "../Messages/MessagesList";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowMembers } from "../NarrowMode/NarrowMembers";
import { LoadingSkeleton } from "../Skeleton/LoadingSkeleton";

import { ChatCreation } from "./ChatCreation";
import { ChatInput } from "./ChatInput";
import { ChatTopbar, ChatTopbarLoading } from "./ChatTopbar";

export enum ChatBodyState {
  Chat,
  Channels,
  Members,
}

function ChatBodyLoading() {
  const narrow = useNarrow();
  return (
    <Wrapper>
      <ChatBodyWrapper className={narrow ? "narrow" : ""}>
        <ChatTopbarLoading />
        <LoadingSkeleton />
        <ChatInput reply={undefined} setReply={() => undefined} />
      </ChatBodyWrapper>
    </Wrapper>
  );
}

type ChatBodyContentProps = {
  showState: ChatBodyState;
  switchShowState: (state: ChatBodyState) => void;
  channel: ChannelData;
};

function ChatBodyContent({
  showState,
  switchShowState,
  channel,
}: ChatBodyContentProps) {
  const [reply, setReply] = useState<Reply | undefined>(undefined);

  switch (showState) {
    case ChatBodyState.Chat:
      return (
        <>
          <MessagesList setReply={setReply} channel={channel} />
          <ChatInput reply={reply} setReply={setReply} />
        </>
      );
    case ChatBodyState.Channels:
      return (
        <NarrowChannels
          setShowChannels={() => switchShowState(ChatBodyState.Channels)}
        />
      );
    case ChatBodyState.Members:
      return (
        <NarrowMembers
          switchShowMembersList={() => switchShowState(ChatBodyState.Members)}
        />
      );
  }
}

interface ChatBodyProps {
  onClick: () => void;
  showMembers: boolean;
  permission: boolean;
  editGroup: boolean;
  setEditGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatBody({
  onClick,
  showMembers,
  permission,
  editGroup,
  setEditGroup,
}: ChatBodyProps) {
  const { activeChannel, loadingMessenger } = useMessengerContext();

  const narrow = useNarrow();
  const className = useMemo(() => (narrow ? "narrow" : ""), [narrow]);

  const [showState, setShowState] = useState<ChatBodyState>(ChatBodyState.Chat);
  const switchShowState = useCallback(
    (state: ChatBodyState) => {
      if (narrow) {
        setShowState((prev) => (prev === state ? ChatBodyState.Chat : state));
      }
    },
    [narrow]
  );

  useEffect(() => {
    if (!narrow) {
      setShowState(ChatBodyState.Chat);
    }
  }, [narrow]);

  if (!loadingMessenger && activeChannel) {
    return (
      <Wrapper>
        <ChatBodyWrapper className={className}>
          {editGroup ? (
            <ChatCreation
              setEditGroup={setEditGroup}
              activeChannel={activeChannel}
            />
          ) : (
            <>
              <ChatTopbar
                onClick={onClick}
                setEditGroup={setEditGroup}
                showMembers={showMembers}
                showState={showState}
                switchShowState={switchShowState}
              />
              <ChatBodyContent
                showState={showState}
                switchShowState={switchShowState}
                channel={activeChannel}
              />
            </>
          )}
        </ChatBodyWrapper>
        {!permission && (
          <BluredWrapper>
            <TokenRequirement />
          </BluredWrapper>
        )}
      </Wrapper>
    );
  }

  return <ChatBodyLoading />;
}

export const Wrapper = styled.div`
  width: 61%;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;

  &.narrow {
    width: 100%;
  }
`;

const ChatBodyWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;

const BluredWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.bodyBackgroundGradient};
  backdrop-filter: blur(4px);
  z-index: 2;
`;
