import React from 'react'

import { Avatar, EthAddress, Flex, Text } from '../../system'

import type { Member } from '../../protocol'
import type { AvatarProps } from '../../system/avatar'

interface Props {
  verified: boolean
  untrustworthy: boolean
  indicator?: AvatarProps['indicator']
  member: Member
}

export const MemberItem = (props: Props) => {
  const { member, indicator, verified, untrustworthy } = props
  const { chatKey, username, colorHash } = member

  return (
    <Flex gap="2" align="center" css={{ height: 56 }}>
      <Avatar
        size={32}
        indicator={indicator}
        name={username}
        colorHash={colorHash}
      />
      <div>
        <Flex align="center" gap={1}>
          <Text size="15" color="accent" truncate css={{ width: 184 }}>
            {username}
          </Text>
          {verified && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="5" r="5" fill="#4360DF" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.21097 5.79222L6.73854 3.25573C6.91216 3.08149 7.19307 3.0809 7.36869 3.25713C7.54308 3.43214 7.54399 3.71498 7.37008 3.8895L4.52534 6.74428C4.43901 6.83091 4.32615 6.87462 4.2129 6.875C4.09629 6.87412 3.98311 6.8311 3.89811 6.7458L2.6292 5.47241C2.45641 5.29901 2.4565 5.01779 2.63211 4.84156C2.8065 4.66655 3.09029 4.66758 3.26074 4.83864L4.21097 5.79222Z"
                fill="white"
              />
            </svg>
          )}
          {untrustworthy && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="5" r="5" fill="#FF2D55" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.78125 7.65625C5.78125 8.08772 5.43147 8.4375 5 8.4375C4.56853 8.4375 4.21875 8.08772 4.21875 7.65625C4.21875 7.22478 4.56853 6.875 5 6.875C5.43147 6.875 5.78125 7.22478 5.78125 7.65625ZM5 1.875C4.65482 1.875 4.375 2.15482 4.375 2.5V5.3125C4.375 5.65768 4.65482 5.9375 5 5.9375C5.34518 5.9375 5.625 5.65768 5.625 5.3125V2.5C5.625 2.15482 5.34518 1.875 5 1.875Z"
                fill="white"
              />
            </svg>
          )}
        </Flex>
        <EthAddress size={10} color="gray">
          {chatKey}
        </EthAddress>
      </div>
    </Flex>
  )
}
