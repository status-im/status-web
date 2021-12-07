import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useActivities } from "../contexts/activityProvider";
import { useMessengerContext } from "../contexts/messengerProvider";
import { useClickOutside } from "../hooks/useClickOutside";
import { Activity } from "../models/Activity";
import { equalDate } from "../utils/equalDate";

import { buttonStyles } from "./Buttons/buttonStyle";
import {
  ContentWrapper,
  DateSeparator,
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
import { HideIcon } from "./Icons/HideIcon";
import { Icon } from "./Icons/Icon";
import { MoreIcon } from "./Icons/MoreIcon";
import { ReadIcon } from "./Icons/ReadIcon";
import { ReplyIcon } from "./Icons/ReplyActivityIcon";
import { ShowIcon } from "./Icons/ShowIcon";
import { UntrustworthIcon } from "./Icons/UntrustworthIcon";
import { UserIcon } from "./Icons/UserIcon";
import { textMediumStyles, textSmallStyles } from "./Text";

const today = new Date();

type ActivityMessageProps = {
  activity: Activity;
};

function ActivityMessage({ activity }: ActivityMessageProps) {
  const { contacts } = useMessengerContext();

  const [showMenu, setShowMenu] = useState(false);

  const type = activity.type;

  const contact = useMemo(
    () => contacts[activity.user],
    [activity.user, contacts]
  );

  return (
    <MessageOuterWrapper>
      <ActivityDate>
        {equalDate(activity.date, today)
          ? "Today"
          : activity.date.toLocaleDateString()}
      </ActivityDate>

      <MessageWrapper className={`${!activity.isRead && "unread"}`}>
        <>
          <Icon>
            <UserIcon />
          </Icon>

          <ActivityContent>
            <MessageHeaderWrapper>
              <UserNameWrapper>
                <UserName>
                  {" "}
                  {contact.customName ?? activity.user.slice(0, 10)}
                </UserName>
                {contact.customName && (
                  <UserAddress>
                    {activity.user.slice(0, 5)}...{activity.user.slice(-3)}
                  </UserAddress>
                )}
                {contact.isUntrustworthy && <UntrustworthIcon />}
              </UserNameWrapper>
              <TimeWrapper>
                {activity.date.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </TimeWrapper>
            </MessageHeaderWrapper>
            {type === "request" && (
              <RequestHeading>
                Contact request
                {activity.requestType === "outcome"
                  ? ` to ${activity.user.slice(0, 10)}`
                  : ": "}
              </RequestHeading>
            )}
            <ActivityText>
              {activity.message?.content ||
                (activity.requestType === "income" && activity.request)}
            </ActivityText>
            {type === "mention" &&
              activity.channel &&
              activity.channel.type !== "dm" && (
                <Tag>
                  {activity.channel.type === "group" ? <GroupIcon /> : "#"}{" "}
                  {` ${activity.channel.name.slice(0, 10)}`}
                </Tag>
              )}
            {type === "reply" && activity.message && (
              <Tag>
                <ReplyIcon /> {activity.message.content}
              </Tag>
            )}
          </ActivityContent>
        </>
        {type === "request" &&
          !activity.status &&
          activity.requestType === "income" && (
            <>
              <ActivityBtn
                onClick={() => {
                  activity.isRead = true;
                  activity.status = "accepted";
                }}
                className="accept"
              >
                <CheckSvg width={20} height={20} className="accept" />
              </ActivityBtn>
              <ActivityBtn
                onClick={() => {
                  activity.isRead = true;
                  activity.status = "declined";
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
        {type === "request" && activity.status === "accepted" && (
          <RequestStatus className="accepted">Accepted</RequestStatus>
        )}
        {type === "request" && activity.status === "declined" && (
          <RequestStatus className="declined">Declined</RequestStatus>
        )}
        {type === "request" && activity.status === "sent" && (
          <RequestStatus>Sent</RequestStatus>
        )}
        {type !== "request" && (
          <ActivityBtn
            onClick={() => {
              activity.isRead = true;
            }}
            className={`${activity.isRead && "read"}`}
          >
            <ReadIcon isRead={activity.isRead} />
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
  const { activities } = useActivities();
  const { contacts } = useMessengerContext();

  const shownActivities = useMemo(
    () =>
      activities.filter(
        (activity) => !contacts?.[activity.user]?.blocked ?? true
      ),
    [contacts, activities, activities.length]
  );

  const ref = useRef(null);
  useClickOutside(ref, () => setShowActivityCenter(false));

  const [hideRead, setHideRead] = useState(false);

  return (
    <ActivityBlock ref={ref}>
      <ActivityFilter>
        <Filters>
          <Filter>All</Filter>
          <Filter>Mentions</Filter>
          <Filter>Replies</Filter>
          <Filter>Contact requests</Filter>
        </Filters>
        <Btns>
          <ActivityBtn
            onClick={() => {
              shownActivities.map((activity) => (activity.isRead = true));
            }}
          >
            <ReadIcon />
          </ActivityBtn>
          <ActivityBtn onClick={() => setHideRead(true)}>
            {hideRead ? <ShowIcon /> : <HideIcon />}
          </ActivityBtn>
        </Btns>
      </ActivityFilter>
      {shownActivities.length > 0 ? (
        <Activities>
          {shownActivities.map((activity) => (
            <ActivityMessage key={activity.id} activity={activity} />
          ))}
        </Activities>
      ) : (
        <EmptyActivities>Notifications will appear here</EmptyActivities>
      )}
    </ActivityBlock>
  );
}

const ActivityBlock = styled.div`
  width: 600px;
  height: 770px;
  display: flex;
  flex-direction: column;
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

  & + & {
    margin-left: 8px;
  }
`;

const Activities = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const EmptyActivities = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  color: ${({ theme }) => theme.secondary};
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

const ActivityText = styled(MessageText)`
  white-space: unset;
`;

const Tag = styled.div`
  width: fit-content;
  max-width: 100%;
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
  text-align: end;
  color: ${({ theme }) => theme.secondary};
  ${textSmallStyles}

  &.accepted {
    color: ${({ theme }) => theme.greenColor};
  }

  &.declined {
    color: ${({ theme }) => theme.redColor};
  }
`;

const ActivityContent = styled(ContentWrapper)`
  max-width: calc(100% - 80px);
  flex: 1;
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
`;
