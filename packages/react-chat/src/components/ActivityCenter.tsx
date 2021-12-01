import React, { useRef, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";
import { useClickOutside } from "../hooks/useClickOutside";
import { equalDate } from "../utils/equalDate";

import { buttonStyles } from "./Buttons/buttonStyle";
import {
  ContentWrapper,
  DateSeparator,
  Icon,
  MessageHeaderWrapper,
  MessageOuterWrapper,
  MessageText,
  TimeWrapper,
  UserAddress,
  UserName,
  UserNameWrapper,
} from "./Chat/ChatMessages";
import { ContactMenu } from "./Form/ContactMenu";
import { CheckSvg } from "./Icons/CheckIcon";
import { ClearSvg } from "./Icons/ClearIcon";
import { GroupIcon } from "./Icons/GroupIcon";
import { MoreIcon } from "./Icons/MoreIcon";
import { ReadIcon } from "./Icons/ReadIcon";
import { ReplyIcon } from "./Icons/ReplyIcon";
// import { UntrustworthIcon } from "./Icons/UntrustworthIcon";
import { UserIcon } from "./Icons/UserIcon";
import { textMediumStyles, textSmallStyles } from "./Text";

const today = new Date();
const mockDate = new Date(1628286358060);

type ActivityMessageProps = {
  type: string;
};

function ActivityMessage({ type }: ActivityMessageProps) {
  const { activeChannel } = useMessengerContext();

  const [showMenu, setShowMenu] = useState(false);
  const [read, setRead] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    <MessageOuterWrapper>
      <ActivityDate>
        {equalDate(mockDate, today) ? "Today" : mockDate.toLocaleDateString()}
      </ActivityDate>

      <MessageWrapper className={`${!read && "unread"}`}>
        <>
          <Icon>
            <UserIcon />
          </Icon>

          <ActivityContent>
            <MessageHeaderWrapper>
              <UserNameWrapper>
                <UserName>
                  {" "}
                  {/* {contact.customName ?? message.sender.slice(0, 10)} */}
                  Carmen
                </UserName>
                {/* {contact.customName && ( */}
                <UserAddress>
                  {/* {message.sender.slice(0, 5)}...{message.sender.slice(-3)} */}
                  0x045…d71
                </UserAddress>
                {/* )} */}
                {/* {contact.isUntrustworthy && <UntrustworthIcon />} */}
              </UserNameWrapper>
              <TimeWrapper>
                {/* {message.date.toLocaleString()} */}
                {mockDate.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </TimeWrapper>
            </MessageHeaderWrapper>
            {type === "request" && (
              <RequestHeading>Contact request:</RequestHeading>
            )}
            <MessageText>
              Hey it’s Anna from Status, do you remeber when we talked about how
              the list item is going to look like when its too long for a single
              line?
            </MessageText>
            {type === "mention" && activeChannel.type !== "dm" && (
              <Tag>
                {activeChannel.type === "group" ? <GroupIcon /> : "#"}{" "}
                {` ${activeChannel.name}`}
              </Tag>
            )}
            {type === "reply" && (
              <Tag>
                <ReplyIcon /> wdyt about this design?
              </Tag>
            )}
          </ActivityContent>
        </>
        {type === "request" && !accepted && !declined && (
          <>
            <ActivityBtn
              onClick={() => {
                setRead(true), setAccepted(true);
              }}
              className="accept"
            >
              <CheckSvg width={20} height={20} className="accept" />
            </ActivityBtn>
            <ActivityBtn
              onClick={() => {
                setRead(true), setDeclined(true);
              }}
              className="decline"
            >
              <ClearSvg width={20} height={20} className="decline" />
            </ActivityBtn>
            <ActivityBtn
              onClick={() => {
                setShowMenu((e) => !e);
              }}
            >
              {showMenu && <ContactMenu id="1" setShowMenu={setShowMenu} />}
              <MoreIcon />
            </ActivityBtn>
          </>
        )}
        {type === "request" && accepted && (
          <RequestStatus className="accepted">Accepted</RequestStatus>
        )}
        {type === "request" && declined && (
          <RequestStatus className="declined">Declined</RequestStatus>
        )}
        {type !== "request" && (
          <ActivityBtn
            onClick={() => {
              setRead(true);
            }}
            className={`${read && "read"}`}
          >
            <ReadIcon isRead={read} />
          </ActivityBtn>
        )}
      </MessageWrapper>
    </MessageOuterWrapper>
  );
}

interface ActivityCenterProps {
  setShowActivityCenter: (val: boolean) => void;
}

export function ActivityCenter({ setShowActivityCenter }: ActivityCenterProps) {
  const ref = useRef(null);
  useClickOutside(ref, () => setShowActivityCenter(false));

  return (
    <ActivityBlock ref={ref}>
      <ActivityFilter>
        <Filters>
          <Filter>All</Filter>
          <Filter>Mentions</Filter>
          <Filter>Replies</Filter>
          <Filter>Contact requests</Filter>
        </Filters>
        <ActivityBtn>
          <ReadIcon />
        </ActivityBtn>
      </ActivityFilter>
      <Activities>
        {/* {shownActivities.map((activity, idx) => (
          <ActivityMessage
            key={activity.date.getTime().toString() + activity.content}
            message={activity}
            idx={idx}
            prevMessage={shownActivities[idx - 1]}
            type="mention"
         
        ))} */}
        <ActivityMessage type="mention" />
        <ActivityMessage type="request" />
        <ActivityMessage type="reply" />
      </Activities>
    </ActivityBlock>
  );
}

const ActivityBlock = styled.div`
  width: 600px;
  height: 770px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 12px 24px rgba(0, 34, 51, 0.1);
  border-radius: 8px;
  position: absolute;
  top: 48px;
  right: 8px;
  z-index: 100;
`;

const ActivityFilter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 16px;
`;

const Filters = styled.div`
  display: flex;
`;

const Filter = styled.button`
  ${buttonStyles}
  ${textSmallStyles}

  padding: 10px 12px;
  background: ${({ theme }) => theme.bodyBackgroundColor};

  & + & {
    margin-left: 8px;
  }

  &:hover {
    background: ${({ theme }) => theme.buttonBg};
  }
`;

const ActivityBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  align-self: center;

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &.read {
    &:hover {
      background: ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.accept {
    &:hover {
      background: rgba(78, 188, 96, 0.1);
    }
  }

  &.decline {
    &:hover {
      background: rgba(255, 45, 85, 0.1);
    }
  }
`;

const Activities = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ActivityDate = styled(DateSeparator)`
  justify-content: flex-start;
  padding: 8px 16px;
  margin: 0;
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 8px 16px;

  &.unread {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;

const Tag = styled.div`
  width: fit-content;
  max-width: 70%;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 11px;
  padding: 0 6px;
  margin-top: 8px;
  cursor: pointer;

  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
  ${textSmallStyles}
`;

const RequestHeading = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.secondary};
  ${textMediumStyles}
`;
const RequestStatus = styled.p`
  font-weight: 500;
  align-self: center;
  ${textMediumStyles}

  &.accepted {
    color: ${({ theme }) => theme.greenColor};
  }

  &.declined {
    color: ${({ theme }) => theme.redColor};
  }
`;

const ActivityContent = styled(ContentWrapper)`
  max-width: calc(100% - 80px);
`;
