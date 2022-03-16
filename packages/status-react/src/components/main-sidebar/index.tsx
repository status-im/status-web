import React from 'react'

import { useAppState } from '~/src/contexts/app-context'
import { EditIcon } from '~/src/icons/edit-icon'
import { styled } from '~/src/styles/config'
import { Box, Button } from '~/src/system'
import { Avatar } from '~/src/system/avatar'
import { Dialog, DialogTrigger } from '~/src/system/dialog'
import { Grid } from '~/src/system/grid'
import { Heading } from '~/src/system/heading'
import { IconButton } from '~/src/system/icon-button'
import { Text } from '~/src/system/text'
import { TextInput } from '~/src/system/text-input'

import { ChannelGroup } from './channel-group'
import { ChannelItem } from './channel-item'
import { ChatItem } from './chat-item'

const CHANNELS = {
  Public: ['welcome', 'general', 'random'],
  Other: ['random', 'general', 'welcome'],
}

const CHATS = ['vitalik.eth', 'pvl.eth', 'Climate Change']

export const MainSidebar = () => {
  const { dispatch } = useAppState()

  return (
    <Wrapper>
      <DialogTrigger>
        <IdentityWrapper>
          <Avatar size={36} />
          <div>
            <Text>CryptoKitties</Text>
            <Text color="gray" size={12}>
              186 members
            </Text>
          </div>
        </IdentityWrapper>
        <Dialog title="Crypto Kitties" actionLabel="Save">
          <Text>A community of cat lovers, meow!</Text>
          <TextInput placeholder="meow" />
          <Text>
            To access this community, paste community public key in Status
            desktop or mobile app
          </Text>
          <Button>Download Status for Mac</Button>
        </Dialog>
      </DialogTrigger>

      {Object.entries(CHANNELS).map(([group, channels]) => (
        <ChannelGroup key={group} name={group}>
          {channels.map(channel => (
            <ChannelItem
              key={group + channel}
              unread={channel === 'general'}
              muted={channel === 'random'}
              active={false}
            >
              {channel}
            </ChannelItem>
          ))}
        </ChannelGroup>
      ))}

      <Separator />

      <Box>
        <Grid
          flow="column"
          align="center"
          justify="between"
          css={{ marginBottom: 16 }}
        >
          <Heading>Messages</Heading>
          <IconButton
            label="New Chat"
            onClick={() => dispatch({ type: 'NEW_CHAT' })}
          >
            <EditIcon />
          </IconButton>
        </Grid>
        {CHATS.map(chat => (
          <ChatItem key={chat} unread={false} muted={false} active={false}>
            {chat}
          </ChatItem>
        ))}
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  width: 304,
  flexShrink: 0,
  flexDirection: 'column',
  padding: '10px 16px',
  display: 'none',
  backgroundColor: '#F6F8FA',
  overflowY: 'scroll',

  '@medium': {
    display: 'flex',
  },
})

const Separator = styled('div', {
  margin: '16px 0',
  height: 1,
  background: 'rgba(0, 0, 0, 0.1)',
})

const IdentityWrapper = styled('button', {
  padding: '4px 6px',
  display: 'inline-flex',
  alignSelf: 'flex-start',
  gap: '$2',
  borderRadius: 8,
  alignItems: 'center',

  '&:hover': {
    background: '#E9EDF1',
  },
})
