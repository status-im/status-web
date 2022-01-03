import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { Reply } from "../../hooks/useReply";
import { TokenRequirement } from "../Form/TokenRequirement";
import { MessagesList } from "../Messages/MessagesList";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowMembers } from "../NarrowMode/NarrowMembers";
import { LoadingSkeleton } from "../Skeleton/LoadingSkeleton";

import { ChatCreation } from "./ChatCreation";
import { ChatInput } from "./ChatInput";
import { ChatTopbar } from "./ChatTopbar";

export enum ChatBodyState {
  Chat,
  Channels,
  Members,
}

interface ChatBodyProps {
  onClick: () => void;
  showMembers: boolean;
  permission: boolean;
}

export function ChatBody({ onClick, showMembers, permission }: ChatBodyProps) {
  const { messenger, activeChannel, communityData } = useMessengerContext();
  const narrow = useNarrow();

  const [editGroup, setEditGroup] = useState(false);
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

  const [reply, setReply] = useState<Reply | undefined>(undefined);

  return (
    <Wrapper>
      <ChatBodyWrapper className={className}>
        {editGroup && communityData ? (
          <ChatCreation
            setEditGroup={setEditGroup}
            activeChannel={activeChannel}
          />
        ) : (
          <ChatTopbar
            className={className}
            onClick={onClick}
            setEditGroup={setEditGroup}
            showMembers={showMembers}
            showState={showState}
            switchShowState={switchShowState}
          />
        )}
        {messenger ? (
          <>
            {showState === ChatBodyState.Chat && (
              <>
                {messenger && communityData ? (
                  <MessagesList setReply={setReply} />
                ) : (
                  <LoadingSkeleton />
                )}
                <ChatInput reply={reply} setReply={setReply} />
              </>
            )}

            {showState === ChatBodyState.Channels && (
              <NarrowChannels
                setShowChannels={() => switchShowState(ChatBodyState.Channels)}
              />
            )}
            {showState === ChatBodyState.Members && (
              <NarrowMembers
                switchShowMembersList={() =>
                  switchShowState(ChatBodyState.Members)
                }
              />
            )}
          </>
        ) : (
          <>
            <LoadingSkeleton />
            <ChatInput reply={reply} setReply={setReply} />
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

const Wrapper = styled.div`
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
