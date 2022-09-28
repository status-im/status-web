import React from 'react'

import { useNavigate } from 'react-router-dom'

import { styled } from '../../styles/config'
import { Avatar } from '../avatar'
import { Box } from '../box'
import { EthAddress } from '../eth-address'
import { Flex } from '../flex'
import { Tag } from '../tag'
import { Text } from '../text'

import type { Notification } from '@status-im/js'

const Base = styled('div', {
  display: 'flex',
  flexShrink: 0,
  minHeight: '60px',
  maxHeight: '126px',
  padding: '8px 16px',
  '&:hover': {
    background: '$primary-3',
  },
})

// fixme!: scroll to element
const Activity = (props: { children: Notification; close: () => void }) => {
  const value = props.children.value
  const isReply = props.children.isReply

  const navigate = useNavigate()

  return (
    <Base
      onClick={() => {
        props.close()
        navigate(`/${value.chatUuid}`, {
          // todo?: rename to `jumpedTo` or `navigateTo`
          state: { selectedMesssageId: value.messageId },
        })
      }}
    >
      <Flex
        gap={2}
        style={{
          width: '100%',
        }}
      >
        <Box>
          <Avatar
            size={40}
            name={value.member.username}
            colorHash={value.member.colorHash}
          ></Avatar>
        </Box>
        <Flex
          direction="column"
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div>
            <Flex gap="1" align="center">
              <Text color="primary" weight="500" size="15">
                {/* todo?: ens name */}
                {/* todo?: nickname */}
                {value.member.username}
              </Text>
              <EthAddress size={10} color="gray">
                {value.member.chatKey}
              </EthAddress>
              <Text size="10" color="gray">
                •
              </Text>
              <Text size="10" color="gray">
                {new Date(Number(value.timestamp)).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Flex>
          </div>
          {/* todo?: same comoponnent as for chat messages; think mention resolution */}
          <Text
            style={{
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              boxOrient: 'vertical',
              // todo: check if these field names are recommended
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {value.text}
          </Text>
          <Flex
            gap={1}
            style={{
              padding: '6px 0px 0px',
            }}
          >
            <Tag
              type="community"
              communityDisplayName={value.communityDisplayName}
              chatDisplayName={value.chatDisplayName}
              chatUuid={value.chatUuid}
              close={props.close}
            />
            {isReply && (
              <Tag
                type="reply"
                text={value.responseToMessage?.text ?? 'Message not available.'}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Base>
  )
}

export { Activity }
