import React from 'react'

import { styled } from '../../styles/config'
import { Avatar, DialogTrigger, EthAddress, Flex, Text } from '../../system'
import { DisconnectDialog } from './disconnect-dialog'

import type { Account } from '../../protocol'

interface Props {
  account: Account
}

export const UserItem = (props: Props) => {
  const { account } = props

  return (
    <Flex align="center" justify="between" gap={1}>
      <Flex gap="2" align="center" css={{ height: 56 }}>
        <Avatar size={32} name={account.username} />
        <div>
          <Flex align="center" gap={1}>
            <Text size="15" color="accent" truncate css={{ width: 144 }}>
              {account.username}
            </Text>
          </Flex>
          <EthAddress size={10} color="gray">
            {account.chatKey}
          </EthAddress>
        </div>
        <DialogTrigger>
          <DisconnectButton>
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.985 8.36269C16.363 8.36269 16.5523 7.90572 16.285 7.63846L14.7017 6.05509C14.4531 5.80658 14.4531 5.40365 14.7017 5.15514C14.9502 4.90662 15.3531 4.90662 15.6016 5.15514L18.9956 8.54908C19.2441 8.79759 19.2441 9.20051 18.9956 9.44903L15.6016 12.843C15.3531 13.0915 14.9502 13.0915 14.7017 12.843C14.4531 12.5945 14.4531 12.1915 14.7017 11.943L16.285 10.3596C16.5523 10.0924 16.363 9.63542 15.985 9.63542L7.51527 9.63542C7.16382 9.63542 6.87891 9.35051 6.87891 8.99905C6.87891 8.6476 7.16382 8.36269 7.51527 8.36269L15.985 8.36269Z"
                fill="#4360DF"
              />
              <path
                d="M11.1218 3.90956C11.1218 2.73805 10.1721 1.78835 9.00059 1.78835H3.90968C2.73817 1.78835 1.78847 2.73805 1.78847 3.90956V14.0914C1.78847 15.2629 2.73817 16.2126 3.90968 16.2126H9.00059C10.1721 16.2126 11.1218 15.2629 11.1218 14.0914V11.3338C11.1218 10.9824 11.4067 10.6974 11.7582 10.6974C12.1096 10.6974 12.3945 10.9824 12.3945 11.3338V14.0914C12.3945 15.9658 10.875 17.4853 9.00059 17.4853H3.90968C2.03526 17.4853 0.515744 15.9658 0.515744 14.0914V3.90956C0.515744 2.03514 2.03526 0.515625 3.90968 0.515625H9.00059C10.875 0.515625 12.3945 2.03514 12.3945 3.90956V6.66714C12.3945 7.01859 12.1096 7.3035 11.7582 7.3035C11.4067 7.3035 11.1218 7.01859 11.1218 6.66714V3.90956Z"
                fill="#4360DF"
              />
            </svg>
          </DisconnectButton>
          <DisconnectDialog account={account} />
        </DialogTrigger>
      </Flex>
    </Flex>
  )
}

const DisconnectButton = styled('button', {
  background: 'rgba(67, 96, 223, 0.1)',
  borderRadius: '50%',
  height: 32,
  width: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})
