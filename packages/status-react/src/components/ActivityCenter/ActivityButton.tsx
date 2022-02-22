import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useActivities } from "../../hooks/useActivities";
import { useClickOutside } from "../../hooks/useClickOutside";
import { TopBtn } from "../Chat/ChatTopbar";
import { ActivityIcon } from "../Icons/ActivityIcon";

import { ActivityCenter } from "./ActivityCenter";

interface ActivityButtonProps {
  className?: string;
}

export function ActivityButton({ className }: ActivityButtonProps) {
  const { activities, activityDispatch } = useActivities();
  const identity = useIdentity();
  const disabled = useMemo(() => !identity, [identity]);
  const ref = useRef(null);
  useClickOutside(ref, () => setShowActivityCenter(false));

  const [showActivityCenter, setShowActivityCenter] = useState(false);
  const badgeAmount = useMemo(
    () => activities.filter((activity) => !activity.isRead).length,
    [activities]
  );

  return (
    <ActivityWrapper ref={ref} className={className}>
      <TopBtn
        onClick={() => setShowActivityCenter(!showActivityCenter)}
        disabled={disabled}
      >
        <ActivityIcon />
        {badgeAmount > 0 && (
          <NotificationBagde
            className={
              badgeAmount > 99
                ? "countless"
                : badgeAmount > 9
                ? "wide"
                : undefined
            }
          >
            {badgeAmount < 100 ? badgeAmount : "∞"}
          </NotificationBagde>
        )}
      </TopBtn>
      {showActivityCenter && (
        <ActivityCenter
          activities={activities}
          setShowActivityCenter={setShowActivityCenter}
          activityDispatch={activityDispatch}
        />
      )}
    </ActivityWrapper>
  );
}

export const ActivityWrapper = styled.div`
  padding-left: 10px;
  margin-left: 10px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 2px;
    height: 24px;
    transform: translateY(-50%);
    border-radius: 1px;
    background: ${({ theme }) => theme.primary};
    opacity: 0.1;
  }

  &.creation {
    padding-left: 0px;
    margin-left: 16px;

    &:before {
      width: 0px;
      height: 0px;
    }
  }
`;

const NotificationBagde = styled.div`
  width: 18px;
  height: 18px;
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.notificationColor};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  border-radius: 9px;

  &.wide {
    width: 26px;
    right: -7px;
  }

  &.countless {
    width: 22px;
  }
`;
