import React from 'react'

import { useNavigate } from 'react-router-dom'

import { TinyChevronRightIcon } from '../../icons/tiny-chevron-right-icon'
import { TinyCommunityIcon } from '../../icons/tiny-community-icon'
import { TinyReplyIcon } from '../../icons/tiny-reply-icon'
import { styled } from '../../styles/config'
import { Avatar } from '../avatar'
import { Text } from '../text'

const Base = styled('div', {
  padding: '0px 6px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '11px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  width: 'max-content',
  color: '$gray-1',
  gap: '6px',
  '&:hover': {
    cursor: 'default',
  },
})

const Segment = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

const PathLink = styled('a', {
  '&:hover': {
    textDecoration: 'underline',
  },
})

interface CommunityProps {
  type: 'community'
  communityDisplayName: string
  chatDisplayName: string
  chatUuid: string
  onNavigateChange: () => void
}
interface ReplyProps {
  type: 'reply'
  text: string
}

// fixme: clicking on flex gab/space between components captures and handles click events
const Tag = (props: CommunityProps | ReplyProps) => {
  const { type } = props

  // todo?: extract together with `PathLink`
  const navigate = useNavigate()

  switch (type) {
    case 'community':
      return (
        <Base>
          <Segment
            role="none"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <TinyCommunityIcon />
            <Avatar
              size={16}
              name={props.communityDisplayName}
              initialsLength={1}
            />
            <Text color="current" weight="500">
              {props.communityDisplayName}
            </Text>
          </Segment>
          <Segment
            role="none"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <TinyChevronRightIcon />
          </Segment>
          <Segment>
            <PathLink
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                props.onNavigateChange()
                navigate(`/${props.chatUuid}`)
              }}
            >
              <Text color="current" weight="500">
                #{props.chatDisplayName}
              </Text>
            </PathLink>
          </Segment>
        </Base>
      )

    case 'reply':
      return (
        <Base>
          <Segment
            role="none"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <TinyReplyIcon />
            <Text color="current" weight="500">
              {props.text}
            </Text>
          </Segment>
        </Base>
      )

    default:
      return null
  }
}

export { Tag }
