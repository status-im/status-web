import React, { useMemo, useState } from 'react'

import styled from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { buttonTransparentStyles } from '../Buttons/buttonStyle'
import { Tooltip } from '../Form/Tooltip'
import { HideIcon } from '../Icons/HideIcon'
import { ReadIcon } from '../Icons/ReadIcon'
import { ShowIcon } from '../Icons/ShowIcon'
import { ActivityMessage } from './ActivityMessage'

import type { ActivityAction } from '../../hooks/useActivities'
import type { Activity } from '../../models/Activity'

interface ActivityCenterProps {
  activities: Activity[]
  setShowActivityCenter: (val: boolean) => void
  activityDispatch: React.Dispatch<ActivityAction>
}

export function ActivityCenter({
  activities,
  setShowActivityCenter,
  activityDispatch,
}: ActivityCenterProps) {
  const { contacts } = useMessengerContext()

  const shownActivities = useMemo(
    () =>
      activities.filter(
        activity => !contacts?.[activity.user]?.blocked ?? true
      ),
    [contacts, activities]
  )

  const [hideRead, setHideRead] = useState(false)

  const [filter, setFilter] = useState('')

  const filteredActivities = shownActivities.filter(activity =>
    filter
      ? activity.type === filter
      : hideRead
      ? activity.isRead !== true
      : activity
  )

  return (
    <ActivityBlock>
      <ActivityFilter>
        <FlexDiv>
          <FilterBtn onClick={() => setFilter('')}>All</FilterBtn>
          <FilterBtn onClick={() => setFilter('mention')}>Mentions</FilterBtn>
          <FilterBtn onClick={() => setFilter('reply')}>Replies</FilterBtn>
          <FilterBtn onClick={() => setFilter('request')}>
            Contact requests
          </FilterBtn>
        </FlexDiv>
        <Btns>
          <BtnWrapper>
            <ActivityBtn
              onClick={() => activityDispatch({ type: 'setAllAsRead' })}
            >
              <ReadIcon />
            </ActivityBtn>
            <Tooltip tip="Mark all as Read" />
          </BtnWrapper>
          <BtnWrapper>
            <ActivityBtn onClick={() => setHideRead(!hideRead)}>
              {hideRead ? <ShowIcon /> : <HideIcon />}
            </ActivityBtn>
            <Tooltip tip={hideRead ? 'Show read' : 'Hide read'} />
          </BtnWrapper>
        </Btns>
      </ActivityFilter>
      {filteredActivities.length > 0 ? (
        <Activities>
          {filteredActivities.map(activity => (
            <ActivityMessage
              key={activity.id}
              activity={activity}
              setShowActivityCenter={setShowActivityCenter}
              activityDispatch={activityDispatch}
            />
          ))}
        </Activities>
      ) : (
        <EmptyActivities>Notifications will appear here</EmptyActivities>
      )}
    </ActivityBlock>
  )
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
  top: calc(100% + 4px);
  right: 0;
  z-index: 100;
`

const ActivityFilter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 16px;
`

export const FlexDiv = styled.div`
  display: flex;
`

const FilterBtn = styled.button`
  ${buttonTransparentStyles}

  & + & {
    margin-left: 8px;
  }
`

const BtnWrapper = styled.div`
  position: relative;

  &:hover > div {
    visibility: visible;
  }
`

export const ActivityBtn = styled.button`
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
`

const Activities = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
`

const EmptyActivities = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  color: ${({ theme }) => theme.secondary};
`

const Btns = styled.div`
  display: flex;
  align-items: center;
`
